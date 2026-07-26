import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cube3x3x3 } from 'cubing/puzzles';
import { experimentalSolve3x3x3IgnoringCenters, setSearchDebug } from 'cubing/search';
import { format, resolveConfig } from 'prettier';
import { ollCases } from '../src/lib/oll-data.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(root, 'src/lib/generated/oll-scrambles.json');
const seed = readArgument('seed') ?? 'oll-scrambles-v1';
const scramblesPerOrientation = Number(readArgument('count') ?? 10);
const minimumMoves = Number(readArgument('min-moves') ?? 16);
const maximumAttemptsPerOrientation = 4000;

const orientations = [
	{ id: '0', auf: '' },
	{ id: 'U', auf: 'U' },
	{ id: 'U2', auf: 'U2' },
	{ id: "U'", auf: "U'" }
];

// These are internal state generators only. Each preserves F2L and last-layer
// orientation, and uses outer face turns so the cube remains centre-oriented.
const pllGenerators = [
	"R U R' U' R' F R2 U' R' U' R U R' F'",
	"R U' R U R U R U' R' U' R2",
	"R2 U R U R' U' R' U' R' U R'",
	"F R U' R' U' R U R' F' R U R' U' R' F R F'"
];

// SpeedCubeDB's OLL 52 setup uses a `d` rotation. Replace it with an equivalent
// outer-face setup so the generated target has a genuinely solved F2L.
const setupOverrides = {
	52: "R B U B' U R' U' R U' R'"
};

if (!Number.isInteger(scramblesPerOrientation) || scramblesPerOrientation < 1) {
	throw new Error('--count must be a positive integer.');
}

if (!Number.isInteger(minimumMoves) || minimumMoves < 1) {
	throw new Error('--min-moves must be a positive integer.');
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

for (const pll of pllGenerators) {
	const pattern = solved.applyAlg(pll);
	assertF2LSolved(pattern, `PLL generator: ${pll}`);
	assertAllPiecesOriented(pattern, `PLL generator: ${pll}`);
}

const generated = {
	version: 1,
	seed,
	scramblesPerOrientation,
	orientations: orientations.map(({ id }) => id),
	cases: {}
};

for (const oll of ollCases) {
	const setup = normalizeSetup(setupOverrides[oll.id] ?? oll.setup);
	const caseScrambles = {};
	const usedScrambles = new Set();

	for (const orientation of orientations) {
		const canonical = solved.applyAlg(joinAlgs(setup, orientation.auf));
		const scrambles = [];
		let attempts = 0;
		const rejections = {
			length: 0,
			finalU: 0,
			notation: 0,
			duplicate: 0
		};

		while (scrambles.length < scramblesPerOrientation) {
			attempts += 1;
			if (attempts > maximumAttemptsPerOrientation) {
				throw new Error(
					`Could not generate enough distinct scrambles for OLL ${oll.id} (${orientation.id}). Rejections: ${JSON.stringify(rejections)}`
				);
			}

			const permutation = randomLastLayerPermutation();
			const target = solved.applyAlg(joinAlgs(permutation, setup, orientation.auf));
			assertF2LSolved(target, `OLL ${oll.id} target`);
			assertSameOrientation(target, canonical, `OLL ${oll.id} (${orientation.id}) target`);

			const solution = await experimentalSolve3x3x3IgnoringCenters(target);
			const scramble = solution
				.invert()
				.toString()
				.replace(/([RLUDFB])2'/g, '$12');
			const moves = scramble.split(/\s+/).filter(Boolean);

			if (moves.length < minimumMoves || moves.length > 25) {
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
			if (usedScrambles.has(scramble)) {
				rejections.duplicate += 1;
				continue;
			}

			const actual = solved.applyAlg(scramble);
			assertSamePiecesAndOrientations(actual, target, `OLL ${oll.id} (${orientation.id}) scramble`);
			assertF2LSolved(actual, `OLL ${oll.id} (${orientation.id}) scramble`);
			assertSameOrientation(actual, canonical, `OLL ${oll.id} (${orientation.id}) scramble`);

			scrambles.push(scramble);
			usedScrambles.add(scramble);
		}

		caseScrambles[orientation.id] = scrambles;
	}

	generated.cases[String(oll.id)] = caseScrambles;
	console.log(`OLL ${String(oll.id).padStart(2, '0')}: 40 verified scrambles`);
}

await mkdir(dirname(outputPath), { recursive: true });
const prettierConfig = (await resolveConfig(outputPath)) ?? {};
const formattedOutput = await format(JSON.stringify(generated), {
	...prettierConfig,
	parser: 'json'
});
await writeFile(outputPath, formattedOutput);

console.log(
	`\nGenerated ${ollCases.length * orientations.length * scramblesPerOrientation} scrambles at ${outputPath}`
);

function readArgument(name) {
	const prefix = `--${name}=`;
	return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length);
}

function normalizeSetup(setup) {
	const normalized = setup.replace(/\s+y(?:2'?|')?\s*$/, '').trim();
	if (/(?:^|\s)[xyz](?:2'?|')?(?:\s|$)/.test(normalized)) {
		throw new Error(`Unsupported cube rotation in setup: ${setup}`);
	}
	return normalized;
}

function randomLastLayerPermutation() {
	const parts = [];
	const generatorCount = 1 + Math.floor(random() * 4);

	for (let index = 0; index < generatorCount; index += 1) {
		const auf = orientations[Math.floor(random() * orientations.length)].auf;
		if (auf) parts.push(auf);
		parts.push(pllGenerators[Math.floor(random() * pllGenerators.length)]);
	}

	const finalAuf = orientations[Math.floor(random() * orientations.length)].auf;
	if (finalAuf) parts.push(finalAuf);
	return parts.join(' ');
}

function joinAlgs(...algs) {
	return algs.filter(Boolean).join(' ');
}

function isOuterFaceMove(move) {
	return /^[RLUDFB](?:2|')?$/.test(move);
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

function assertSameOrientation(actual, expected, context) {
	for (const orbit of ['EDGES', 'CORNERS']) {
		const actualOrientation = actual.patternData[orbit].orientation;
		const expectedOrientation = expected.patternData[orbit].orientation;
		if (!arraysEqual(actualOrientation, expectedOrientation)) {
			throw new Error(`${context} has the wrong ${orbit.toLowerCase()} orientation.`);
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
