// import {
// 	House,
// 	Wallet,
// 	BadgeInfo,
// 	Cog,
// 	CircleUser,
// 	Gauge,
// 	Info,
// 	MessageCircleWarning
// } from '@lucide/svelte';

export const links = [
	{
		id: 1,
		title: 'home',
		link: '/'
	},
	{
		id: 2,
		title: 'wallet',
		link: '/wallet',
		comingSoon: true
	},
	{
		id: 3,
		title: 'my account',
		link: '/my-account'
	},
	{
		id: 4,
		title: 'website review',
		link: '/website-review'
	},
	// {
	// 	id: 4,
	// 	title: 'setting',
	// 	link: '/setting'
	// },
	{
		id: 5,
		title: 'about us',
		link: '/about-us'
	},
	{
		id: 6,
		title: 'help',
		link: '/help'
	}
];

export const getLinkIcon = (title: string) => {
	switch (title) {
		case 'home':
			return '🏠';
		case 'speed test':
			return '🚀';
		case 'my account':
			return '👤';
		case 'website review':
			return '💬';
		case 'setting':
			return '⚙️';
		case 'wallet':
			return '🗂️';
		case 'help':
			return '❓';
		case 'about us':
			return 'ℹ️';
		default:
			return '❔'; // Default icon for unknown titles
	}
};
