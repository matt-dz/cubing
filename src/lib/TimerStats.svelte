<script lang="ts">
	import { formatDuration, type TrainerTimer } from './trainer-timer.svelte';

	let {
		timer,
		trainerName,
		onclose
	}: {
		timer: TrainerTimer;
		trainerName: 'OLL' | 'PLL';
		onclose: () => void;
	} = $props();

	const dateFormatter = new Intl.DateTimeFormat(undefined, {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	});
</script>

<div
	class="backdrop"
	role="presentation"
	onclick={(event) => event.target === event.currentTarget && onclose()}
>
	<div class="stats-panel" role="dialog" aria-modal="true" aria-labelledby="stats-title">
		<div class="stats-header">
			<div>
				<span class="eyebrow-label">TIMING</span>
				<h2 id="stats-title">{trainerName} statistics</h2>
			</div>
			<button class="close" onclick={onclose} aria-label="Close statistics">×</button>
		</div>

		<div class="stats-grid">
			<div>
				<span>Last</span>
				<strong>{formatDuration(timer.lastSolve?.durationMs ?? null)}</strong>
			</div>
			<div>
				<span>Best</span>
				<strong>{formatDuration(timer.bestMs)}</strong>
			</div>
			<div>
				<span>Mean</span>
				<strong>{formatDuration(timer.sessionMeanMs)}</strong>
			</div>
			<div>
				<span>Median</span>
				<strong>{formatDuration(timer.sessionMedianMs)}</strong>
			</div>
			<div>
				<span>Solves</span>
				<strong>{timer.sessionCount}</strong>
			</div>
		</div>

		<div class="recent-header">
			<div>
				<h3>Solve history</h3>
				<span>Saved on this browser</span>
			</div>
		</div>

		<div class="recent-solves">
			{#if timer.solveHistory.length === 0}
				<p>No timed solves yet.</p>
			{:else}
				{#each timer.solveHistory as solve (solve.id)}
					<div class="solve-row">
						<div>
							<strong>{trainerName} {solve.caseId}</strong>
							<span>{dateFormatter.format(new Date(solve.timestamp))}</span>
						</div>
						{#if solve.phase === 'starred'}<small>STARRED</small>{/if}
						<output>{formatDuration(solve.durationMs)}</output>
						<button
							class="delete-solve"
							onclick={() => timer.deleteSolve(solve.id)}
							aria-label={`Delete ${trainerName} ${solve.caseId} time ${formatDuration(solve.durationMs)}`}
							title="Delete time">×</button
						>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
