<script>
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Review from '$lib/components/Review.svelte';
	import SubmitReview from '$lib/components/SubmitReview.svelte';

	export const data = {
		labels: ['Genuine', 'Scam', 'Stereotype', 'Hate', 'Fake'],
		datasets: [
			{
				label: '# of Votes',
				data: [12, 19, 3, 5, 3],
				backgroundColor: [
					'rgb(52,61,70)',
					'rgb(79,91,102)',
					'rgb(101,115,126)',
					'rgb(167,173,186)',
					'rgb(192,197,206)'
				],
				borderColor: [
					'rgb(52,61,70)',
					'rgb(79,91,102)',
					'rgb(101,115,126)',
					'rgb(167,173,186)',
					'rgb(192,197,206)'
				],
				borderWidth: 1
			}
		]
	};
	let chart;
	onMount(async () => {
		const Chart = await import('chart.js');
		Chart.defaults.global.defaultFontColor = 'white';
		Chart.defaults.global.defaultFontFamily = 'Montserrat';
		chart = new Chart(document.getElementById('myChart'), {
			type: 'doughnut',
			data: data,
			options: {
				legend: {
					labels: {
						fontColor: 'white',
						fontSize: 14
					}
				},
				title: {
					display: true,
					text: 'Sounds Genuine'
				},
				tooltips: {
					callbacks: {
						label: function (tooltipItem, data) {
							var dataset = data.datasets[tooltipItem.datasetIndex];
							var meta = dataset._meta[Object.keys(dataset._meta)[0]];
							var total = meta.total;
							var currentValue = dataset.data[tooltipItem.index];
							var percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
							return currentValue + ' (' + percentage + '%)';
						},
						title: function (tooltipItem, data) {
							return data.labels[tooltipItem[0].index];
						}
					}
				}
			}
		});
	});
</script>

<div class="artboard phone-3 p-5 mb-5 pb-5">
	<Header />
	<br />

	<div class="flex">
		<div class="flex-1 w-72">
			<div class="justify-center">
				<div class="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto content-around">
					<h1 class="font-bold text-black text-lg">http://localhost:8080</h1>
				</div>
			</div>
		</div>
		<div class="flex-none">
			<div class="flex justify-center">
				<div class="block rounded-lg shadow-lg bg-zinc-700 p-5 w-auto h-auto content-around">
					<div class="rounded-full shadow-lg w-6 h-auto">
						<p class="font-bold text-white text-lg">0/5</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<br />
	<div class="justify-center">
		<div class="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto">
			<h1 class="font-bold text-black text-3xl text-center">Sounds Genuine</h1>
		</div>
	</div>
	<br />

	<div class="shadow-lg rounded-lg overflow-hidden">
		<div class="py-3 px-5 bg-gray-50 text-lg font-bold text-center">Chart</div>
		<Doughnut {data} />
	</div>

	<div class="w-auto bg-base-100 shadow-xl rounded-lg">
		<div class="card-body">
			<h2 class="py-3 px-5 bg-gray-50 text-lg font-bold text-center">What people say</h2>
			<br />
			<div class="flex">
				<div class="flex-none w-28 h-14 font-semibold">Genuine</div>
				<div class="flex-initial w-auto ...">
					<progress class="progress w-40" value="10" max="100" />
				</div>
			</div>

			<div class="flex">
				<div class="flex-none w-28 h-14 font-semibold">Scam</div>
				<div class="flex-initial w-auto ...">
					<progress class="progress w-40" value="30" max="100" />
				</div>
			</div>

			<div class="flex">
				<div class="flex-none w-28 h-14 font-semibold">Stereotype</div>
				<div class="flex-initial w-auto ...">
					<progress class="progress w-40" value="40" max="100" />
				</div>
			</div>

			<div class="flex">
				<div class="flex-none w-28 h-14 font-semibold">Hate</div>
				<div class="flex-initial w-auto ...">
					<progress class="progress w-40" value="60" max="100" />
				</div>
			</div>

			<div class="flex">
				<div class="flex-none w-28 h-14 font-semibold">Fake</div>
				<div class="flex-initial w-auto ...">
					<progress class="progress w-40" value="80" max="100" />
				</div>
			</div>

			<div class="card-actions justify-center">
				<Review />
				<SubmitReview />
			</div>
		</div>
	</div>
	<br />
	<br />
</div>
