<script lang="ts">
	import Title from '$lib/components/Title.svelte';

	let date = $state(new Date().toISOString().slice(0, 7));
	let year = $derived(date.slice(0, 4));
	let month = $derived(date.slice(5, 7));
</script>

<Title
	title={`Редактировать расписание на <b>${new Date(date).toLocaleString('Ru-ru', { month: 'long' })} ${year} года </b>`}
>
	<div class="flex-grow-1 d-flex justify-content-end">
		<div class="d-flex align-items-center w-25">
			<div class="bg-light text-dark px-3 py-2 rounded-start text-nowrap">выбор даты:</div>
			<input class="form-control rounded-start-0" type="month" bind:value={date} />
		</div>
	</div>
</Title>
