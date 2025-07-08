<script lang="ts">
	interface IProps {
		title: string;
		date: string;
		year: string;
		month: string;
	}
	let {
		title = '',
		date = $bindable(new Date().toISOString().slice(0, 7)),
		year = $bindable(date.slice(0, 4)),
		month = $bindable(date.slice(5, 7))
	}: IProps = $props();
</script>

<div class="d-flex align-items-center pt-1">
	<div class=" p-2 text-nowrap">{title}</div>
	<div class="d-flex align-items-center border border-light rounded">
		<button
			title="предыдущий месяц"
			class="btn btn-light text-dark border-0 rounded-end-0 p-2"
			onclick={() =>
				(date = new Date(Number(year), Number(month) - 1, 1).toISOString().slice(0, 7))}
			>{'<'}</button>
		<input
			class="form-control text-center rounded-0 border-0 p-2 z-1"
			type="month"
			style="width: 9.5em;"
			bind:value={date} />
		<button
			title="текущий месяц"
			class="btn btn-light text-dark border-0 rounded-0 p-2"
			onclick={() => (date = new Date().toISOString().slice(0, 7))}>!</button>
		<button
			title="следующий месяц"
			class="btn btn-light text-dark border-0 rounded-0 p-2 rounded-end justify-content-center"
			onclick={() =>
				(date = new Date(Number(year), Number(month) + 1, 1).toISOString().slice(0, 7))}
			>{'>'}</button>
	</div>
</div>
