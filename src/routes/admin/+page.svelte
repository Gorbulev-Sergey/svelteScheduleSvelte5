<script lang="ts">
	import MonthPicker from '$lib/components/MonthPicker.svelte';
	import Title from '$lib/components/Title.svelte';
	import { Field, type IField } from '$lib/entityes/Field';
	import { db } from '$lib/scripts/firebase';
	import { get, ref, set } from 'firebase/database';

	// Выбранная дата, год, месяц
	let date = $state(new Date().toISOString().slice(0, 7));
	let year = $derived(date.slice(0, 4));
	let month = $derived(date.slice(5, 7));
	//Количество дне в выбранном месяце
	let daysInMonth = $derived(new Date(Number(year), Number(month), 0).getDate());
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

	$effect(() => {
		let a: { [date: string]: IField[] } = {};
		for (let i = 0; i < daysInMonth; i++) {
			a[`${year}-${month}-${i < 9 ? '0' : ''}${i + 1}`] = [Field()];
		}
		dataMonth = a;
		get(ref(db, `/schedule/${year}/${Number(month)}`)).then((r) => {
			if (r.exists()) {
				let result = r.val() as { [date: string]: IField[] };
				Object.keys(result).forEach((k) => {
					dataMonth[k] = result[k];
				});
			}
		});
		console.log(daysInMonth);
	});

	// Функция для настройки оформления наших элементов
	function getInputColors(date: string) {
		return new Date(date).getDay() == 0 ? 'text-primary' : 'text-dark';
	}
</script>

<Title title="Редактировать расписание">
	<div class="flex-grow-1 d-flex align-items-center justify-content-between gap-1 ms-3">
		<MonthPicker title="на дату:" bind:date bind:month bind:year />
		<button
			class="btn btn-dark text-light"
			onclick={() => {
				let result: { [date: string]: IField[] } = {};
				for (let i = 0; i < daysInMonth; i++) {
					dataMonth[`${year}-${month}-${i < 9 ? '0' : ''}${i + 1}`].forEach(() => {
						result[`${year}-${month}-${i < 9 ? '0' : ''}${i + 1}`] = dataMonth[
							`${year}-${month}-${i < 9 ? '0' : ''}${i + 1}`
						].filter((v) => v.event.trim() != '' || v.pray.trim() != '');
					});
				}

				set(ref(db, `/schedule/${year}/${Number(month)}`), result);
			}}>Сохранить</button>
	</div>
</Title>

<div class="d-flex flex-column rounded">
	{#each Object.entries(dataMonth) as [date, item], i}
		<div
			class={`d-flex 
						${new Date(date).getDay() == 0 ? 'bg-primary text-primary bg-opacity-10' : 'bg-light text-dark'}  
						${i == 0 ? 'rounded-top' : ''} 
						${i == daysInMonth - 1 ? 'rounded-bottom' : ''}`}>
			<div class={`px-2 py-1 text-nowrap text-end`} style="min-width: 9em;">
				<div class="d-flex flex-column">
					<b>{Number(date.slice(8, 10))} {monthToStringWithEnd}</b>
					<div>
						{new Date(date).toLocaleDateString('Ru-ru', {
							weekday: 'long'
						})}
					</div>
				</div>
			</div>
			<button
				class={`btn btn-light ${new Date(date).getDay() == 0 ? 'bg-primary text-primary' : ' bg-dark text-dark'} bg-opacity-25 fw-bold rounded-1 px-2`}
				onclick={() => {
					item.push(Field());
				}}>+</button>
			<div class="flex-grow-1 d-flex flex-column">
				{#each item as field, j}
					<div class="d-flex h-100">
						<div class="d-flex w-75">
							{#if item.length > 1}
								<button
									class={`btn btn-light ${new Date(date).getDay() == 0 ? 'bg-primary text-primary' : ' bg-dark text-dark'} bg-opacity-25 fw-bold rounded-1 px-2`}
									onclick={() => item.splice(j, 1)}>-</button>
							{/if}
							<input
								class={`form-control bg-light bg-transparent border-0 rounded-0 ${getInputColors(date)} my-1 ms-1 px-2`}
								bind:value={dataMonth[date][j].event}
								placeholder=""
								title="Праздник" />
						</div>
						<input
							type="time"
							class={`form-control bg-transparent border-0 rounded-0 ${getInputColors(date)} ${field.time != '00:00' ? 'fw-bold' : 'text-opacity-25'} my-1 px-2`}
							style="width: 8em;"
							bind:value={dataMonth[date][j].time}
							title="Время" />
						<input
							multiple
							class={`form-control bg-transparent border-0 rounded-0 ${getInputColors(date)} my-1 me-1 px-2`}
							style="width: 24em;"
							bind:value={dataMonth[date][j].pray}
							title="Богослужение" />
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
