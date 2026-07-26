<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>3×3 Speedcubing Tools | Cubing</title>
	<meta
		name="description"
		content="Rubik's Cube 3×3 speedsolving tools, including an OLL trainer for all 57 cases."
	/>
	<link rel="canonical" href="https://cubing.mutex.nyc/" />
</svelte:head>

<main class="home">
	<section class="home-content">
		<h1 class="home-brand">
			<span class="brand-mark"></span>
			<span>CUBING</span>
		</h1>

		<a class="trainer-link" href={resolve('/oll-trainer')}>
			<span>OLL Trainer</span>
			<span class="trainer-link-arrow" aria-hidden="true">→</span>
		</a>
	</section>
</main>
