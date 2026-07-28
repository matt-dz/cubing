// Standard algorithms, setup cases, and sticker patterns sourced from
// SpeedCubeDB's 3x3 PLL collection.
export const pllGroups = ['Adjacent swaps', 'Diagonal swaps', 'Edges only'];

export const pllCases = [
	{
		id: 'Aa',
		group: 'Adjacent swaps',
		setup: "x R2' D2' R U R' D2' R U' R x'",
		algorithm: "x (R' U R') D2 (R U' R') D2 R2 x'",
		pattern: 'yyyyyyyyyoboggbbrrrog',
		edgePermutation: [0, 1, 2, 3],
		cornerPermutation: [2, 0, 1, 3]
	},
	{
		id: 'Ab',
		group: 'Adjacent swaps',
		setup: "x R' U R' D2' R U' R' D2' R2' x'",
		algorithm: "x R2 D2 (R U R') D2 (R U' R) x'",
		pattern: 'yyyyyyyyyrbgggoorrbob',
		edgePermutation: [0, 1, 2, 3],
		cornerPermutation: [1, 2, 0, 3]
	},
	{
		id: 'E',
		group: 'Diagonal swaps',
		setup: "x' D R U R' D' R U' R' D R U' R' D' R U R' x y'",
		algorithm: "y x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x",
		pattern: 'yyyyyyyyyobrrgogrbbog',
		edgePermutation: [0, 1, 2, 3],
		cornerPermutation: [1, 0, 3, 2]
	},
	{
		id: 'F',
		group: 'Adjacent swaps',
		setup: "R' U' R U' R' U R U R2' F' R U R U' R' F U R y'",
		algorithm: "y (R' U' F') (R U R' U') R' F R2 (U' R' U') (R U R' U) R",
		pattern: 'yyyyyyyyyogbgborrrbog',
		edgePermutation: [2, 1, 0, 3],
		cornerPermutation: [1, 0, 2, 3]
	},
	{
		id: 'Ga',
		group: 'Adjacent swaps',
		setup: "R' U' R D' U R2' U R' U R U' R U' R2' D",
		algorithm: "R2 (U R' U R' U' R U') R2 D (U' R' U R) D'",
		pattern: 'yyyyyyyyyogbgoorbrbrg',
		edgePermutation: [1, 3, 0, 2],
		cornerPermutation: [1, 0, 2, 3]
	},
	{
		id: 'Gb',
		group: 'Adjacent swaps',
		setup: "R2' U R' U R' U' R U' R2' D U' R' U R D'",
		algorithm: "(R' U' R U) D' R2 (U R' U R U' R U') R2 D",
		pattern: 'yyyyyyyyyorbgbororbgg',
		edgePermutation: [2, 0, 3, 1],
		cornerPermutation: [1, 0, 2, 3]
	},
	{
		id: 'Gc',
		group: 'Adjacent swaps',
		setup: "D' R U R' U' D R2' U' R U' R' U R' U R2'",
		algorithm: "R2 (U' R U' R U R' U) R2 D' (U R U' R') D",
		pattern: 'yyyyyyyyyoobgborgrbrg',
		edgePermutation: [2, 3, 1, 0],
		cornerPermutation: [1, 0, 2, 3]
	},
	{
		id: 'Gd',
		group: 'Adjacent swaps',
		setup: "R2' U' R U' R U R' U R2' D' U R U' R' D",
		algorithm: "(R U R' U') D R2 (U' R U' R' U R' U) R2 D'",
		pattern: 'yyyyyyyyyogbgrororbbg',
		edgePermutation: [3, 2, 0, 1],
		cornerPermutation: [1, 0, 2, 3]
	},
	{
		id: 'H',
		group: 'Edges only',
		setup: "M2' U' M2' U2' M2' U' M2'",
		algorithm: "(M2 U' M2) U2 (M2 U' M2)",
		pattern: 'yyyyyyyyybgbgbgrororo',
		edgePermutation: [2, 3, 0, 1],
		cornerPermutation: [0, 1, 2, 3]
	},
	{
		id: 'Ja',
		group: 'Adjacent swaps',
		setup: "L' R' U2' R U R' U2' L U' R y'",
		algorithm: "y (R' U L') U2 (R U' R') U2 R L",
		pattern: 'yyyyyyyyybbgrrroobggo',
		edgePermutation: [0, 1, 3, 2],
		cornerPermutation: [0, 2, 1, 3]
	},
	{
		id: 'Jb',
		group: 'Adjacent swaps',
		setup: "R U R2' F' R U R U' R' F R U' R'",
		algorithm: "(R U R' F') (R U R' U') R' F R2 U' R'",
		pattern: 'yyyyyyyyygoorggbbborr',
		edgePermutation: [1, 0, 2, 3],
		cornerPermutation: [1, 0, 2, 3]
	},
	{
		id: 'Na',
		group: 'Diagonal swaps',
		setup: "R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R U' R'",
		algorithm: "(R U R' U) (R U R' F') (R U R' U') R' F R2 U' R' U2 (R U' R')",
		pattern: 'yyyyyyyyygbbbggrooorr',
		edgePermutation: [0, 3, 2, 1],
		cornerPermutation: [0, 3, 2, 1]
	},
	{
		id: 'Nb',
		group: 'Diagonal swaps',
		setup: "F r' F' r U r U' r2' D' F r U r' F' D r",
		algorithm: "(R' U R U' R') (F' U' F) (R U R') (F R' F') (R U' R)",
		pattern: 'yyyyyyyyybbgggboorrro',
		edgePermutation: [0, 3, 2, 1],
		cornerPermutation: [2, 1, 0, 3]
	},
	{
		id: 'Ra',
		group: 'Adjacent swaps',
		setup: "R U2' R D R' U R D' R' U' R' U R U R' y'",
		algorithm: "y (R U' R' U') (R U R D) (R' U' R D') (R' U2 R')",
		pattern: 'yyyyyyyyygborrgbobogr',
		edgePermutation: [0, 1, 3, 2],
		cornerPermutation: [1, 0, 2, 3]
	},
	{
		id: 'Rb',
		group: 'Adjacent swaps',
		setup: "R' U R U R' U' R' D' R U R' D R U2' R",
		algorithm: "(R' U2) (R U2) (R' F R) (U R' U' R') F' R2",
		pattern: 'yyyyyyyyybogrgrobbgro',
		edgePermutation: [1, 0, 2, 3],
		cornerPermutation: [0, 2, 1, 3]
	},
	{
		id: 'T',
		group: 'Adjacent swaps',
		setup: "F R U' R' U R U R2' F' R U R U' R'",
		algorithm: "(R U R' U') (R' F R2) (U' R' U') (R U R' F')",
		pattern: 'yyyyyyyyyobbggororbrg',
		edgePermutation: [0, 3, 2, 1],
		cornerPermutation: [1, 0, 2, 3]
	},
	{
		id: 'Ua',
		group: 'Edges only',
		setup: "M2' U' M' U2' M U' M2'",
		algorithm: "y2 (M2 U M) U2 (M' U M2)",
		pattern: 'yyyyyyyyybrbgggrorobo',
		edgePermutation: [0, 2, 3, 1],
		cornerPermutation: [0, 1, 2, 3]
	},
	{
		id: 'Ub',
		group: 'Edges only',
		setup: "M2' U M' U2' M U M2'",
		algorithm: "y2 (M2 U' M) U2 (M' U' M2)",
		pattern: 'yyyyyyyyybobgggrbroro',
		edgePermutation: [0, 3, 1, 2],
		cornerPermutation: [0, 1, 2, 3]
	},
	{
		id: 'V',
		group: 'Diagonal swaps',
		setup: "D2' R' U R D' R2' U' R' U R' U R' D' R U2' R'",
		algorithm: "(R' U R' U') (R D' R' D) (R' U D') (R2 U' R2) D R2",
		pattern: 'yyyyyyyyybogggborrrbo',
		edgePermutation: [0, 2, 1, 3],
		cornerPermutation: [2, 1, 0, 3]
	},
	{
		id: 'Y',
		group: 'Diagonal swaps',
		setup: "F R' F' R U R U' R' F R U' R' U R U R' F'",
		algorithm: "F R (U' R' U') (R U R' F') (R U R' U') (R' F R F')",
		pattern: 'yyyyyyyyybrgggbobrroo',
		edgePermutation: [0, 1, 3, 2],
		cornerPermutation: [2, 1, 0, 3]
	},
	{
		id: 'Z',
		group: 'Edges only',
		setup: "M U2' M2' U2' M U' M2' U' M2'",
		algorithm: "(M2 U) (M2 U) (M' U2) M2 (U2 M')",
		pattern: 'yyyyyyyyygogbrbogorbr',
		edgePermutation: [1, 0, 3, 2],
		cornerPermutation: [0, 1, 2, 3]
	}
];
