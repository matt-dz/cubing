// Standard algorithms and setup cases sourced from SpeedCubeDB's 3x3 OLL collection.
export const ollCases = [
	{
		id: 1,
		group: 'Dot Case',
		setup: "F R' F' R U2' F R' F' R2' U2' R'",
		algorithm: "(R U2 R') (R' F R F') U2 (R' F R F')",
		pattern: 'llllylllllyllylyyyyyy'
	},
	{
		id: 2,
		group: 'Dot Case',
		setup: "f U R U' R' f' F U R U' R' F'",
		algorithm: "F (R U R' U') F' f (R U R' U') f'",
		pattern: 'llllyllllyyllyyyyylyl'
	},
	{
		id: 3,
		group: 'Dot Case',
		setup: "F U R U' R' F' U f U R U' R' f' y",
		algorithm: "y' f (R U R' U') f' (U') F (R U R' U') F'",
		pattern: 'llllylylllyylyylyllyy'
	},
	{
		id: 4,
		group: 'Dot Case',
		setup: "F U R U' R' F' U' f U R U' R' f' y",
		algorithm: "y' f (R U R' U') f' (U) F (R U R' U') F'",
		pattern: 'llllylllyyylyylyyllyl'
	},
	{
		id: 5,
		group: 'Square Shapes',
		setup: "r' U' R U' R' U2' r",
		algorithm: "r' U2 (R U R' U) r",
		pattern: 'llllyylyylyyllllyylly'
	},
	{
		id: 6,
		group: 'Square Shapes',
		setup: "r U R' U R U2' r'",
		algorithm: "r U2 (R' U' R U') r'",
		pattern: 'lyylyyllllllyylyylyll'
	},
	{
		id: 7,
		group: 'Lightning Shapes',
		setup: "r U2' R' U' R U' r'",
		algorithm: "r (U R' U R) U2 r'",
		pattern: 'lylyylyllllylyyllllyy'
	},
	{
		id: 8,
		group: 'Lightning Shapes',
		setup: "r' U2' R U R' U r y2'",
		algorithm: "y2 r' (U' R U' R') U2 r",
		pattern: 'lyllyyllyyllyylyyllll'
	},
	{
		id: 9,
		group: 'Fish Shapes',
		setup: "F U R U' R2' F' R U R U' R' y'",
		algorithm: "y (R U R' U') (R' F R) (R U R' U') F'",
		pattern: 'llyyyllyllylyllyllyyl'
	},
	{
		id: 10,
		group: 'Fish Shapes',
		setup: "R U2' R' F R' F' R U' R U' R'",
		algorithm: "(R U R' U) (R' F R F') (R U2 R')",
		pattern: 'llyyyllyllyyllyllylyl'
	},
	{
		id: 11,
		group: 'Lightning Shapes',
		setup: "M U' R U2' R' U' R U' R2' r",
		algorithm: "M (R U R' U R U2 R') U M'",
		pattern: 'llllyyyyllyyllylyllly'
	},
	{
		id: 12,
		group: 'Lightning Shapes',
		setup: "F U R U' R' F' U' F U R U' R' F'",
		algorithm: "y' M' (R' U' R U' R' U2 R) U' M",
		pattern: 'llylyylyllylyllyylyll'
	},
	{
		id: 13,
		group: 'Knight Move Shapes',
		setup: "F' U' F r U' r' U r U r'",
		algorithm: "(r U' r') U' (r U r') (F' U F)",
		pattern: 'lllyyyylllyylyyllllly'
	},
	{
		id: 14,
		group: 'Knight Move Shapes',
		setup: "F U F' R' F R U' R' F' R",
		algorithm: "R' F (R U R') F' R (F U' F')",
		pattern: 'lllyyyllyyylyylylllll'
	},
	{
		id: 15,
		group: 'Knight Move Shapes',
		setup: "r' U' r U' R' U R r' U r",
		algorithm: "(r' U' r) (R' U' R U) (r' U r)",
		pattern: 'lllyyyllylyylylllylly'
	},
	{
		id: 16,
		group: 'Knight Move Shapes',
		setup: "r U r' U R U' R' r U' r'",
		algorithm: "(r U r') (R U R' U') (r U' r')",
		pattern: 'llyyyyllllylyylyllyll'
	},
	{
		id: 17,
		group: 'Dot Case',
		setup: "F R' F' R U2' F R' F' R U' R U' R'",
		algorithm: "(R U R' U) (R' F R F') U2 (R' F R F')",
		pattern: 'ylllylllyyyllyllyylyl'
	},
	{
		id: 18,
		group: 'Dot Case',
		setup: "r' U2' R U R' U r2' U2' R' U' R U' r'",
		algorithm: "y (R U2 R') (R' F R F') U2 M' (U R U' r')",
		pattern: 'ylylylllllylyyylyllyl'
	},
	{
		id: 19,
		group: 'Dot Case',
		setup: "F R' F' R M U R U' R' U' M'",
		algorithm: "M U (R U R' U') M' (R' F R F')",
		pattern: 'ylylylllllyllyllyyyyl'
	},
	{
		id: 20,
		group: 'Dot Case',
		setup: "r U R' U' M2' U R U' R' U' M'",
		algorithm: "(r U R' U') M2 (U R U' R') U' M'",
		pattern: 'ylylylylylyllyllyllyl'
	},
	{
		id: 21,
		group: 'OCLL',
		setup: "R U R' U R U' R' U R U2' R' y'",
		algorithm: "(R U R' U) (R U' R' U) (R U2 R')",
		pattern: 'lylyyylylllllllylyyly'
	},
	{
		id: 22,
		group: 'OCLL',
		setup: "R' U2' R2' U R2' U R2' U2' R'",
		algorithm: "R U2 (R2' U') (R2 U') (R2' U') U' R",
		pattern: 'lylyyylylyllllyylylll'
	},
	{
		id: 23,
		group: 'OCLL',
		setup: "R U2' R D R' U2' R D' R2'",
		algorithm: "R2 D (R' U2 R) D' (R' U2 R')",
		pattern: 'yyyyyylyllllylyllllll'
	},
	{
		id: 24,
		group: 'OCLL',
		setup: "F R' F' r U R U' r'",
		algorithm: "(r U R' U') (r' F R F')",
		pattern: 'lyyyyylyyllyyllllllll'
	},
	{
		id: 25,
		group: 'OCLL',
		setup: "R' F' r U R U' r' F y'",
		algorithm: "y (F' r U R') (U' r' F R)",
		pattern: 'yylyyylyylllyllllllly'
	},
	{
		id: 26,
		group: 'OCLL',
		setup: "R U R' U R U2' R' y'",
		algorithm: "y R U2 (R' U' R U') R'",
		pattern: 'yylyyylylyllylllllyll'
	},
	{
		id: 27,
		group: 'OCLL',
		setup: "R U2' R' U' R U' R'",
		algorithm: "(R U R' U) (R U2 R')",
		pattern: 'lylyyyyylllyllyllllly'
	},
	{
		id: 28,
		group: 'All Corners Oriented',
		setup: "R U R' U' M' U R U' r'",
		algorithm: "(r U R' U') M (U R U' R')",
		pattern: 'yyyyylylyllllylllllyl'
	},
	{
		id: 29,
		group: 'Awkward Shapes',
		setup: "M F R' F' R U R U' R' U' M'",
		algorithm: "y (R U R') U' (R U' R') (F' U' F) (R U R')",
		pattern: 'ylyyyllyllyllllllyyyl'
	},
	{
		id: 30,
		group: 'Awkward Shapes',
		setup: "F U R U2' R' U R U2' R' U' F' y2'",
		algorithm: "y2 F U (R U2 R') U' (R U2 R') U' F'",
		pattern: 'ylylyylyllylllllyyyll'
	},
	{
		id: 31,
		group: 'P Shapes',
		setup: "R' F R U R' U' F' U R",
		algorithm: "(R' U' F) (U R U' R') F' R",
		pattern: 'lyylyyllyllyyyllyllll'
	},
	{
		id: 32,
		group: 'P Shapes',
		setup: "f R' F' R U R U' R' S'",
		algorithm: "S (R U R' U') (R' F R f')",
		pattern: 'llylyylyylyyylllyllll'
	},
	{
		id: 33,
		group: 'T Shapes',
		setup: "F R' F' R U R U' R'",
		algorithm: "(R U R' U') (R' F R F')",
		pattern: 'llyyyyllylyyyylllllll'
	},
	{
		id: 34,
		group: 'C Shapes',
		setup: "F U R' U' R' F' R U R2' U' R' y2'",
		algorithm: "y2 R U R2 U' R' F (R U R U') F'",
		pattern: 'ylyyyyllllyllylllyyll'
	},
	{
		id: 35,
		group: 'Fish Shapes',
		setup: "R U2' R' F R' F' R2' U2' R'",
		algorithm: "(R U2 R') (R' F R F') (R U2 R')",
		pattern: 'ylllyylyylylylllyllly'
	},
	{
		id: 36,
		group: 'W Shapes',
		setup: "F' L F L' U' L' U' L U L' U L y2'",
		algorithm: "y2 (L' U' L U') (L' U L U) (L F' L' F)",
		pattern: 'yllyyllyylylyllllllyy'
	},
	{
		id: 37,
		group: 'Fish Shapes',
		setup: "F R U' R' U R U R' F'",
		algorithm: "F R (U' R' U') (R U R') F'",
		pattern: 'yylyylllylllyylllllyy'
	},
	{
		id: 38,
		group: 'W Shapes',
		setup: "F R' F' R U R U R' U' R U' R'",
		algorithm: "(R U R' U) (R U' R' U') (R' F R F')",
		pattern: 'lyyyylyllllylyllllyyl'
	},
	{
		id: 39,
		group: 'Lightning Shapes',
		setup: "L U F' U' L' U L F L' y'",
		algorithm: "y L F' (L' U' L U) F U' L'",
		pattern: 'yyllyllyyyllllllyylyl'
	},
	{
		id: 40,
		group: 'Lightning Shapes',
		setup: "R' U' F U R U' R' F' R y'",
		algorithm: "y R' F (R U R' U') F' U R",
		pattern: 'lyylylyyllllllyyyllyl'
	},
	{
		id: 41,
		group: 'Awkward Shapes',
		setup: "F U R U' R' F' R U2' R' U' R U' R' y2'",
		algorithm: "y2 (R U R' U) (R U2 R') F (R U R' U') F'",
		pattern: 'ylylyylyllylylylyllll'
	},
	{
		id: 42,
		group: 'Awkward Shapes',
		setup: "F U R U' R' F' R' U2' R U R' U R",
		algorithm: "(R' U' R U') (R' U2 R) F (R U R' U') F'",
		pattern: 'ylyyyllyllylylyllllyl'
	},
	{
		id: 43,
		group: 'P Shapes',
		setup: "f' U' L' U L f",
		algorithm: "y R' U' (F' U F) R",
		pattern: 'yllyylyyllylllllllyyy'
	},
	{
		id: 44,
		group: 'P Shapes',
		setup: "f U R U' R' f'",
		algorithm: "f (R U R' U') f'",
		pattern: 'llylyylyylyllllyyylll'
	},
	{
		id: 45,
		group: 'T Shapes',
		setup: "F U R U' R' F'",
		algorithm: "F (R U R' U') F'",
		pattern: 'llyyyyllylyllylylylll'
	},
	{
		id: 46,
		group: 'C Shapes',
		setup: "R' U' F R' F' R U R",
		algorithm: "R' U' (R' F R F') U R",
		pattern: 'yyllylyyllllllllylyyy'
	},
	{
		id: 47,
		group: 'L Shapes',
		setup: "F' U' L' U L U' L' U L F",
		algorithm: "F' (L' U' L U) (L' U' L U) F",
		pattern: 'lyllyylllllyyyllylyly'
	},
	{
		id: 48,
		group: 'L Shapes',
		setup: "F U R U' R' U R U' R' F'",
		algorithm: "F (R U R' U') (R U R' U') F'",
		pattern: 'lylyyllllylllyyylylyl'
	},
	{
		id: 49,
		group: 'L Shapes',
		setup: "r' U r2' U' r2' U' r2' U r' y2'",
		algorithm: "y2 r U' (r2 U) (r2 U) (r2) U' r",
		pattern: 'lllyyllyllyyylllllyyy'
	},
	{
		id: 50,
		group: 'L Shapes',
		setup: "r U' r2' U r2' U r2' U' r",
		algorithm: "r' U (r2 U') (r2 U') (r2) U r'",
		pattern: 'llllyylylyylllyyyylll'
	},
	{
		id: 51,
		group: 'Line Shapes',
		setup: "f U R U' R' U R U' R' f'",
		algorithm: "f (R U R' U') (R U R' U') f'",
		pattern: 'lllyyylllyyllyyylylll'
	},
	{
		id: 52,
		group: 'Line Shapes',
		setup: "F R U R' d R' U' R U' R'",
		algorithm: "y2 R' (F' U' F U') (R U R' U) R",
		pattern: 'lyllyllylllyylllylyyy'
	},
	{
		id: 53,
		group: 'L Shapes',
		setup: "r' U2' R U R' U' R U R' U r",
		algorithm: "(r' U' R U') (R' U R U') (R' U2 r)",
		pattern: 'llllyylyllyllllyyyyly'
	},
	{
		id: 54,
		group: 'L Shapes',
		setup: "r U2' R' U' R U R' U' R U' r'",
		algorithm: "(r U R' U) (R U' R' U) (R U2 r')",
		pattern: 'lyllyylllllllylyyyyly'
	},
	{
		id: 55,
		group: 'Line Shapes',
		setup: "F R' F' U2' R U R' U R2' U2' R'",
		algorithm: "R U2 R2 (U' R U' R') U2 (F R F')",
		pattern: 'lyllyllylllllllyyyyyy'
	},
	{
		id: 56,
		group: 'Line Shapes',
		setup: "r U r' R U R' U' R U R' U' r U' r'",
		algorithm: "(r U r') (U R U' R') (U R U' R') (r U' r')",
		pattern: 'lllyyyllllyllylylyyly'
	},
	{
		id: 57,
		group: 'All Corners Oriented',
		setup: "r U R' U' M U R U' R'",
		algorithm: "(R U R' U') M' (U R U' r')",
		pattern: 'ylyyyyylylyllylllllll'
	}
];

export const ollGroups = [...new Set(ollCases.map((oll) => oll.group))];
