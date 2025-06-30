<script lang="ts">
	import Title from '$lib/components/Title.svelte';

	let date = $state(new Date().toISOString().slice(0, 7));
	let year = $derived(date.slice(0, 4));
	let month = $derived(date.slice(5, 7));
	let monthToSring = $derived(new Date(date).toLocaleString('Ru-ru', { month: 'long' }));
	let monthToStringWithEnd = $derived(
		//
		Number(month) == 2 || Number(month) == 8 ? monthToSring + 'а' : monthToSring.replace('ь', 'я')
	);

	function daysInMonth(year: number, month: number) {
		return new Date(Number(year), Number(month), 0).getDate();
	}

	let arrayMonth = $derived(Array<string>(daysInMonth(Number(year), Number(month))));
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

{monthToStringWithEnd}

<div class="d-flex flex-column gap-1 mt-3">
	{#each arrayMonth as item, i}
		<div class="d-flex">
			<div
				class="bg-dark text-light px-3 py-2 rounded-start text-nowrap text-end"
				style="min-width: 8%;"
			>
				{i + 1}
				{monthToStringWithEnd}
			</div>
			<input class="form-control rounded-start-0" bind:value={arrayMonth[i]} />
		</div>
	{/each}
</div>
