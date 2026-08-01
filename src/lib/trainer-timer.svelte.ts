export type TimerPhase = 'regular' | 'starred';

export type TimerSolve = {
	id: string;
	caseId: string;
	durationMs: number;
	timestamp: number;
	phase: TimerPhase;
};

const maximumStoredSolves = 1000;

export class TrainerTimer {
	elapsedMs = $state(0);
	running = $state(false);
	solves = $state<TimerSolve[]>([]);
	sessionSolveIds = $state<string[]>([]);

	#storageKey: string;
	#animationFrame: number | null = null;
	#startedAt = 0;
	#caseId = '';
	#phase: TimerPhase = 'regular';
	#displayedSolveId: string | null = null;

	constructor(storageKey: string) {
		this.#storageKey = storageKey;
	}

	get displayTime() {
		return formatDuration(this.elapsedMs);
	}

	get lastSolve() {
		return this.solves.at(-1) ?? null;
	}

	get bestMs() {
		if (this.solves.length === 0) return null;
		return Math.min(...this.solves.map((solve) => solve.durationMs));
	}

	get sessionSolves() {
		const sessionIds = new Set(this.sessionSolveIds);
		return this.solves.filter((solve) => sessionIds.has(solve.id));
	}

	get sessionCount() {
		return this.sessionSolves.length;
	}

	get sessionMeanMs() {
		const solves = this.sessionSolves;
		if (solves.length === 0) return null;
		return solves.reduce((total, solve) => total + solve.durationMs, 0) / solves.length;
	}

	get sessionMedianMs() {
		const durations = this.sessionSolves.map((solve) => solve.durationMs).sort((a, b) => a - b);
		if (durations.length === 0) return null;

		const middle = Math.floor(durations.length / 2);
		return durations.length % 2 === 0
			? (durations[middle - 1] + durations[middle]) / 2
			: durations[middle];
	}

	get solveHistory() {
		return [...this.solves].reverse();
	}

	load() {
		const saved = localStorage.getItem(this.#storageKey);
		if (!saved) return;

		try {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed) && parsed.every(isTimerSolve)) {
				this.solves = parsed.slice(-maximumStoredSolves);
				return;
			}
		} catch {
			// Invalid local data falls through to removal.
		}

		localStorage.removeItem(this.#storageKey);
	}

	toggle(caseId: string | number, phase: TimerPhase) {
		if (this.running) {
			this.stop();
			return;
		}

		this.start(caseId, phase);
	}

	start(caseId: string | number, phase: TimerPhase) {
		if (this.running) return;

		this.#caseId = String(caseId);
		this.#phase = phase;
		this.#displayedSolveId = null;
		this.elapsedMs = 0;
		this.#startedAt = performance.now();
		this.running = true;
		this.#tick();
	}

	stop() {
		if (!this.running) return null;

		const durationMs = Math.max(0, Math.floor((performance.now() - this.#startedAt) / 10) * 10);
		this.running = false;
		this.elapsedMs = durationMs;
		this.#cancelAnimation();

		const solve: TimerSolve = {
			id: createSolveId(),
			caseId: this.#caseId,
			durationMs,
			timestamp: Date.now(),
			phase: this.#phase
		};

		this.solves = [...this.solves, solve].slice(-maximumStoredSolves);
		this.sessionSolveIds = [...this.sessionSolveIds, solve.id];
		this.#displayedSolveId = solve.id;
		this.#persist();
		return solve;
	}

	resetDisplay() {
		if (this.running) return;
		this.#displayedSolveId = null;
		this.elapsedMs = 0;
	}

	deleteSolve(solveId: string) {
		if (this.running || !this.solves.some((solve) => solve.id === solveId)) return;

		this.solves = this.solves.filter((solve) => solve.id !== solveId);
		this.sessionSolveIds = this.sessionSolveIds.filter((id) => id !== solveId);
		if (this.#displayedSolveId === solveId) {
			this.#displayedSolveId = null;
			this.elapsedMs = 0;
		}
		this.#persist();
	}

	destroy() {
		this.running = false;
		this.#cancelAnimation();
	}

	#tick = () => {
		if (!this.running) return;
		this.elapsedMs = performance.now() - this.#startedAt;
		this.#animationFrame = requestAnimationFrame(this.#tick);
	};

	#cancelAnimation() {
		if (this.#animationFrame === null) return;
		cancelAnimationFrame(this.#animationFrame);
		this.#animationFrame = null;
	}

	#persist() {
		localStorage.setItem(this.#storageKey, JSON.stringify(this.solves));
	}
}

export function formatDuration(durationMs: number | null) {
	if (durationMs === null) return '–';

	const centiseconds = Math.floor(durationMs / 10);
	const minutes = Math.floor(centiseconds / 6000);
	const seconds = (centiseconds % 6000) / 100;

	return minutes > 0 ? `${minutes}:${seconds.toFixed(2).padStart(5, '0')}` : seconds.toFixed(2);
}

function createSolveId() {
	return (
		globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
	);
}

function isTimerSolve(value: unknown): value is TimerSolve {
	if (!value || typeof value !== 'object') return false;
	const solve = value as Partial<TimerSolve>;

	return (
		typeof solve.id === 'string' &&
		typeof solve.caseId === 'string' &&
		typeof solve.durationMs === 'number' &&
		Number.isFinite(solve.durationMs) &&
		solve.durationMs >= 0 &&
		typeof solve.timestamp === 'number' &&
		Number.isFinite(solve.timestamp) &&
		(solve.phase === 'regular' || solve.phase === 'starred')
	);
}
