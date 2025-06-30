<script lang="ts">
	import Title from '$lib/components/Title.svelte';

	let date = $state(new Date().toISOString().slice(0, 7));
	let year = $derived(date.slice(0, 4));
	let month = $derived(date.slice(5, 7));
	let monthToSring = $derived(new Date(date).toLocaleString('Ru-ru', { month: 'long' }));
	let monthToStringWithEnd = $derived(
		// Добавляем в конец названия месяца букву "я" или "а"
		Number(month) == 3 || Number(month) == 8
			? monthToSring.replace('т', 'та')
			: monthToSring.replace('ь', 'я')
	);

	let arrayMonth = $derived(Array<string>(daysInMonth(Number(year), Number(month))));

	function daysInMonth(year: number, month: number) {
		return new Date(Number(year), Number(month), 0).getDate();
	}
</script>

<Title title={`Редактировать расписание на <b>${monthToSring} ${year} года </b>`}>
	<div class="flex-grow-1 d-flex justify-content-end gap-1">
		<div class="d-flex align-items-center">
			<div class="bg-light text-dark px-3 py-2 rounded-start text-nowrap">выбор даты:</div>
			<input class="form-control rounded-start-0" type="month" bind:value={date} />
		</div>
		<button class="btn btn-dark text-light" onclick={() => {}}>Сохранить</button>
	</div>
</Title>

<div class="d-flex flex-column mt-3">
	{#each arrayMonth as item, i}
		<div class="d-flex">
			<div
				class="bg-dark bg-opacity-10 text-dark px-2 py-1 text-nowrap text-end"
				style="min-width: 15%;"
			>
				<div class="d-flex flex-column">
					<b
						>{i + 1}
						{monthToStringWithEnd}</b
					>
					<div>
						{new Date(Number(year), Number(month) - 1, i + 1).toLocaleDateString('Ru-ru', {
							weekday: 'long'
						})}
					</div>
				</div>
			</div>
			<input
				class="form-control border-dark border-opacity-10 rounded-0"
				bind:value={arrayMonth[i]}
			/>
		</div>
	{/each}
</div>
