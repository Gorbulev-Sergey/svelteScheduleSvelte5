<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { type IField } from '$lib/entityes/Field';
	import { db } from '$lib/scripts/firebase';
	import { get, ref } from 'firebase/database';

	// Выбранная дата, год, месяц
	let date = $state(new Date().toISOString().slice(0, 7));
	let year = $derived(date.slice(0, 4));
	let month = $derived(date.slice(5, 7));
	// Названия месяцев в именительном падеже
	let monthToSring = $derived(new Date(date).toLocaleString('Ru-ru', { month: 'long' }));
	// Названия месяцев с буквой "я" или "а" на конце (в родительном падеже)
	let monthToStringWithEnd = $derived(
		Number(month) == 3 || Number(month) == 8
			? monthToSring.replace('т', 'та')
			: monthToSring.replace('ь', 'я')
	);

	// Объект для хранения расписания за выбранный месяц
	let dataMonth = $state<{ [date: string]: IField[] }>(
		[] as unknown as { [date: string]: IField[] }
	);
	//Количество дней в месяце с расписанием
	let daysInDataMonth = $derived(Object.keys(dataMonth).length);

	$effect(() => {
		dataMonth = {};
		get(ref(db, `/schedule/${year}/${Number(month)}`)).then((r) => {
			if (r.exists()) {
				dataMonth = r.val();
			}
		});
		console.log(1);
	});

	// Функция для настройки оформления наших элементов
	function getInputColors(date: string) {
		return new Date(date).getDay() == 0 ? 'text-primary' : 'text-dark';
	}
</script>

<Title title="Расписание">
	<div class="flex-grow-1 d-flex justify-content-between gap-1 ms-2">
		<div class="d-flex align-items-center">
			<div class="bg-light text-dark px-3 py-2 rounded-start text-nowrap">на дату:</div>
			<input class="form-control rounded-start-0" type="month" bind:value={date} />
		</div>
	</div>
</Title>

<div class="d-flex flex-column mt-3 rounded bg-light">
	<div class="no-print" style="display: grid; grid-template-columns: .15fr 1fr;">
		<div class="text-end py-2 ps-3 pe-2" style="min-width: 8.2em;">
			<span class="badge bg-dark text-light">Дата</span>
		</div>
		<div style="display: grid; grid-template-columns: 1fr .1fr .6fr">
			<div class="py-2 ps-3 pe-2" style="min-width: 13em;">
				<span class="badge bg-dark text-light">Праздник</span>
			</div>
			<div class="py-2 text-end" style="min-width: 5em;">
				<span class="badge bg-dark text-light">Время</span>
			</div>
			<div class="py-2 ps-4 ps-2 pe-3" style="min-width: 10em;">
				<span class="badge bg-dark text-light">Богослужение</span>
			</div>
		</div>
	</div>
	{#each Object.entries(dataMonth) as [date, item], i}
		<div
			class={`${new Date(date).getDay() == 0 ? 'bg-primary text-primary bg-opacity-10' : 'bg-light text-dark'} 
					${i == daysInDataMonth - 1 ? 'rounded-bottom pb-1' : ''}`}
			style="display: grid; grid-template-columns: .15fr 1fr;">
			<div
				class="d-flex flex-column justify-content-start align-items-end py-1 ps-3 pe-2"
				style="min-width: 8em;">
				<b>{Number(date.slice(8, 10))} {monthToStringWithEnd}</b>
				<i>
					{new Date(date).toLocaleDateString('Ru-ru', {
						weekday: 'long'
					})}
				</i>
			</div>
			<div style="display: grid; grid-template-columns: 1fr .1fr .6fr">
				{#each item as field, j}
					<div class={`py-1 ps-3 pe-2 ${getInputColors(date)}`} style="min-width: 13em;">
						{@html dataMonth[date][j].event}
					</div>
					<div class={`py-1 text-end ${getInputColors(date)} fw-bold`} style="min-width: 5em;">
						{@html dataMonth[date][j].time}
					</div>
					<div
						class={`text-wrap py-1 ps-4 ps-2 pe-3 ${getInputColors(date)}`}
						style="min-width: 10em;">
						{@html dataMonth[date][j].pray}
					</div>
				{/each}
			</div>
		</div>
		{#if i != daysInDataMonth - 1}
			<hr class="my-0 mx-4 p-0 border-secondary border-opacity-50" />
		{/if}
	{/each}
</div>
