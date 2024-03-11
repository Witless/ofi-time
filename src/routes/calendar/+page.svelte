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
	<button class="btn btn-wide font-bold btn-info"> OFFICE OPEN HOURS</button>

	<div class="overflow-x-auto">
		<table class="table">
			<tbody>
				{#each thisWeek as day}
					<tr>
						<th>
							<div class="btn btn-lg btn-primary w-56">
								{day}
							</div>
						</th>
						{#if data[day.split(' ')[0]].length}
							<div class="flex space-x-3.5">
								{#each data[day.split(' ')[0]] as time}
									<th>
										<div class="btn btn-lg btn-success w-87">
											<p>{time.initial.format('LT')} to {time.ending.format('LT')}</p>
										</div>
									</th>
								{/each}
							</div>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
