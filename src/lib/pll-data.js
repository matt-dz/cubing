// Standard algorithms, setup cases, and sticker patterns sourced from
// SpeedCubeDB's 3x3 PLL collection.
export const pllGroups = ['Adjacent swaps', 'Diagonal swaps', 'Edges only'];

export const pllCases = [
	{
		id: 'Aa',
		group: 'Adjacent swaps',
		setup: "x R2' D2' R U R' D2' R U' R x'",
		algorithm: "x (R' U R') D2 (R U' R') D2 R2 x'",
		pattern: 'yyyyyyyyyoboggbbrrrog'
	},
	{
		id: 'Ab',
		group: 'Adjacent swaps',
		setup: "x R' U R' D2' R U' R' D2' R2' x'",
		algorithm: "x R2 D2 (R U R') D2 (R U' R) x'",
		pattern: 'yyyyyyyyyrbgggoorrbob'
	},
	{
		id: 'E',
		group: 'Diagonal swaps',
		setup: "x' D R U R' D' R U' R' D R U' R' D' R U R' x y'",
		algorithm: "y x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x",
		pattern: 'yyyyyyyyyobrrgogrbbog'
	},
	{
		id: 'F',
		group: 'Adjacent swaps',
		setup: "R' U' R U' R' U R U R2' F' R U R U' R' F U R y'",
		algorithm: "y (R' U' F') (R U R' U') R' F R2 (U' R' U') (R U R' U) R",
		pattern: 'yyyyyyyyyogbgborrrbog'
	},
	{
		id: 'Ga',
		group: 'Adjacent swaps',
		setup: "R' U' R D' U R2' U R' U R U' R U' R2' D",
		algorithm: "R2 (U R' U R' U' R U') R2 D (U' R' U R) D'",
		pattern: 'yyyyyyyyyogbgoorbrbrg'
	},
	{
		id: 'Gb',
		group: 'Adjacent swaps',
		setup: "R2' U R' U R' U' R U' R2' D U' R' U R D'",
		algorithm: "(R' U' R U) D' R2 (U R' U R U' R U') R2 D",
		pattern: 'yyyyyyyyyorbgbororbgg'
	},
	{
		id: 'Gc',
		group: 'Adjacent swaps',
		setup: "D' R U R' U' D R2' U' R U' R' U R' U R2'",
		algorithm: "R2 (U' R U' R U R' U) R2 D' (U R U' R') D",
		pattern: 'yyyyyyyyyoobgborgrbrg'
	},
	{
		id: 'Gd',
		group: 'Adjacent swaps',
		setup: "R2' U' R U' R U R' U R2' D' U R U' R' D",
		algorithm: "(R U R' U') D R2 (U' R U' R' U R' U) R2 D'",
		pattern: 'yyyyyyyyyogbgrororbbg'
	},
	{
		id: 'H',
		group: 'Edges only',
		setup: "M2' U' M2' U2' M2' U' M2'",
		algorithm: "(M2 U' M2) U2 (M2 U' M2)",
		pattern: 'yyyyyyyyybgbgbgrororo'
	},
	{
		id: 'Ja',
		group: 'Adjacent swaps',
		setup: "L' R' U2' R U R' U2' L U' R y'",
		algorithm: "y (R' U L') U2 (R U' R') U2 R L",
		pattern: 'yyyyyyyyybbgrrroobggo'
	},
	{
		id: 'Jb',
		group: 'Adjacent swaps',
		setup: "R U R2' F' R U R U' R' F R U' R'",
		algorithm: "(R U R' F') (R U R' U') R' F R2 U' R'",
		pattern: 'yyyyyyyyygoorggbbborr'
	},
	{
		id: 'Na',
		group: 'Diagonal swaps',
		setup: "R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R U' R'",
		algorithm: "(R U R' U) (R U R' F') (R U R' U') R' F R2 U' R' U2 (R U' R')",
		pattern: 'yyyyyyyyygbbbggrooorr'
	},
	{
		id: 'Nb',
		group: 'Diagonal swaps',
		setup: "F r' F' r U r U' r2' D' F r U r' F' D r",
		algorithm: "(R' U R U' R') (F' U' F) (R U R') (F R' F') (R U' R)",
		pattern: 'yyyyyyyyybbgggboorrro'
	},
	{
		id: 'Ra',
		group: 'Adjacent swaps',
		setup: "R U2' R D R' U R D' R' U' R' U R U R' y'",
		algorithm: "y (R U' R' U') (R U R D) (R' U' R D') (R' U2 R')",
		pattern: 'yyyyyyyyygborrgbobogr'
	},
	{
		id: 'Rb',
		group: 'Adjacent swaps',
		setup: "R' U R U R' U' R' D' R U R' D R U2' R",
		algorithm: "(R' U2) (R U2) (R' F R) (U R' U' R') F' R2",
		pattern: 'yyyyyyyyybogrgrobbgro'
	},
	{
		id: 'T',
		group: 'Adjacent swaps',
		setup: "F R U' R' U R U R2' F' R U R U' R'",
		algorithm: "(R U R' U') (R' F R2) (U' R' U') (R U R' F')",
		pattern: 'yyyyyyyyyobbggororbrg'
	},
	{
		id: 'Ua',
		group: 'Edges only',
		setup: "M2' U' M' U2' M U' M2'",
		algorithm: "y2 (M2 U M) U2 (M' U M2)",
		pattern: 'yyyyyyyyybrbgggrorobo'
	},
	{
		id: 'Ub',
		group: 'Edges only',
		setup: "M2' U M' U2' M U M2'",
		algorithm: "y2 (M2 U' M) U2 (M' U' M2)",
		pattern: 'yyyyyyyyybobgggrbroro'
	},
	{
		id: 'V',
		group: 'Diagonal swaps',
		setup: "D2' R' U R D' R2' U' R' U R' U R' D' R U2' R'",
		algorithm: "(R' U R' U') (R D' R' D) (R' U D') (R2 U' R2) D R2",
		pattern: 'yyyyyyyyybogggborrrbo'
	},
	{
		id: 'Y',
		group: 'Diagonal swaps',
		setup: "F R' F' R U R U' R' F R U' R' U R U R' F'",
		algorithm: "F R (U' R' U') (R U R' F') (R U R' U') (R' F R F')",
		pattern: 'yyyyyyyyybrgggbobrroo'
	},
	{
		id: 'Z',
		group: 'Edges only',
		setup: "M U2' M2' U2' M U' M2' U' M2'",
		algorithm: "(M2 U) (M2 U) (M' U2) M2 (U2 M')",
		pattern: 'yyyyyyyyygogbrbogorbr'
	}
];
