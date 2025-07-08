<script lang="ts">
	import type { Snippet } from 'svelte';

	interface IProps {
		title?: string;
		children?: Snippet<[]>;
	}
	let { title = '', children }: IProps = $props();
</script>

<div class="d-flex align-items-center px-3 mb-2">
	<h4 class="mb-0">{@html title}</h4>
	{@render children?.()}
</div>
