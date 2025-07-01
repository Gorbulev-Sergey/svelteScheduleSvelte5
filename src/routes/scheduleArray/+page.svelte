<script lang="ts">
	import { db } from '$lib/scripts/firebase';
	import { onValue, ref, set } from 'firebase/database';
	import { onMount } from 'svelte';

	interface IField {
		event: string;
		time: string;
		pray: string;
	}

	let dayArray: [number, IField][] = [
		[
			1,
			{
				event: 'Согрешил',
				time: '',
				pray: ''
			}
		],
		[
			2,
			{
				event: 'Надо меняться',
				time: '',
				pray: ''
			}
		]
	];

	let monthArray: [string, [number, IField][]][] = [
		[
			'2025-07-01',
			[
				[
					1,
					{
						event: 'Согрешил',
						time: '',
						pray: ''
					}
				],
				[
					2,
					{
						event: 'Надо меняться',
						time: '',
						pray: ''
					}
				]
			]
		],
		[
			'2025-07-01',
			[
				[
					1,
					{
						event: 'другое событие',
						time: '',
						pray: ''
					}
				]
			]
		]
	];

	let month: { [date: string]: IField[] } = {
		'2025-07-01': [
			{ event: 'первое', time: '', pray: '' },
			{ event: 'второе', time: '', pray: '' },
			{ event: 'третье', time: '', pray: '' }
		],
		'2025-07-02': [
			{ event: 'первое', time: '', pray: '' },
			{ event: 'второе', time: '', pray: '' }
		]
	};
	month['2025-07-03'] = [
		{ event: 'первое', time: '', pray: '' },
		{ event: 'второе', time: '', pray: '' }
	];

	onMount(async () => {
		// onValue(ref(db, '/posts'), (r) => {
		// 	if (r.exists()) {
		// 		console.log(r.val());
		// 		console.log(Object.entries(r.val()));
		// 	}
		// });
		console.log();
	});
</script>

<button
	class="btn btn-dark text-light"
	onclick={async () => {
		let y = '2025';
		let m = '07';
		let d = '05';
		month[`${y}-${m}-${d}`] = [
			{ event: 'первое', time: '', pray: '' },
			{ event: 'второе', time: '', pray: '' }
		];
		set(ref(db, '/schedule/2025/7'), month);
	}}>Сохранить</button>
