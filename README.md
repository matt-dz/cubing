# Cubing

A minimal, personal speedcubing practice site built with SvelteKit. The current tool is a
3×3 OLL trainer covering all 57 one-look OLL cases.

## OLL trainer

The trainer is available at `/oll-trainer` and includes:

- All 57 OLL cases, organised by shape
- Case, group, select-all, and clear-all controls
- Browser-local selection persistence
- All cases selected by default for new users
- Balanced case rotation: every selected case appears once before reshuffling
- Balanced AUF exposure across four hidden case orientations
- 40 verified scrambles per case, with ten for each orientation
- Algorithms hidden behind an optional reveal control
- Space-bar navigation to the next case

Algorithms are based on the
[SpeedCubeDB 3×3 OLL collection](https://speedcubedb.com/a/3x3/OLL).

## Scramble generation

Scrambles are generated offline and stored in
`src/lib/generated/oll-scrambles.json`. The browser does not run a solver.

The generator verifies that every scramble:

- Preserves solved F2L
- Produces the intended OLL orientation
- Uses only outer face turns
- Contains no cube rotations, slice moves, or wide moves
- Does not end with a U-layer move that reveals the hidden orientation

Generate a fresh pool with the default deterministic seed:

```sh
npm run generate:oll-scrambles
```

Optional generator arguments can be passed after `--`:

```sh
npm run generate:oll-scrambles -- \
  --seed=oll-scrambles-v2 \
  --count=10 \
  --min-moves=16
```

`--count` controls the number of scrambles per case orientation. The default of ten
produces 40 scrambles for each OLL and 2,280 scrambles in total.

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
