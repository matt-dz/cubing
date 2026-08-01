import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cube3x3x3 } from 'cubing/puzzles';
import { experimentalSolve3x3x3IgnoringCenters, setSearchDebug } from 'cubing/search';
import { format, resolveConfig } from 'prettier';
import { pllCases } from '../src/lib/pll-data.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(root, 'src/lib/generated/pll-scrambles.json');
const seed = readArgument('seed') ?? 'pll-scrambles-v2';
const scramblesPerOrientation = Number(readArgument('count') ?? 10);
const minimumMoves = Number(readArgument('min-moves') ?? 14);
const maximumMoves = Number(readArgument('max-moves') ?? 25);
const maximumAttemptsPerOrientation = 5000;

const orientations = [
	{ id: '0', auf: '' },
	{ id: 'U', auf: 'U' },
	{ id: 'U2', auf: 'U2' },
	{ id: "U'", auf: "U'" }
];

if (!Number.isInteger(scramblesPerOrientation) || scramblesPerOrientation < 1) {
	throw new Error('--count must be a positive integer.');
}

if (!Number.isInteger(minimumMoves) || minimumMoves < 1) {
	throw new Error('--min-moves must be a positive integer.');
}

if (!Number.isInteger(maximumMoves) || maximumMoves < minimumMoves) {
	throw new Error('--max-moves must be an integer greater than or equal to --min-moves.');
}

const random = mulberry32(hashSeed(seed));
const kpuzzle = await cube3x3x3.kpuzzle();
const solved = kpuzzle.defaultPattern();
const uTurn = solved.applyAlg('U');
const f2lIndices = {
	EDGES: unchangedIndices(solved, uTurn, 'EDGES'),
	CORNERS: unchangedIndices(solved, uTurn, 'CORNERS')
};

setSearchDebug({ logPerf: false, scramblePrefetchLevel: 'none' });

const generated = {
	version: 2,
	seed,
	scramblesPerOrientation,
	orientations: orientations.map(({ id }) => id),
	cases: {}
};

for (const pll of pllCases) {
	const setup = normalizeSetup(pll.setup);
	const canonical = solved.applyAlg(setup);
	const caseScrambles = {};
	const usedScrambles = new Set();

	assertF2LSolved(canonical, `PLL ${pll.id} canonical state`);
	assertAllPiecesOriented(canonical, `PLL ${pll.id} canonical state`);

	for (const orientation of orientations) {
		const target = canonical.applyAlg(orientation.auf);
		const targetTransformation = target.experimentalToTransformation();
		const scrambles = [];
		let attempts = 0;
		const rejections = {
			length: 0,
			finalU: 0,
			notation: 0,
			duplicate: 0
		};

		if (!targetTransformation) {
			throw new Error(`Could not convert PLL ${pll.id} (${orientation.id}) to a transformation.`);
		}

		while (scrambles.length < scramblesPerOrientation) {
			attempts += 1;
			if (attempts > maximumAttemptsPerOrientation) {
				throw new Error(
					`Could not generate enough distinct scrambles for PLL ${pll.id} (${orientation.id}). Rejections: ${JSON.stringify(rejections)}`
				);
			}

			const prefix = randomOuterMoves();
			const prefixTransformation = kpuzzle.algToTransformation(prefix);
			const correctionTransformation = prefixTransformation
				.invert()
				.applyTransformation(targetTransformation);
			const correctionPattern = correctionTransformation.toKPattern();
			const solution = await experimentalSolve3x3x3IgnoringCenters(correctionPattern);
			const correction = normalizeMoves(solution.invert().toString());
			const rawMoves = joinAlgs(prefix, correction).split(/\s+/).filter(Boolean);
			const moves = simplifyCommutingMoves(rawMoves);
			const scramble = moves.join(' ');

			if (moves.length < minimumMoves || moves.length > maximumMoves) {
				rejections.length += 1;
				continue;
			}
			if (moves.at(-1)?.startsWith('U')) {
				rejections.finalU += 1;
				continue;
			}
			if (!moves.every(isOuterFaceMove)) {
				rejections.notation += 1;
				continue;
			}
			if (hasRepeatedFaceWithinAxisRun(moves)) {
				throw new Error(`PLL ${pll.id} (${orientation.id}) produced a reducible scramble.`);
			}
			if (usedScrambles.has(scramble)) {
				rejections.duplicate += 1;
				continue;
			}

			const actual = solved.applyAlg(scramble);
			assertSamePiecesAndOrientations(actual, target, `PLL ${pll.id} (${orientation.id}) scramble`);
			assertF2LSolved(actual, `PLL ${pll.id} (${orientation.id}) scramble`);
			assertAllPiecesOriented(actual, `PLL ${pll.id} (${orientation.id}) scramble`);

			scrambles.push(scramble);
			usedScrambles.add(scramble);
		}

		caseScrambles[orientation.id] = scrambles;
	}

	generated.cases[pll.id] = caseScrambles;
	console.log(
		`PLL ${pll.id.padEnd(2)}: ${orientations.length * scramblesPerOrientation} verified scrambles`
	);
}

await mkdir(dirname(outputPath), { recursive: true });
const prettierConfig = (await resolveConfig(outputPath)) ?? {};
const formattedOutput = await format(JSON.stringify(generated), {
	...prettierConfig,
	parser: 'json'
});
await writeFile(outputPath, formattedOutput);

console.log(
	`\nGenerated ${pllCases.length * orientations.length * scramblesPerOrientation} scrambles at ${outputPath}`
);

function readArgument(name) {
	const prefix = `--${name}=`;
	return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length);
}

function normalizeSetup(setup) {
	return setup.replace(/\s+y(?:2'?|')?\s*$/, '').trim();
}

function normalizeMoves(alg) {
	return alg.replace(/([RLUDFB])2'/g, '$12');
}

function randomOuterMoves() {
	const faces = ['R', 'L', 'U', 'D', 'F', 'B'];
	const suffixes = ['', "'", '2'];
	const moveCount = 2 + Math.floor(random() * 5);
	const moves = [];
	let previousFace = '';

	for (let index = 0; index < moveCount; index += 1) {
		const availableFaces = faces.filter((face) => face !== previousFace);
		const face = availableFaces[Math.floor(random() * availableFaces.length)];
		const suffix = suffixes[Math.floor(random() * suffixes.length)];
		moves.push(`${face}${suffix}`);
		previousFace = face;
	}

	return moves.join(' ');
}

function joinAlgs(...algs) {
	return algs.filter(Boolean).join(' ');
}

function isOuterFaceMove(move) {
	return /^[RLUDFB](?:2|')?$/.test(move);
}

function simplifyCommutingMoves(moves) {
	const simplified = [];

	for (const move of moves) {
		const axis = faceAxis(move[0]);
		let groupStart = simplified.length;

		while (groupStart > 0 && faceAxis(simplified[groupStart - 1][0]) === axis) {
			groupStart -= 1;
		}

		const group = [...simplified.splice(groupStart), move];
		const faceOrder = [];
		const turnsByFace = new Map();

		for (const groupMove of group) {
			const face = groupMove[0];
			if (!turnsByFace.has(face)) faceOrder.push(face);
			turnsByFace.set(face, ((turnsByFace.get(face) ?? 0) + quarterTurns(groupMove)) % 4);
		}

		for (const face of faceOrder) {
			const turns = turnsByFace.get(face);
			if (turns) simplified.push(formatMove(face, turns));
		}
	}

	return simplified;
}

function hasRepeatedFaceWithinAxisRun(moves) {
	for (let index = 0; index < moves.length;) {
		const axis = faceAxis(moves[index][0]);
		const faces = new Set();

		while (index < moves.length && faceAxis(moves[index][0]) === axis) {
			const face = moves[index][0];
			if (faces.has(face)) return true;
			faces.add(face);
			index += 1;
		}
	}

	return false;
}

function faceAxis(face) {
	if (face === 'R' || face === 'L') return 'x';
	if (face === 'U' || face === 'D') return 'y';
	return 'z';
}

function quarterTurns(move) {
	if (move.endsWith('2')) return 2;
	if (move.endsWith("'")) return 3;
	return 1;
}

function formatMove(face, turns) {
	if (turns === 1) return face;
	if (turns === 2) return `${face}2`;
	return `${face}'`;
}

function unchangedIndices(a, b, orbit) {
	const aData = a.patternData[orbit];
	const bData = b.patternData[orbit];
	return aData.pieces
		.map((piece, index) =>
			piece === bData.pieces[index] && aData.orientation[index] === bData.orientation[index]
				? index
				: -1
		)
		.filter((index) => index >= 0);
}

function assertF2LSolved(pattern, context) {
	for (const orbit of ['EDGES', 'CORNERS']) {
		const data = pattern.patternData[orbit];
		const solvedData = solved.patternData[orbit];
		for (const index of f2lIndices[orbit]) {
			if (
				data.pieces[index] !== solvedData.pieces[index] ||
				data.orientation[index] !== solvedData.orientation[index]
			) {
				throw new Error(`${context} does not preserve solved F2L (${orbit} ${index}).`);
			}
		}
	}
}

function assertAllPiecesOriented(pattern, context) {
	for (const orbit of ['EDGES', 'CORNERS']) {
		if (pattern.patternData[orbit].orientation.some((value) => value !== 0)) {
			throw new Error(`${context} changes piece orientation.`);
		}
	}
}

function assertSamePiecesAndOrientations(actual, expected, context) {
	for (const orbit of ['EDGES', 'CORNERS']) {
		const actualData = actual.patternData[orbit];
		const expectedData = expected.patternData[orbit];
		if (
			!arraysEqual(actualData.pieces, expectedData.pieces) ||
			!arraysEqual(actualData.orientation, expectedData.orientation)
		) {
			throw new Error(`${context} does not reproduce its target state.`);
		}
	}
}

function arraysEqual(a, b) {
	return a.length === b.length && a.every((value, index) => value === b[index]);
}

function hashSeed(value) {
	let hash = 2166136261;
	for (let index = 0; index < value.length; index += 1) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

function mulberry32(initialSeed) {
	let state = initialSeed;
	return () => {
		state += 0x6d2b79f5;
		let value = state;
		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}
