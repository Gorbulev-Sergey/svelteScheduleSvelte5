<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { Field, type IField } from '$lib/entityes/Field';
	import { db } from '$lib/scripts/firebase';
	import { get, ref, set } from 'firebase/database';

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
	{#each Object.entries(dataMonth) as [date, item], i}
		<div
			class={`d-flex
						${new Date(date).getDay() == 0 ? 'bg-primary text-primary bg-opacity-10' : 'bg-light text-dark'}  
						${i == 0 ? 'rounded-top' : ''} 
						${i == daysInDataMonth - 1 ? 'rounded-bottom' : ''}`}>
			<div class={`px-2 py-1 text-nowrap text-end`} style="min-width: 9em;">
				<div class="d-flex justify-content-center align-items-center flex-column">
					<b>{Number(date.slice(8, 10))} {monthToStringWithEnd}</b>
					<div>
						{new Date(date).toLocaleDateString('Ru-ru', {
							weekday: 'long'
						})}
					</div>
				</div>
			</div>
			<div class="flex-grow-1 d-flex flex-column">
				{#each item as field, j}
					<div class="d-flex h-100 align-items-center">
						<div class="d-flex w-75">
							<div
								class={`form-control bg-light bg-transparent border-0 rounded-0 ${getInputColors(date)} my-1`}>
								{@html dataMonth[date][j].event}
							</div>
						</div>
						<div
							class={`form-control bg-transparent border-0 rounded-0 ${getInputColors(date)} ${field.time != '00:00' ? 'fw-bold' : 'text-opacity-25'} my-1`}
							style="width: 4em;">
							{@html dataMonth[date][j].time}
						</div>
						<div
							class={`form-control bg-transparent border-0 rounded-0 ${getInputColors(date)} my-1`}
							style="width: 24em;">
							{@html dataMonth[date][j].pray}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
