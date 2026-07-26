import { ollCases as data, ollGroups } from './oll-data.js';

export type OllCase = {
	id: number;
	group: string;
	setup: string;
	algorithm: string;
	pattern: string;
};

export const ollCases: OllCase[] = data;
export { ollGroups };
