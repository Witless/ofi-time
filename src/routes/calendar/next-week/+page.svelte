<script>

	import moment from 'moment';
	import { onMount } from 'svelte';
	export let data;

	let inIFrame = false;

	onMount(() => {
		inIFrame = window.self !== window.top;
		data = null
	});

	const getCurrentWeekDatesFormatted = () => {
		const startOfWeek =  moment().startOf('isoweek').add(7, 'days');
		let dates = [];

		for(let i = 0; i < 7; i++){
			dates.push(moment(startOfWeek).add(i, 'days').format("dddd DD[/]MM"))
		}

		return dates;

	}

	const thisWeek = getCurrentWeekDatesFormatted();
</script>

<div class="flex flex-col items-center p-4 ${inIFrame ? 'bg-white' : ''}">
	<button class="btn btn-wide font-bold btn-info text-white mb-5" style="background-color: #00aeef; border-color: #00aeef"> OFFICE OPEN HOURS</button>

	<div class="overflow-x-auto">
		<table class="table">
			<tbody>
				{#each thisWeek as day}
					<tr class="max-[600px]:border-b max-[600px]:border-gray-700 ${inIFrame ? 'border-b border-gray-700' : ''}" style="border-color: #f47b20">
						<th>
							<div class="btn btn-lg btn-primary w-32 md:w-56 text-white" style="background-color: #f47b20; border-color: #f47b20">
								{day}
							</div>
						</th>
						{#if data[day.split(' ')[0]].length}
							<div class="flex flex-col">
								{#each data[day.split(' ')[0]] as time}
									<th>
										<div class="btn btn-lg btn-success md:w-87 text-white w-48" style="background-color: #7ac143; border-color: #7ac143">
											<p>{time.initial.format('HH[:]mm')} to {time.ending.format('HH[:]mm')}</p>
										</div>
									</th>
								{/each}
							</div>
							{:else}
							<th>
								<div class="btn btn-lg btn-success md:w-87 text-white w-48" style="background-color: rgba(122,193,67,0.74); border-color: rgba(122,193,67,0.74)">
									<p>🚫 Office closed</p>
								</div>
							</th>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<a href="/calendar">
		<div class="btn btn-lg btn-warning md:w-87 text-white w-58 mt-12" >

			👁 See current week

		</div>
	</a>

</div>
