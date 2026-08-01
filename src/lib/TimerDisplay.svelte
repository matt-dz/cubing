<script lang="ts">
	import type { TrainerTimer, TimerPhase } from './trainer-timer.svelte';

	let {
		timer,
		caseId,
		phase,
		disabled = false,
		onstats
	}: {
		timer: TrainerTimer;
		caseId: string | number | null;
		phase: TimerPhase;
		disabled?: boolean;
		onstats: () => void;
	} = $props();

	function toggle() {
		if (disabled || caseId === null) return;
		timer.toggle(caseId, phase);
	}
</script>

<div class="timer-bar">
	<span aria-hidden="true"></span>
	<button
		class:running={timer.running}
		class="timer-control"
		onclick={toggle}
		disabled={disabled || caseId === null}
		aria-label={timer.running ? 'Stop timer' : 'Start timer'}
	>
		<output aria-live="off">{timer.displayTime}</output>
		<small>{timer.running ? 'SPACE TO STOP' : 'SPACE TO START'}</small>
	</button>
	<button
		class="stats-trigger"
		onclick={onstats}
		disabled={timer.running}
		aria-label="Open timer statistics"
	>
		<span>Stats</span>
		<span>{timer.sessionCount}</span>
	</button>
</div>
