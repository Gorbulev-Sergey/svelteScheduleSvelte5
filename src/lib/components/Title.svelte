<script lang="ts">
	import type { Snippet } from 'svelte';

	interface IProps {
		title?: string;
		children?: Snippet<[]>;
	}
	let { title = '', children }: IProps = $props();
</script>

<div class="d-flex">
	<h4 class="mb-0">{@html title}</h4>
	{@render children?.()}
</div>
