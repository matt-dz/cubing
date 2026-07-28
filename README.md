# Cubing

A minimal, personal speedcubing practice site built with SvelteKit. It currently includes
3×3 trainers for all 57 one-look OLL cases and all 21 PLL cases.

## Trainers

The OLL and PLL trainers are available at `/oll-trainer` and `/pll-trainer`. Both include:

- All cases selected by default
- Case, group, select-all, and clear-all controls
- Browser-local selection and starred-case persistence
- Balanced case rotation: every selected case appears once before reshuffling
- Balanced exposure across four hidden case orientations
- 40 verified scrambles per case, with ten for each orientation
- Algorithms hidden behind an optional reveal control
- Starred review that repeats until every starred case is removed
- Exact previous/next scramble history
- Keyboard controls: `S` to star, Left Arrow for previous, and Space or Right Arrow for next

OLL cases are organised by shape. PLL cases are organised by permutation type.

Algorithms are based on SpeedCubeDB's
[3×3 OLL](https://speedcubedb.com/a/3x3/OLL) and
[3×3 PLL](https://speedcubedb.com/a/3x3/PLL) collections.

## Scramble generation

Scrambles are generated offline and stored in:

- `src/lib/generated/oll-scrambles.json`
- `src/lib/generated/pll-scrambles.json`

The browser never runs a solver. Both generators require every scramble to:

- Preserve solved F2L
- Use only outer face turns
- Contain no cube rotations, slice moves, or wide moves
- Avoid a final U-layer move that reveals the hidden orientation

The OLL generator verifies the intended last-layer orientation while allowing a random
last-layer permutation. The PLL generator preserves solved OLL and verifies the exact
intended last-layer permutation.

Generate either deterministic scramble pool with:

```sh
npm run generate:oll-scrambles
npm run generate:pll-scrambles
```

Optional arguments can be passed after `--`:

```sh
npm run generate:pll-scrambles -- \
  --seed=pll-scrambles-v2 \
  --count=10 \
  --min-moves=14 \
  --max-moves=25
```

`--count` controls the number of scrambles per case orientation. The default of ten
produces 2,280 OLL scrambles and 840 PLL scrambles.

## Local development

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Useful commands:

```sh
npm run lint
npm run check
npm run build
npm run preview
```
