<script lang="ts">
	let { pattern, label = '' }: { pattern: string; label?: string } = $props();

	const cells = [
		{ index: 11, row: 1, col: 2 },
		{ index: 10, row: 1, col: 3 },
		{ index: 9, row: 1, col: 4 },
		{ index: 15, row: 2, col: 1 },
		{ index: 0, row: 2, col: 2 },
		{ index: 1, row: 2, col: 3 },
		{ index: 2, row: 2, col: 4 },
		{ index: 20, row: 2, col: 5 },
		{ index: 16, row: 3, col: 1 },
		{ index: 3, row: 3, col: 2 },
		{ index: 4, row: 3, col: 3 },
		{ index: 5, row: 3, col: 4 },
		{ index: 19, row: 3, col: 5 },
		{ index: 17, row: 4, col: 1 },
		{ index: 6, row: 4, col: 2 },
		{ index: 7, row: 4, col: 3 },
		{ index: 8, row: 4, col: 4 },
		{ index: 18, row: 4, col: 5 },
		{ index: 12, row: 5, col: 2 },
		{ index: 13, row: 5, col: 3 },
		{ index: 14, row: 5, col: 4 }
	];
</script>

<div class="diagram" role="img" aria-label={label}>
	{#each cells as cell (cell.index)}
		<span
			class:top={cell.row >= 2 && cell.row <= 4 && cell.col >= 2 && cell.col <= 4}
			class:yellow={pattern[cell.index] === 'y'}
			class:green={pattern[cell.index] === 'g'}
			class:orange={pattern[cell.index] === 'o'}
			class:blue={pattern[cell.index] === 'b'}
			class:red={pattern[cell.index] === 'r'}
			style={`grid-row:${cell.row};grid-column:${cell.col}`}
		></span>
	{/each}
</div>

<style>
	.diagram {
		display: grid;
		grid-template:
			0.5fr repeat(3, 1fr) 0.5fr /
			0.5fr repeat(3, 1fr) 0.5fr;
		gap: 2px;
		width: 100%;
		aspect-ratio: 1;
	}

	span {
		border-radius: 1px;
		background: #333732;
	}

	span.top {
		outline: 1px solid #545951;
		outline-offset: 0;
	}

	span.yellow {
		--sticker: #d8fa65;
	}

	span.green {
		--sticker: #46d17b;
	}

	span.orange {
		--sticker: #ffad3d;
	}

	span.blue {
		--sticker: #4f7fff;
	}

	span.red {
		--sticker: #f04464;
	}

	span.yellow,
	span.green,
	span.orange,
	span.blue,
	span.red {
		background: var(--sticker);
		box-shadow: 0 0 8px color-mix(in srgb, var(--sticker) 18%, transparent);
	}
</style>
