<script lang="ts">
	import { onMount } from 'svelte';
	import OllDiagram from '$lib/OllDiagram.svelte';
	import { ollCases, ollGroups, type OllCase } from '$lib/oll';

	const storageKey = 'oll-trainer-selected-v1';
	const aufs = ['', 'U', 'U2', "U'"];

	let selectedIds = $state<number[]>(ollCases.map((oll) => oll.id));
	let deck = $state<number[]>([]);
	let current = $state<OllCase | null>(null);
	let currentSetup = $state('');
	let revealed = $state(false);
	let selectorOpen = $state(false);
	let copied = $state(false);
	let cyclePosition = $state(0);

	const selectedCount = $derived(selectedIds.length);
	const selectedSet = $derived(new Set(selectedIds));

	onMount(() => {
		const saved = localStorage.getItem(storageKey);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (
					Array.isArray(parsed) &&
					parsed.length > 0 &&
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

	function shuffle(values: number[]) {
		const shuffled = [...values];
		for (let i = shuffled.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	function refillDeck() {
		deck = shuffle(selectedIds);
		if (deck.length > 1 && current && deck[deck.length - 1] === current.id) {
			[deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
		}
		cyclePosition = 0;
	}

	function nextCase() {
		if (selectedIds.length === 0) return;
		if (deck.length === 0) refillDeck();

		const id = deck.pop();
		current = ollCases.find((oll) => oll.id === id) ?? ollCases[0];
		const auf = aufs[Math.floor(Math.random() * aufs.length)];
		currentSetup = `${current.setup}${auf ? ` ${auf}` : ''}`;
		revealed = false;
		copied = false;
		cyclePosition += 1;
	}

	function persistSelection() {
		localStorage.setItem(storageKey, JSON.stringify(selectedIds));
		deck = [];
		cyclePosition = 0;
	}

	function toggleCase(id: number) {
		selectedIds = selectedSet.has(id)
			? selectedIds.filter((selectedId) => selectedId !== id)
			: [...selectedIds, id].sort((a, b) => a - b);
		persistSelection();
	}

	function setGroup(group: string, enabled: boolean) {
		const groupIds = ollCases.filter((oll) => oll.group === group).map((oll) => oll.id);
		const next = new Set(selectedIds);
		for (const id of groupIds) enabled ? next.add(id) : next.delete(id);
		selectedIds = [...next].sort((a, b) => a - b);
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
		if (selectedIds.length === 0) return;
		selectorOpen = false;
		if (!current || !selectedSet.has(current.id)) nextCase();
	}

	async function copySetup() {
		if (!currentSetup) return;
		await navigator.clipboard.writeText(currentSetup);
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
		content="A distraction-free Rubik's Cube OLL trainer with balanced case rotation."
	/>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<main>
	<header>
		<a class="brand" href="/" aria-label="OLL Trainer home">
			<span class="brand-mark"></span>
			<span>OLL / TRAINER</span>
		</a>
		<button class="case-button" onclick={() => (selectorOpen = true)}>
			<span>{selectedCount}</span> cases
		</button>
	</header>

	<section class="trainer" aria-live="polite">
		<div class="eyebrow">
			<span>SETUP</span>
			{#if current}
				<span>{cyclePosition} / {selectedCount}</span>
			{/if}
		</div>

		<button class="scramble" onclick={copySetup} aria-label="Copy setup algorithm">
			{currentSetup || 'Loading cases…'}
			<span class:visible={copied} class="copy-note">{copied ? 'Copied' : 'Click to copy'}</span>
		</button>

		<div class="solution-area">
			{#if current && revealed}
				<div class="solution">
					<div class="case-identity">
						<div class="solution-diagram">
							<OllDiagram pattern={current.pattern} label={`OLL ${current.id} diagram`} />
						</div>
						<div>
							<span>OLL {current.id}</span>
							<small>{current.group}</small>
						</div>
					</div>
					<p>{current.algorithm}</p>
				</div>
			{:else}
				<button class="reveal" onclick={() => (revealed = true)}>Reveal algorithm</button>
			{/if}
		</div>

		<button class="next" onclick={nextCase}>
			Next case
			<kbd>Space</kbd>
		</button>
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
				{#each ollGroups as group}
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
							{#each groupCases as oll}
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
				{#if selectedCount === 0}<span>Select at least one case.</span>{:else}<span
						>Selection saves automatically.</span
					>{/if}
				<button class="done" onclick={closeSelector} disabled={selectedCount === 0}>Done</button>
			</div>
		</div>
	</div>
{/if}
