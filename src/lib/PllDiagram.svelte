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
		label = ''
	}: {
		pattern: string;
		edgePermutation: Permutation;
		cornerPermutation: Permutation;
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
			{ x: 50, y: 68 },
			{ x: 68, y: 50 },
			{ x: 50, y: 32 },
			{ x: 32, y: 50 }
		],
		corner: [
			{ x: 65, y: 65 },
			{ x: 65, y: 35 },
			{ x: 35, y: 35 },
			{ x: 35, y: 65 }
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
			const inset = kind === 'edge' ? 4.5 : 4;

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
	<div class="arrows" aria-hidden="true">
		{#each arrows as arrow, index (`${arrow.kind}-${index}`)}
			<span
				class="arrow"
				class:edge={arrow.kind === 'edge'}
				class:corner={arrow.kind === 'corner'}
				class:bidirectional={arrow.bidirectional}
				style={`--x:${arrow.x}%;--y:${arrow.y}%;--length:${arrow.length}%;--angle:${arrow.angle}deg`}
			></span>
		{/each}
	</div>
</div>

<style>
	.diagram {
		position: relative;
		display: grid;
		grid-template:
			0.5fr repeat(3, 1fr) 0.5fr /
			0.5fr repeat(3, 1fr) 0.5fr;
		gap: 2px;
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
		background: #d8fa65;
	}

	.sticker.green {
		background: #63b985;
	}

	.sticker.orange {
		background: #e89b5b;
	}

	.sticker.blue {
		background: #6f9fe7;
	}

	.sticker.red {
		background: #dd6f6f;
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
		height: 2px;
		border-radius: 999px;
		transform: translateY(-50%) rotate(var(--angle));
		transform-origin: left center;
		filter: drop-shadow(0 0 1px #1a1d1a);
	}

	.arrow.edge {
		background: #dd6f6f;
	}

	.arrow.corner {
		background: #4d7fc8;
	}

	.arrow::after,
	.arrow.bidirectional::before {
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
		content: '';
		border-top: 4px solid transparent;
		border-bottom: 4px solid transparent;
		transform: translateY(-50%);
	}

	.arrow::after {
		right: -1px;
		border-left: 6px solid #dd6f6f;
	}

	.arrow.corner::after {
		border-left-color: #4d7fc8;
	}

	.arrow.bidirectional::before {
		left: -1px;
		border-right: 6px solid #dd6f6f;
	}

	.arrow.corner.bidirectional::before {
		border-right-color: #4d7fc8;
	}
</style>
