<script lang="ts">
	import WeekPicker from '$lib/components/WeekPicker.svelte';
	import Title from '$lib/components/Title.svelte';
	import type { IField } from '$lib/entityes/Field';
	import { db } from '$lib/scripts/firebase';
	import { get, ref } from 'firebase/database';
	import { onMount } from 'svelte';

	let week = $state(27);
	let year = $state(2025);
	let month = $state(1);
	let daysInMonth = $derived(new Date(Number(year), Number(month), 0).getDate());
	// Объект для хранения расписания за выбранную неделю
	let dataSchedule = $state<{ [date: string]: IField[] }>(
		[] as unknown as { [date: string]: IField[] }
	);
	let weekPicker = $state({
		min: 1,
		low: getWeek(new Date()),
		up: getWeek(new Date()),
		max: getWeeksInYear(year)
	});

	// Названия месяцев в именительном падеже
	function monthToSring(date: Date) {
		return date.toLocaleString('Ru-ru', { month: 'long' });
	}
	// Названия месяцев с буквой "я" или "а" на конце (в родительном падеже)
	function monthToStringWithEnd(date: Date) {
		let m = date.getMonth() + 1;
		return Number(m) == 3 || Number(m) == 8
			? monthToSring(date).replace('т', 'та')
			: monthToSring(date).replace('ь', 'я');
	}

	function getWeek(date: Date) {
		let week1 = new Date(date.getFullYear(), 0, 1);
		return (
			1 +
			Math.round(
				((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
			)
		);
	}

	// Колличество недель в году
	function getWeeksInYear(year: number) {
		// 1 января года
		const firstDay = new Date(year, 0, 1);
		// 31 декабря года
		const lastDay = new Date(year, 11, 31);

		// Номер недели для 31 декабря
		const weeks = getWeek(lastDay);

		// Если номер недели 1, значит последний день попал в первую неделю следующего года,
		// значит в году 52 недели, иначе weeks = 52 или 53
		return weeks === 1 ? 52 : weeks;
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

	async function getScheduleByWeek(dates: string[], schedule: { [date: string]: IField[] }) {
		dates.forEach((d) => {
			get(ref(db, `/schedule/${d.slice(0, 4)}/${Number(d.slice(5, 7))}/${d}`)).then((r) => {
				if (r.exists()) schedule[d] = r.val();
			});
		});
		return schedule;
	}

	// Функция для настройки оформления наших элементов
	function getInputColors(date: string) {
		return new Date(date).getDay() == 0 ? 'text-primary' : 'text-dark';
	}

	onMount(async () => {
		let dates: string[] = [];
		for (let w = weekPicker.low; w <= weekPicker.up; w++) {
			dates = [...dates, ...getDatesByWeek(year, w)];
		}
		getScheduleByWeek(dates, dataSchedule);
	});
</script>

<Title title={'Выборка по неделям за ' + year + ' год'}>
	<div class="d-inline-flex gap-1 pt-1 ms-3">
		<WeekPicker
			title="от:"
			bind:min={weekPicker.min}
			bind:max={weekPicker.up}
			bind:value={weekPicker.low} />
		<WeekPicker
			title="до:"
			bind:min={weekPicker.low}
			bind:max={weekPicker.max}
			bind:value={weekPicker.up} />
		<button
			class="btn btn-light text-dark"
			onclick={async () => {
				let dates: string[] = [];
				for (let w = weekPicker.low; w <= weekPicker.up; w++) {
					dates = [...dates, ...getDatesByWeek(year, w)];
				}
				dataSchedule = {};
				getScheduleByWeek(dates, dataSchedule);
			}}>Получить</button>
	</div>
</Title>

<div class="d-flex flex-column rounded bg-light">
	{#if Object.keys(dataSchedule).length > 0}
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
	{/if}
	{#each Object.entries(dataSchedule) as [date, item], i}
		<div
			class={`${new Date(date).getDay() == 0 ? 'bg-primary text-primary bg-opacity-10' : 'bg-light text-dark'} 
					${i == Object.keys(dataSchedule).length - 1 ? 'rounded-bottom pb-1' : ''}`}
			style="display: grid; grid-template-columns: .15fr 1fr;">
			<div
				class="d-flex flex-column justify-content-start align-items-end py-1 ps-3 pe-2"
				style="min-width: 8em;">
				<b>{Number(date.slice(8, 10))} {monthToStringWithEnd(new Date(date))}</b>
				<i>
					{new Date(date).toLocaleDateString('Ru-ru', {
						weekday: 'long'
					})}
				</i>
			</div>
			<div style="display: grid; grid-template-columns: 1fr .1fr .6fr">
				{#each item as field, j}
					<div class={`py-1 ps-3 pe-2 ${getInputColors(date)}`} style="min-width: 13em;">
						{@html dataSchedule[date][j].event}
					</div>
					<div class={`py-1 text-end ${getInputColors(date)} fw-bold`} style="min-width: 5em;">
						{@html dataSchedule[date][j].time}
					</div>
					<div
						class={`text-wrap py-1 ps-4 ps-2 pe-3 ${getInputColors(date)}`}
						style="min-width: 10em;">
						{@html dataSchedule[date][j].pray}
					</div>
				{/each}
			</div>
		</div>
		{#if i != Object.keys(dataSchedule).length - 1}
			<hr class="my-0 mx-4 p-0 border-secondary border-opacity-50" />
		{/if}
	{/each}
</div>
