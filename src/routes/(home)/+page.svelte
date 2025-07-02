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

<div class="d-flex flex-column mt-3 rounded">
	<div>
		<div class="py-2 ps-4 print-title d-none">
			<b>Расписание на {monthToSring.toUpperCase()} {year} года</b>
		</div>
		<div
			class="no-print"
			style="display: grid; grid-template-columns: .15fr 1fr; min-height: 2.1em">
			<div class="text-end px-3" style="min-width: 8.2em;">
				<span class="badge bg-dark text-light">Дата</span>
			</div>
			<div style="display: grid; grid-template-columns: 1fr .1fr .4fr">
				<div class="text-start ps-2" style="min-width: 13em;">
					<span class="badge bg-dark text-light">Праздник</span>
				</div>
				<div class="text-end" style="min-width: 5em;">
					<span class="badge bg-dark text-light">Время</span>
				</div>
				<div class="text-start ps-4" style="min-width: 8em;">
					<span class="badge bg-dark text-light">Богослужение</span>
				</div>
			</div>
		</div>
	</div>
	{#each Object.entries(dataMonth) as [date, item], i}
		<div
			class={`d-flex
						${new Date(date).getDay() == 0 ? 'bg-primary text-primary bg-opacity-10' : 'bg-light text-dark'}  
						${i == 0 ? 'rounded-top' : ''} 
						${i == daysInDataMonth - 1 ? 'rounded-bottom' : ''}`}>
			<div
				class="d-flex flex-column justify-content-start align-items-end ps-4 pe-2 py-2"
				style="min-width: 10em;">
				<b>{Number(date.slice(8, 10))} {monthToStringWithEnd}</b>
				<i>
					{new Date(date).toLocaleDateString('Ru-ru', {
						weekday: 'long'
					})}
				</i>
			</div>
			<div class="flex-grow-1 d-flex flex-column text-wrap">
				{#each item as field, j}
					<div class="d-flex align-items-start">
						<div
							class={`w-100 bg-light bg-transparent border-0 rounded-0 px-3 py-2 ${getInputColors(date)}`}
							style="width: 50em;">
							{@html dataMonth[date][j].event}
						</div>
						<div
							class={`d-flex justify-content-center align-items-end bg-transparent border-0 rounded-0 py-2 ${getInputColors(date)} fw-bold`}
							style="width: 4em;">
							{@html dataMonth[date][j].time}
						</div>
						<div
							class={`bg-transparent border-0 rounded-0 px-3 py-2 ${getInputColors(date)}`}
							style="width: 24em;">
							{@html dataMonth[date][j].pray}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
