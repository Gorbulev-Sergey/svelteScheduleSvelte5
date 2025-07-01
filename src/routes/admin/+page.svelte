<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { type IField, Field } from '$lib/entityes/Field';
	import { SubField, type ISubField } from '$lib/entityes/SubField';
	import { db } from '$lib/scripts/firebase';
	import { get, onValue, ref, set } from 'firebase/database';
	import { onMount } from 'svelte';

	let date = $state(new Date().toISOString().slice(0, 7));
	let year = $derived(date.slice(0, 4));
	let month = $derived(date.slice(5, 7));
	let daysInMonth = $derived(new Date(Number(year), Number(month), 0).getDate());
	let monthToSring = $derived(new Date(date).toLocaleString('Ru-ru', { month: 'long' }));
	let monthToStringWithEnd = $derived(
		// Добавляем в конец названия месяца букву "я" или "а"
		Number(month) == 3 || Number(month) == 8
			? monthToSring.replace('т', 'та')
			: monthToSring.replace('ь', 'я')
	);

	let arrayMonth = $state<{ [date: string]: ISubField[] }>(
		[] as unknown as { [date: string]: ISubField[] }
	);

	$effect(() => {
		let a: { [date: string]: ISubField[] } = {};
		for (let i = 0; i < daysInMonth; i++) {
			a[`${year}-${month}-${i + 1}`] = [SubField()];
		}
		arrayMonth = a;
		get(ref(db, `/schedule/${year}/${Number(month)}`)).then((r) => {
			if (r.exists()) {
				arrayMonth = { ...a, ...r.val() };
			}
		});
		console.log(daysInMonth);
	});
	function getInputColors(date: string) {
		return new Date(date).getDay() == 0 ? 'text-primary' : 'text-dark';
	}
</script>

<Title title={`Редактировать расписание`}>
	<div class="flex-grow-1 d-flex justify-content-between gap-1 ms-2">
		<div class="d-flex align-items-center">
			<div class="bg-light text-dark px-3 py-2 rounded-start text-nowrap">на дату:</div>
			<input class="form-control rounded-start-0" type="month" bind:value={date} />
		</div>
		<button
			class="btn btn-dark text-light"
			onclick={() => {
				let result: { [date: string]: ISubField[] } = {};
				for (let i = 0; i < daysInMonth; i++) {
					arrayMonth[`${year}-${month}-${i + 1}`].forEach(() => {
						result[`${year}-${month}-${i + 1}`] = arrayMonth[`${year}-${month}-${i + 1}`].filter(
							(v) => v.event.trim() != '' || v.time != '00:00' || v.pray.trim() != ''
						);
					});
				}

				set(ref(db, `/schedule/${year}/${Number(month)}`), result);
			}}>Сохранить</button>
	</div>
</Title>

<div class="d-flex flex-column mt-3">
	{#each Object.entries(arrayMonth) as [date, item], i}
		<div
			class={`d-flex 
						${new Date(date).getDay() == 0 ? 'bg-primary text-primary' : 'bg-light text-dark'} bg-opacity-10  
						${i == 0 ? 'rounded-top' : ''}`}>
			<div class={`px-2 py-1 text-nowrap text-end`} style="min-width: 9em;">
				<div class="d-flex flex-column">
					<b>{i + 1} {monthToStringWithEnd}</b>
					<div>
						{new Date(Number(year), Number(month) - 1, i + 1).toLocaleDateString('Ru-ru', {
							weekday: 'long'
						})}
					</div>
				</div>
			</div>
			<button
				class="btn btn-dark text-light rounded-0"
				onclick={() => {
					item.push(SubField());
				}}>+</button>
			<div class="flex-grow-1 d-flex flex-column">
				{#each item as field, j}
					<div class="d-flex h-100">
						<div class="d-flex w-75">
							{#if item.length > 1}
								<button class="btn btn-dark text-light rounded-0" onclick={() => item.splice(j, 1)}
									>-</button>
							{/if}
							<input
								class={`form-control bg-light bg-transparent border-0 rounded-0 ${getInputColors(date)}`}
								bind:value={arrayMonth[date][j].event}
								placeholder="праздник" />
						</div>
						<input
							type="time"
							class={`form-control bg-transparent border-0 rounded-0 ${getInputColors(date)}`}
							style="width: 8em;"
							bind:value={arrayMonth[date][j].time} />
						<input
							multiple
							class={`form-control bg-transparent border-0 rounded-0 ${getInputColors(date)}`}
							style="width: 24em;"
							bind:value={arrayMonth[date][j].pray}
							placeholder="богослужение" />
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
