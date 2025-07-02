<script lang="ts">
	import Title from '$lib/components/Title.svelte';

	let year = $state(2025);
	let month = $state(1);
	let daysInMonth = $derived(new Date(Number(year), Number(month), 0).getDate());

	function getWeek(date: Date) {
		let week1 = new Date(date.getFullYear(), 0, 4);
		return (
			1 +
			Math.round(
				((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
			)
		);
	}
</script>

<Title title="Выбор недели" />

<div class="d-flex">
	{#each Array(daysInMonth) as item, i}
		<div class="px-2">
			{getWeek(new Date(`${year}-${month}-${i < 10 ? '0' : ''}${i + 1}`))}
		</div>
	{/each}
</div>
