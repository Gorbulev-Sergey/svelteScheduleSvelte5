<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import type { IField } from '$lib/entityes/Field';
	import { db } from '$lib/scripts/firebase';
	import { equalTo, get, orderByChild, orderByKey, query, ref } from 'firebase/database';

	let year = $state(2025);
	let month = $state(1);
	let daysInMonth = $derived(new Date(Number(year), Number(month), 0).getDate());
	let week = $state(10);

	function getWeek(date: Date) {
		let week1 = new Date(date.getFullYear(), 0, 1);
		return (
			1 +
			Math.round(
				((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
			)
		);
	}

	function getDatesByWeek(year: number, week: number) {
		// Получаем первый день года
		const firstDayOfYear = new Date(year, 0, 1);

		// Находим первый понедельник года
		const firstMonday = firstDayOfYear.getDate() + ((1 - firstDayOfYear.getDay() + 7) % 7);
		const startOfWeek = new Date(year, 0, firstMonday + (week - 2) * 7);

		// Создаем массив для хранения дат
		const dates = [];

		// Заполняем массив датами с понедельника по воскресенье
		for (let i = 1; i < 8; i++) {
			const date = new Date(startOfWeek);
			date.setDate(startOfWeek.getDate() + i);
			dates.push(date.toISOString().slice(0, 10));
		}

		return dates;
	}

	async function getScheduleByWeek(dates: string[]) {
		let schedule: { [date: string]: IField[] } = {};
		dates.forEach((d) => {
			get(ref(db, `/schedule/${d.slice(0, 4)}/${Number(d.slice(5, 7))}/${d}`)).then((r) => {
				if (r.exists()) schedule[d] = r.val();
			});
		});
		return schedule;
	}
</script>

<Title title="Выборка по неделям" />

<!-- <div class="d-flex">
	{#each Array(daysInMonth) as item, i}
		<div class="px-2">
			{getWeek(new Date(`${year}-${month}-${i < 10 ? '0' : ''}${i + 1}`))}
		</div>
	{/each}
</div> -->

<div class="d-flex gap-2 mt-3">
	<input class="form-control" type="number" bind:value={week} placeholder="номер недели" />
	<button
		class="btn btn-dark text-light"
		onclick={async () => {
			//console.log(d.slice(0, 4), '*', d.slice(5, 7), '*', d.slice(8, 10));
			console.log(getDatesByWeek(year, week));
			console.log(await getScheduleByWeek(getDatesByWeek(year, week)));
		}}>Выбрать</button>
</div>
