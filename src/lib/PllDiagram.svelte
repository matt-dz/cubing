<script lang="ts">
	type Permutation = number[];
	type ArrowKind = 'edge' | 'corner';
	type Point = { x: number; y: number };
	type Arrow = {
		kind: ArrowKind;
		x: number;
		y: number;
		length: number;
		angle: number;
		bidirectional: boolean;
	};

	let {
		pattern,
		edgePermutation,
		cornerPermutation,
		showArrows = true,
		label = ''
	}: {
		pattern: string;
		edgePermutation: Permutation;
		cornerPermutation: Permutation;
		showArrows?: boolean;
		label?: string;
	} = $props();

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

	const positions: Record<ArrowKind, Point[]> = {
		edge: [
			{ x: 50, y: 75 },
			{ x: 75, y: 50 },
			{ x: 50, y: 25 },
			{ x: 25, y: 50 }
		],
		corner: [
			{ x: 73, y: 73 },
			{ x: 73, y: 27 },
			{ x: 27, y: 27 },
			{ x: 27, y: 73 }
		]
	};

	function buildArrows(permutation: Permutation, kind: ArrowKind): Arrow[] {
		return permutation.flatMap((destination, source) => {
			if (source === destination) return [];

			const bidirectional = permutation[destination] === source;
			if (bidirectional && source > destination) return [];

			const start = positions[kind][source];
			const end = positions[kind][destination];
			const dx = end.x - start.x;
			const dy = end.y - start.y;
			const distance = Math.hypot(dx, dy);
			const inset = 5;

			return [
				{
					kind,
					x: start.x + (dx / distance) * inset,
					y: start.y + (dy / distance) * inset,
					length: distance - inset * 2,
					angle: (Math.atan2(dy, dx) * 180) / Math.PI,
					bidirectional
				}
			];
		});
	}

	const arrows = $derived([
		...buildArrows(edgePermutation, 'edge'),
		...buildArrows(cornerPermutation, 'corner')
	]);
</script>

<div class="diagram" role="img" aria-label={label}>
	{#each cells as cell (cell.index)}
		<span
			class="sticker"
			class:top={cell.row >= 2 && cell.row <= 4 && cell.col >= 2 && cell.col <= 4}
			class:yellow={pattern[cell.index] === 'y'}
			class:green={pattern[cell.index] === 'g'}
			class:orange={pattern[cell.index] === 'o'}
			class:blue={pattern[cell.index] === 'b'}
			class:red={pattern[cell.index] === 'r'}
			style={`grid-row:${cell.row};grid-column:${cell.col}`}
		></span>
	{/each}
	{#if showArrows}
		<div class="arrows" aria-hidden="true">
			{#each arrows as arrow, index (`${arrow.kind}-${index}`)}
				<span
					class="arrow"
					class:bidirectional={arrow.bidirectional}
					style={`--x:${arrow.x}%;--y:${arrow.y}%;--length:${arrow.length}%;--angle:${arrow.angle}deg`}
				></span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.diagram {
		position: relative;
		display: grid;
		grid-template:
			0.5fr repeat(3, 1fr) 0.5fr /
			0.5fr repeat(3, 1fr) 0.5fr;
		gap: 1px;
		width: 100%;
		aspect-ratio: 1;
	}

	.sticker {
		border-radius: 1px;
		background: #333732;
	}

	.sticker.top {
		outline: 1px solid #545951;
		outline-offset: 0;
	}

	.sticker.yellow {
		background: #ffd500;
	}

	.sticker.green {
		background: #00a651;
	}

	.sticker.orange {
		background: #ff8c00;
	}

	.sticker.blue {
		background: #1557ff;
	}

	.sticker.red {
		background: #e31b23;
	}

	.arrows {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}

	.arrow {
		position: absolute;
		left: var(--x);
		top: var(--y);
		width: var(--length);
		height: 4px;
		border-radius: 999px;
		background: #11140e;
		transform: translateY(-50%) rotate(var(--angle));
		transform-origin: left center;
	}

	.arrow::after,
	.arrow.bidirectional::before {
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
		content: '';
		border-top: 6px solid transparent;
		border-bottom: 6px solid transparent;
		transform: translateY(-50%);
	}

	.arrow::after {
		right: -1px;
		border-left: 9px solid #11140e;
	}

	.arrow.bidirectional::before {
		left: -1px;
		border-right: 9px solid #11140e;
	}
</style>
