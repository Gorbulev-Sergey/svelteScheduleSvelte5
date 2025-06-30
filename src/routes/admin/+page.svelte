<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { type IField, Field } from '$lib/entityes/Field';
	import { SubField } from '$lib/entityes/SubField';
	import { db } from '$lib/scripts/firebase';
	import { get, ref, set } from 'firebase/database';

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

	let arrayMonth = $state<IField[]>([]);
	$effect(() => {
		arrayMonth = [...Array<IField>(daysInMonth)].map((v, i) =>
			Field(`${year}-${month}-${i + 1 < 10 ? '0' : ''}${i + 1}`)
		);
		get(ref(db, `/schedule/${year}/${Number(month)}`)).then((r) => {
			if (r.exists()) {
				arrayMonth = [...(Object.values(r.val()) as IField[]), ...arrayMonth];
				//console.log(r.val());
			}
		});
		console.log('привкет');
	});
	function getInputColors(date: string) {
		return new Date(date).getDay() == 6 ? 'text-primary' : 'text-dark';
	}
</script>

<Title title={`Редактировать расписание на <b>${monthToSring} ${year} года </b>`}>
	<div class="flex-grow-1 d-flex justify-content-end gap-1">
		<div class="d-flex align-items-center">
			<div class="bg-light text-dark px-3 py-2 rounded-start text-nowrap">выбор даты:</div>
			<input class="form-control rounded-start-0" type="month" bind:value={date} />
		</div>
		<button
			class="btn btn-dark text-light"
			onclick={() => {
				let result = $state.snapshot(
					arrayMonth.filter((f) =>
						f.fields.find(
							(sf) => sf.event.trim() != '' || sf.time != '00:00' || sf.pray.trim() != ''
						)
					)
				);
				set(ref(db, `/schedule/${year}/${Number(month)}`), result);
			}}>Сохранить</button>
	</div>
</Title>

<div class="d-flex flex-column mt-3">
	{#each arrayMonth as item, i}
		<div
			class={`d-flex ${new Date(item.date).getDay() == 6 ? 'bg-primary text-primary' : 'bg-light text-dark'} bg-opacity-10 border-bottom`}>
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
					item.fields.push(SubField());
				}}>+</button>
			<div class="flex-grow-1 d-flex flex-column">
				{#each item.fields as field, j}
					<div class="d-flex h-100">
						<div class="d-flex w-75">
							{#if item.fields.length > 1}
								<button
									class="btn btn-dark text-light rounded-0"
									onclick={() => item.fields.splice(j, 1)}>-</button>
							{/if}
							<input
								class={`form-control bg-light bg-transparent border-0 rounded-0 ${getInputColors(item.date)}`}
								bind:value={arrayMonth[i].fields[j].event}
								placeholder="event" />
						</div>
						<input
							type="time"
							class={`form-control bg-transparent border-0 rounded-0 ${getInputColors(item.date)}`}
							style="width: 8em;"
							bind:value={arrayMonth[i].fields[j].time} />
						<input
							class={`form-control bg-transparent border-0 rounded-0 ${getInputColors(item.date)}`}
							style="width: 26em;"
							bind:value={arrayMonth[i].fields[j].pray}
							placeholder="pray" />
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
