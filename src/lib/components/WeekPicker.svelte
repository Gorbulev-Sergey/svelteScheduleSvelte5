<script lang="ts">
	interface IProps {
		title: string;
		min: number;
		max: number;
		value: number;
	}
	let {
		title = '',
		min = $bindable(0),
		max = $bindable(50),
		value = $bindable(10)
	}: IProps = $props();
</script>

<div class=" d-inline-flex">
	<div class="p-2">{title}</div>
	<div class="d-flex rounded border border-light">
		<button
			class="btn btn-light rounded-end-0 px-2"
			onclick={() => {
				value > min ? value-- : value;
			}}>{'<'}</button>
		<input
			class="form-control rounded-0 border-0 text-center p-1 m-1 no-buttons"
			style="width: 2em;"
			type="number"
			bind:value />
		<button
			class="btn btn-light rounded-start-0 px-2"
			onclick={() => {
				value < max ? value++ : value;
			}}>{'>'}</button>
	</div>
</div>

<style>
	.no-buttons::-webkit-inner-spin-button,
	.no-buttons::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.no-buttons {
		-moz-appearance: textfield;
	}
</style>
