<script lang="ts">
	import 'bootstrap/dist/css/bootstrap.min.css';

	let { children } = $props();
</script>

<div class="sticky-top">
	<div class="d-flex bg-light text-dark px-3 py-2">
		<a class="btn btn-light text-dark" href="/"><b>Календарь</b></a>
		<div class=" flex-grow-1 d-flex flex-wrap justify-content-end gap-1">
			<a class="btn btn-light text-dark" href="/"><b>Главная</b></a>
			<a class="btn btn-light text-dark" href="/admin"><b>Редактировать</b></a>
			<a class="btn btn-light text-dark" href="/posts"><b>Преобразуем массив постов</b></a>
			<a class="btn btn-light text-dark" href="/scheduleArray"
				><b>Преобразуем массив календаря</b></a>
		</div>
	</div>
</div>
<div class="container my-4">
	{@render children?.()}
</div>
