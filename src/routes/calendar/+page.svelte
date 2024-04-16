<script>
	export let data;

	const getCurrentWeekDatesFormatted = () => {
		const daysOfWeek = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];
		const currentDate = new Date();
		const weekStart =
			currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1);

		let dates = [];
		for (let i = 0; i < 7; i++) {
			let day = new Date(currentDate.setDate(weekStart + i));
			dates.push(
				`${daysOfWeek[day.getDay()]} ${day.getDate().toString().padStart(2, '0')}/${(day.getMonth() + 1).toString().padStart(2, '0')}`
			);
		}

		return dates;
	};

	const thisWeek = getCurrentWeekDatesFormatted();
</script>

<div class="flex flex-col items-center p-4">
	<button class="btn btn-wide font-bold btn-info text-white mb-5" style="background-color: #00aeef; border-color: #00aeef"> OFFICE OPEN HOURS</button>

	<div class="overflow-x-auto">
		<table class="table">
			<tbody>
				{#each thisWeek as day}
					<tr class="max-[600px]:border-b max-[600px]:border-gray-700">
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
											<p>{time.initial.format('LT')} to {time.ending.format('LT')}</p>
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
</div>
