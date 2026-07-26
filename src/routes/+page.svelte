<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Cubing</title>
	<meta name="description" content="Personal Rubik's Cube speedsolving tools." />
</svelte:head>

<main class="home">
	<section class="home-content">
		<div class="home-brand">
			<span class="brand-mark"></span>
			<span>CUBING</span>
		</div>

		<a class="trainer-link" href={resolve('/oll-trainer')}>
			<span>OLL Trainer</span>
			<span class="trainer-link-arrow" aria-hidden="true">→</span>
		</a>
	</section>
</main>
