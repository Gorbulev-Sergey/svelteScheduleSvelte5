<script lang="ts">
	import { db } from '$lib/scripts/firebase';
	import { onValue, ref } from 'firebase/database';
	import { onMount } from 'svelte';

	interface IPost {
		title: string;
		description: string;
		cover: string;
		date: string;
	}

	let posts: [string, IPost][] = [
		[
			'2025-07-01',
			{
				title: 'привет',
				description: '',
				cover: '',
				date: ''
			}
		],
		[
			'2025-07-02',
			{
				title: 'dnjhjq',
				description: '',
				cover: '',
				date: ''
			}
		]
	];

	onMount(async () => {
		onValue(ref(db, '/posts'), (r) => {
			if (r.exists()) {
				console.log(r.val());
				console.log(Object.entries(r.val()));
				console.log(posts);
			}
		});
	});
</script>
