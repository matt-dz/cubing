<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import PllDiagram from '$lib/PllDiagram.svelte';
	import scrambleData from '$lib/generated/pll-scrambles.json';
	import { pllCases, pllGroups, type PllCase } from '$lib/pll';

	const selectionStorageKey = 'pll-trainer-selected-v1';
	const starredStorageKey = 'pll-trainer-starred-v1';
	type Orientation = '0' | 'U' | 'U2' | "U'";
	type TrainingPhase = 'regular' | 'starred';
	type ScramblePools = Record<string, Record<Orientation, string[]>>;
	type HistoryEntry = {
		caseId: string;
		scramble: string;
		phase: TrainingPhase;
		cyclePosition: number;
		cycleTotal: number;
	};

	const orientations = scrambleData.orientations as Orientation[];
	const scramblePools = scrambleData.cases as ScramblePools;
	const validCaseIds = new Set(pllCases.map((pll) => pll.id));
	const caseOrder = new Map(pllCases.map((pll, index) => [pll.id, index]));

	let selectedIds = $state<string[]>(pllCases.map((pll) => pll.id));
	let starredIds = $state<string[]>([]);
	let deck = $state<string[]>([]);
	let current = $state<PllCase | null>(null);
	let currentScramble = $state('');
	let revealed = $state(false);
	let selectorOpen = $state(false);
	let helpOpen = $state(false);
	let copied = $state(false);
	let phase = $state<TrainingPhase>('regular');
	let cyclePosition = $state(0);
	let cycleTotal = $state(0);
	let history = $state<HistoryEntry[]>([]);
	let historyIndex = $state(-1);
	let orientationDecks: Record<string, Orientation[]> = {};
	let scrambleDecks: Record<string, string[]> = {};
	let lastOrientations: Partial<Record<string, Orientation>> = {};
	let lastScrambles: Record<string, string> = {};

	const selectedCount = $derived(selectedIds.length);
	const selectedSet = $derived(new Set(selectedIds));
	const currentIsStarred = $derived(current ? starredIds.includes(current.id) : false);
	const canGoPrevious = $derived(historyIndex > 0);
	const scrambleLines = $derived(splitScramble(currentScramble));

	onMount(() => {
		selectedIds = readStoredIds(selectionStorageKey, selectedIds);
		starredIds = readStoredIds(starredStorageKey, []);
		nextCase();
	});

	function readStoredIds(key: string, fallback: string[]) {
		const saved = localStorage.getItem(key);
		if (!saved) return fallback;

		try {
			const parsed = JSON.parse(saved);
			if (
				Array.isArray(parsed) &&
				parsed.every((id) => typeof id === 'string' && validCaseIds.has(id))
			) {
				return [...new Set<string>(parsed)];
			}
		} catch {
			// Invalid local data falls through to the default.
		}

		localStorage.removeItem(key);
		return fallback;
	}

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

	function refillDeck(ids: string[], nextPhase: TrainingPhase) {
		phase = nextPhase;
		deck = shuffle(ids);
		if (deck.length > 1 && current && deck[deck.length - 1] === current.id) {
			[deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
		}
		cyclePosition = 0;
		cycleTotal = deck.length;
	}

	function prepareNextDeck() {
		if (
			starredIds.length > 0 &&
			(phase === 'starred' || (phase === 'regular' && cyclePosition > 0))
		) {
			refillDeck(starredIds, 'starred');
			return;
		}

		refillDeck(selectedIds, 'regular');
	}

	function drawOrientation(caseId: string) {
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
		if (!orientation) throw new Error(`No orientations available for PLL ${caseId}.`);

		orientationDecks[caseId] = orientationDeck;
		lastOrientations[caseId] = orientation;
		return orientation;
	}

	function drawScramble(caseId: string, orientation: Orientation) {
		const poolKey = `${caseId}:${orientation}`;
		let scrambleDeck = scrambleDecks[poolKey] ?? [];

		if (scrambleDeck.length === 0) {
			const sourcePool = scramblePools[String(caseId)]?.[orientation];
			if (!sourcePool?.length) {
				throw new Error(`No scrambles available for PLL ${caseId}, orientation ${orientation}.`);
			}

			scrambleDeck = shuffle(sourcePool);
			const lastScramble = lastScrambles[poolKey];
			const nextIndex = scrambleDeck.length - 1;

			if (scrambleDeck.length > 1 && scrambleDeck[nextIndex] === lastScramble) {
				[scrambleDeck[0], scrambleDeck[nextIndex]] = [scrambleDeck[nextIndex], scrambleDeck[0]];
			}
		}

		const scramble = scrambleDeck.pop();
		if (!scramble) throw new Error(`Could not draw a scramble for PLL ${caseId}.`);

		scrambleDecks[poolKey] = scrambleDeck;
		lastScrambles[poolKey] = scramble;
		return scramble;
	}

	function nextCase() {
		if (historyIndex < history.length - 1) {
			historyIndex += 1;
			showHistoryEntry(history[historyIndex]);
			return;
		}

		if (selectedIds.length === 0) {
			current = null;
			currentScramble = '';
			revealed = false;
			copied = false;
			phase = 'regular';
			cyclePosition = 0;
			cycleTotal = 0;
			history = [];
			historyIndex = -1;
			return;
		}
		if (deck.length === 0) prepareNextDeck();

		const id = deck.pop();
		const nextPllCase = pllCases.find((pll) => pll.id === id) ?? pllCases[0];
		const orientation = drawOrientation(nextPllCase.id);
		const scramble = drawScramble(nextPllCase.id, orientation);
		cyclePosition += 1;

		const entry: HistoryEntry = {
			caseId: nextPllCase.id,
			scramble,
			phase,
			cyclePosition,
			cycleTotal
		};
		history = [...history, entry];
		historyIndex = history.length - 1;
		showHistoryEntry(entry);
	}

	function previousCase() {
		if (!canGoPrevious) return;
		historyIndex -= 1;
		showHistoryEntry(history[historyIndex]);
	}

	function showHistoryEntry(entry: HistoryEntry) {
		current = pllCases.find((pll) => pll.id === entry.caseId) ?? pllCases[0];
		currentScramble = entry.scramble;
		phase = entry.phase;
		cyclePosition = entry.cyclePosition;
		cycleTotal = entry.cycleTotal;
		revealed = false;
		copied = false;
	}

	function persistSelection() {
		localStorage.setItem(selectionStorageKey, JSON.stringify(selectedIds));
		deck = [];
		phase = 'regular';
		cyclePosition = 0;
		cycleTotal = 0;
		history = [];
		historyIndex = -1;
		if (selectedIds.length === 0) nextCase();
	}

	function toggleCurrentStar() {
		if (!current) return;
		const currentId = current.id;

		starredIds = currentIsStarred
			? starredIds.filter((id) => id !== currentId)
			: sortCaseIds([...starredIds, currentId]);
		localStorage.setItem(starredStorageKey, JSON.stringify(starredIds));
	}

	function toggleCase(id: string) {
		selectedIds = selectedSet.has(id)
			? selectedIds.filter((selectedId) => selectedId !== id)
			: sortCaseIds([...selectedIds, id]);
		persistSelection();
	}

	function setGroup(group: string, enabled: boolean) {
		const groupIds = pllCases.filter((pll) => pll.group === group).map((pll) => pll.id);
		selectedIds = enabled
			? [...selectedIds, ...groupIds.filter((id) => !selectedIds.includes(id))]
			: selectedIds.filter((id) => !groupIds.includes(id));
		selectedIds = sortCaseIds(selectedIds);
		persistSelection();
	}

	function selectAll() {
		selectedIds = pllCases.map((pll) => pll.id);
		persistSelection();
	}

	function clearAll() {
		selectedIds = [];
		persistSelection();
	}

	function sortCaseIds(ids: string[]) {
		return ids.sort((a, b) => (caseOrder.get(a) ?? 0) - (caseOrder.get(b) ?? 0));
	}

	function closeSelector() {
		selectorOpen = false;
		if (selectedIds.length === 0) {
			nextCase();
			return;
		}
		if (!current || !selectedSet.has(current.id) || cycleTotal === 0) nextCase();
	}

	async function copyScramble() {
		if (!currentScramble) return;
		await navigator.clipboard.writeText(currentScramble);
		copied = true;
		window.setTimeout(() => (copied = false), 1200);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && (selectorOpen || helpOpen)) {
			if (selectorOpen) closeSelector();
			helpOpen = false;
			return;
		}

		const targetIsInteractive =
			event.target instanceof HTMLElement &&
			['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);

		if (
			event.key.toLowerCase() === 's' &&
			!selectorOpen &&
			!helpOpen &&
			!event.repeat &&
			!targetIsInteractive
		) {
			event.preventDefault();
			toggleCurrentStar();
			return;
		}

		if (selectorOpen || helpOpen || event.repeat || targetIsInteractive) {
			return;
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			previousCase();
			return;
		}

		if (event.code !== 'Space' && event.key !== 'ArrowRight') return;
		event.preventDefault();
		nextCase();
	}
</script>

<svelte:head>
	<title>3×3 PLL Trainer – All 21 Cases | Cubing</title>
	<meta
		name="description"
		content="Practice all 21 Rubik's Cube 3×3 PLL cases with balanced case rotation and varied scrambles."
	/>
	<link rel="canonical" href="https://cubing.mutex.nyc/pll-trainer" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<main>
	<header>
		<a class="brand" href={resolve('/')} aria-label="PLL Trainer home">
			<span class="brand-mark"></span>
			<h1>3×3 PLL Trainer</h1>
		</a>
		<button class="case-button" onclick={() => (selectorOpen = true)}>
			<span>{selectedCount}</span> cases
		</button>
	</header>

	<section class="trainer" aria-live="polite">
		<div class="eyebrow">
			<span class:review-phase={phase === 'starred'}>
				{phase === 'starred' ? 'STARRED REVIEW' : 'SCRAMBLE'}
			</span>
			{#if current}
				<span>{cyclePosition} / {cycleTotal}</span>
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
								<PllDiagram pattern={current.pattern} label={`PLL ${current.id} diagram`} />
							</div>
							<div>
								<span>{current.id}</span>
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

		{#if selectedCount > 0 && current}
			<div class="trainer-controls">
				<button
					class:active={currentIsStarred}
					class="star-case"
					onclick={toggleCurrentStar}
					aria-pressed={currentIsStarred}
					aria-label={`${currentIsStarred ? 'Unstar' : 'Star'} PLL ${current.id}`}
				>
					<span aria-hidden="true">{currentIsStarred ? '★' : '☆'}</span>
					{currentIsStarred ? 'Unstar' : 'Star case'}
					<kbd>S</kbd>
				</button>
				<div class="case-navigation">
					<button class="previous" onclick={previousCase} disabled={!canGoPrevious}>
						Previous
						<kbd>←</kbd>
					</button>
					<button class="next" onclick={nextCase}>
						Next case
						<span class="key-hints">
							<kbd>Space</kbd>
							<kbd>→</kbd>
						</span>
					</button>
				</div>
			</div>
		{/if}
	</section>

	<footer>
		<a href="https://speedcubedb.com/a/3x3/PLL" target="_blank" rel="noreferrer"
			>Algorithms: SpeedCubeDB ↗</a
		>
	</footer>
</main>

<button
	class="help-button"
	onclick={() => (helpOpen = true)}
	aria-label="How the PLL trainer works"
	aria-controls="trainer-help"
	aria-expanded={helpOpen}>?</button
>

{#if helpOpen}
	<div
		class="backdrop"
		role="presentation"
		onclick={(event) => event.target === event.currentTarget && (helpOpen = false)}
	>
		<div
			class="help-panel"
			id="trainer-help"
			role="dialog"
			aria-modal="true"
			aria-labelledby="help-title"
		>
			<div class="help-header">
				<div>
					<span class="eyebrow-label">HELP</span>
					<h2 id="help-title">How the trainer works</h2>
				</div>
				<button class="close" onclick={() => (helpOpen = false)} aria-label="Close help">×</button>
			</div>

			<ol class="help-steps">
				<li>
					<strong>Choose your cases.</strong>
					<span>All 21 are selected by default. Your selection is saved on this browser.</span>
				</li>
				<li>
					<strong>Apply the scramble.</strong>
					<span>Click it to copy, then identify and solve the PLL case on your cube.</span>
				</li>
				<li>
					<strong>Advance when ready.</strong>
					<span
						>Use Next, Space, or Right Arrow. Previous or Left Arrow restores the exact earlier
						scramble.</span
					>
				</li>
				<li>
					<strong>Reveal only if needed.</strong>
					<span>The reveal shows the case, group, and reference algorithm.</span>
				</li>
				<li>
					<strong>Star cases for another pass.</strong>
					<span
						>Press S or Star case. After the normal cycle, starred review repeats until you unstar
						every case.</span
					>
				</li>
			</ol>

			<p class="help-note">
				Each case rotates through four orientations and ten different scrambles per orientation.
			</p>
		</div>
	</div>
{/if}

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
					<h2 id="selector-title">Choose PLL cases</h2>
				</div>
				<button class="close" onclick={closeSelector} aria-label="Close case selector">×</button>
			</div>

			<div class="selector-tools">
				<span>{selectedCount} of 21 selected</span>
				<div>
					<button onclick={selectAll}>Select all</button>
					<button onclick={clearAll}>Clear</button>
				</div>
			</div>

			<div class="groups">
				{#each pllGroups as group (group)}
					{@const groupCases = pllCases.filter((pll) => pll.group === group)}
					{@const groupSelected = groupCases.filter((pll) => selectedSet.has(pll.id)).length}
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
							{#each groupCases as pll (pll.id)}
								<button
									class:selected={selectedSet.has(pll.id)}
									class="case-card"
									onclick={() => toggleCase(pll.id)}
									aria-pressed={selectedSet.has(pll.id)}
								>
									<PllDiagram pattern={pll.pattern} label={`PLL ${pll.id}`} />
									<span>{pll.id}</span>
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
