<script>
	import '../app.css';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { inject } from '@vercel/analytics'

	injectSpeedInsights();
	inject();

</script>

<svelte:head>
	<title>Ofi-Time</title>
</svelte:head>

<slot />
