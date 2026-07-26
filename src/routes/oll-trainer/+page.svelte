<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import OllDiagram from '$lib/OllDiagram.svelte';
	import scrambleData from '$lib/generated/oll-scrambles.json';
	import { ollCases, ollGroups, type OllCase } from '$lib/oll';

	const storageKey = 'oll-trainer-selected-v1';
	type Orientation = '0' | 'U' | 'U2' | "U'";
	type ScramblePools = Record<string, Record<Orientation, string[]>>;

	const orientations = scrambleData.orientations as Orientation[];
	const scramblePools = scrambleData.cases as ScramblePools;

	let selectedIds = $state<number[]>(ollCases.map((oll) => oll.id));
	let deck = $state<number[]>([]);
	let current = $state<OllCase | null>(null);
	let currentScramble = $state('');
	let revealed = $state(false);
	let selectorOpen = $state(false);
	let copied = $state(false);
	let cyclePosition = $state(0);
	let orientationDecks: Record<number, Orientation[]> = {};
	let scrambleDecks: Record<string, string[]> = {};
	let lastOrientations: Partial<Record<number, Orientation>> = {};
	let lastScrambles: Record<string, string> = {};

	const selectedCount = $derived(selectedIds.length);
	const selectedSet = $derived(new Set(selectedIds));
	const scrambleLines = $derived(splitScramble(currentScramble));

	onMount(() => {
		const saved = localStorage.getItem(storageKey);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (
					Array.isArray(parsed) &&
					parsed.every((id) => Number.isInteger(id) && id >= 1 && id <= 57)
				) {
					selectedIds = [...new Set(parsed)];
				}
			} catch {
				localStorage.removeItem(storageKey);
			}
		}
		nextCase();
	});

	function shuffle<T>(values: readonly T[]) {
		const shuffled = [...values];
		for (let i = shuffled.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	function splitScramble(scramble: string) {
		const moves = scramble.split(/\s+/).filter(Boolean);
		if (moves.length < 2) return moves;

		let bestSplit = 1;
		let smallestDifference = Number.POSITIVE_INFINITY;

		for (let index = 1; index < moves.length; index += 1) {
			const firstLength = moves.slice(0, index).join(' ').length;
			const secondLength = moves.slice(index).join(' ').length;
			const difference = Math.abs(firstLength - secondLength);

			if (difference < smallestDifference) {
				bestSplit = index;
				smallestDifference = difference;
			}
		}

		return [moves.slice(0, bestSplit).join(' '), moves.slice(bestSplit).join(' ')];
	}

	function refillDeck() {
		deck = shuffle(selectedIds);
		if (deck.length > 1 && current && deck[deck.length - 1] === current.id) {
			[deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
		}
		cyclePosition = 0;
	}

	function drawOrientation(caseId: number) {
		let orientationDeck = orientationDecks[caseId] ?? [];

		if (orientationDeck.length === 0) {
			orientationDeck = shuffle(orientations);
			const lastOrientation = lastOrientations[caseId];
			const nextIndex = orientationDeck.length - 1;

			if (orientationDeck.length > 1 && orientationDeck[nextIndex] === lastOrientation) {
				[orientationDeck[0], orientationDeck[nextIndex]] = [
					orientationDeck[nextIndex],
					orientationDeck[0]
				];
			}
		}

		const orientation = orientationDeck.pop();
		if (!orientation) throw new Error(`No orientations available for OLL ${caseId}.`);

		orientationDecks[caseId] = orientationDeck;
		lastOrientations[caseId] = orientation;
		return orientation;
	}

	function drawScramble(caseId: number, orientation: Orientation) {
		const poolKey = `${caseId}:${orientation}`;
		let scrambleDeck = scrambleDecks[poolKey] ?? [];

		if (scrambleDeck.length === 0) {
			const sourcePool = scramblePools[String(caseId)]?.[orientation];
			if (!sourcePool?.length) {
				throw new Error(`No scrambles available for OLL ${caseId}, orientation ${orientation}.`);
			}

			scrambleDeck = shuffle(sourcePool);
			const lastScramble = lastScrambles[poolKey];
			const nextIndex = scrambleDeck.length - 1;

			if (scrambleDeck.length > 1 && scrambleDeck[nextIndex] === lastScramble) {
				[scrambleDeck[0], scrambleDeck[nextIndex]] = [scrambleDeck[nextIndex], scrambleDeck[0]];
			}
		}

		const scramble = scrambleDeck.pop();
		if (!scramble) throw new Error(`Could not draw a scramble for OLL ${caseId}.`);

		scrambleDecks[poolKey] = scrambleDeck;
		lastScrambles[poolKey] = scramble;
		return scramble;
	}

	function nextCase() {
		if (selectedIds.length === 0) {
			current = null;
			currentScramble = '';
			revealed = false;
			copied = false;
			return;
		}
		if (deck.length === 0) refillDeck();

		const id = deck.pop();
		current = ollCases.find((oll) => oll.id === id) ?? ollCases[0];
		const orientation = drawOrientation(current.id);
		currentScramble = drawScramble(current.id, orientation);
		revealed = false;
		copied = false;
		cyclePosition += 1;
	}

	function persistSelection() {
		localStorage.setItem(storageKey, JSON.stringify(selectedIds));
		deck = [];
		cyclePosition = 0;
		if (selectedIds.length === 0) nextCase();
	}

	function toggleCase(id: number) {
		selectedIds = selectedSet.has(id)
			? selectedIds.filter((selectedId) => selectedId !== id)
			: [...selectedIds, id].sort((a, b) => a - b);
		persistSelection();
	}

	function setGroup(group: string, enabled: boolean) {
		const groupIds = ollCases.filter((oll) => oll.group === group).map((oll) => oll.id);
		selectedIds = (
			enabled
				? [...selectedIds, ...groupIds.filter((id) => !selectedIds.includes(id))]
				: selectedIds.filter((id) => !groupIds.includes(id))
		).sort((a, b) => a - b);
		persistSelection();
	}

	function selectAll() {
		selectedIds = ollCases.map((oll) => oll.id);
		persistSelection();
	}

	function clearAll() {
		selectedIds = [];
		persistSelection();
	}

	function closeSelector() {
		selectorOpen = false;
		if (selectedIds.length === 0) {
			nextCase();
			return;
		}
		if (!current || !selectedSet.has(current.id)) nextCase();
	}

	async function copyScramble() {
		if (!currentScramble) return;
		await navigator.clipboard.writeText(currentScramble);
		copied = true;
		window.setTimeout(() => (copied = false), 1200);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && selectorOpen) {
			closeSelector();
			return;
		}
		if (
			event.code !== 'Space' ||
			selectorOpen ||
			event.repeat ||
			(event.target instanceof HTMLElement &&
				['BUTTON', 'A', 'INPUT'].includes(event.target.tagName))
		) {
			return;
		}
		event.preventDefault();
		nextCase();
	}
</script>

<svelte:head>
	<title>OLL Trainer</title>
	<meta
		name="description"
		content="Practice all 57 Rubik's Cube OLL cases with balanced, varied scrambles."
	/>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<main>
	<header>
		<a class="brand" href={resolve('/')} aria-label="OLL Trainer home">
			<span class="brand-mark"></span>
			<span>OLL Trainer</span>
		</a>
		<button class="case-button" onclick={() => (selectorOpen = true)}>
			<span>{selectedCount}</span> cases
		</button>
	</header>

	<section class="trainer" aria-live="polite">
		<div class="eyebrow">
			<span>SCRAMBLE</span>
			{#if current}
				<span>{cyclePosition} / {selectedCount}</span>
			{/if}
		</div>

		<button
			class="scramble"
			onclick={copyScramble}
			aria-label={selectedCount === 0 ? 'No cases selected' : 'Copy scramble'}
			disabled={selectedCount === 0}
		>
			{#if selectedCount === 0}
				<span class="scramble-line empty-message">No cases selected</span>
			{:else if currentScramble}
				{#each scrambleLines as line (line)}
					<span class="scramble-line">{line}</span>
				{/each}
			{:else}
				<span class="scramble-line">Loading cases…</span>
			{/if}
			<span class:visible={copied} class="copy-note">{copied ? 'Copied' : 'Click to copy'}</span>
		</button>

		<div class="solution-area" id="algorithm-solution">
			{#if selectedCount === 0}
				<button class="reveal" onclick={() => (selectorOpen = true)}>Choose cases</button>
			{:else if current && revealed}
				<div class="solution">
					<div class="solution-header">
						<div class="case-identity">
							<div class="solution-diagram">
								<OllDiagram pattern={current.pattern} label={`OLL ${current.id} diagram`} />
							</div>
							<div>
								<span>OLL {current.id}</span>
								<small>{current.group}</small>
							</div>
						</div>
						<button
							class="solution-close"
							onclick={() => (revealed = false)}
							aria-label="Close algorithm">Close</button
						>
					</div>
					<p>{current.algorithm}</p>
				</div>
			{:else}
				<button
					class="reveal"
					onclick={() => (revealed = true)}
					aria-controls="algorithm-solution"
					aria-expanded="false">Reveal algorithm</button
				>
			{/if}
		</div>

		{#if selectedCount > 0}
			<button class="next" onclick={nextCase}>
				Next case
				<kbd>Space</kbd>
			</button>
		{/if}
	</section>

	<footer>
		<span>Every selected case appears once before the deck reshuffles.</span>
		<a href="https://speedcubedb.com/a/3x3/OLL" target="_blank" rel="noreferrer"
			>Algorithms: SpeedCubeDB ↗</a
		>
	</footer>
</main>

{#if selectorOpen}
	<div
		class="backdrop"
		role="presentation"
		onclick={(event) => event.target === event.currentTarget && closeSelector()}
	>
		<div class="selector" role="dialog" aria-modal="true" aria-labelledby="selector-title">
			<div class="selector-header">
				<div>
					<span class="eyebrow-label">TRAINING DECK</span>
					<h2 id="selector-title">Choose OLL cases</h2>
				</div>
				<button class="close" onclick={closeSelector} aria-label="Close case selector">×</button>
			</div>

			<div class="selector-tools">
				<span>{selectedCount} of 57 selected</span>
				<div>
					<button onclick={selectAll}>Select all</button>
					<button onclick={clearAll}>Clear</button>
				</div>
			</div>

			<div class="groups">
				{#each ollGroups as group (group)}
					{@const groupCases = ollCases.filter((oll) => oll.group === group)}
					{@const groupSelected = groupCases.filter((oll) => selectedSet.has(oll.id)).length}
					<section class="case-group">
						<div class="group-heading">
							<div>
								<h3>{group}</h3>
								<span>{groupSelected}/{groupCases.length}</span>
							</div>
							<button onclick={() => setGroup(group, groupSelected !== groupCases.length)}>
								{groupSelected === groupCases.length ? 'Clear group' : 'Select group'}
							</button>
						</div>
						<div class="case-grid">
							{#each groupCases as oll (oll.id)}
								<button
									class:selected={selectedSet.has(oll.id)}
									class="case-card"
									onclick={() => toggleCase(oll.id)}
									aria-pressed={selectedSet.has(oll.id)}
								>
									<OllDiagram pattern={oll.pattern} label={`OLL ${oll.id}`} />
									<span>OLL {oll.id}</span>
								</button>
							{/each}
						</div>
					</section>
				{/each}
			</div>

			<div class="selector-footer">
				{#if selectedCount === 0}<span>No cases selected.</span>{:else}<span
						>Selection saves automatically.</span
					>{/if}
				<button class="done" onclick={closeSelector}>Done</button>
			</div>
		</div>
	</div>
{/if}
