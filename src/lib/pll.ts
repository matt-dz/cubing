import { pllCases as data, pllGroups } from './pll-data.js';

export type PllCase = {
	id: string;
	group: string;
	setup: string;
	algorithm: string;
	pattern: string;
	edgePermutation: number[];
	cornerPermutation: number[];
};

export const pllCases: PllCase[] = data;
export { pllGroups };
