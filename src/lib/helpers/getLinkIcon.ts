import {
	House,
	Wallet,
	BadgeInfo,
	Cog,
	CircleUser,
	Gauge,
	Info,
	MessageCircleWarning
} from '@lucide/svelte';

export const links = [
	{
		id: 1,
		title: 'home',
		link: '/',
		icon: House,
		description: 'Dashboard & Overview'
	},
	{
		id: 2,
		title: 'wallet',
		link: '/wallet',
		icon: Wallet,
		description: 'Manage your crypto assets'
	},
	{
		id: 3,
		title: 'speed test',
		link: '/speed-test',
		icon: Gauge,
		description: 'Test VPN connection speed'
	},
	{
		id: 4,
		title: 'my account',
		link: '/my-account',
		icon: CircleUser,
		description: 'Account settings & profile'
	},
	{
		id: 5,
		title: 'website review',
		link: '/website-review',
		icon: MessageCircleWarning,
		description: 'Submit website reviews'
	},
	{
		id: 6,
		title: 'about us',
		link: '/about-us',
		icon: BadgeInfo,
		description: 'Learn about Netsepio'
	},
	{
		id: 7,
		title: 'help',
		link: '/help',
		icon: Info,
		description: 'Support & documentation'
	}
];

export const getLinkIcon = (title: string) => {
	switch (title) {
		case 'home':
			return House;
		case 'speed test':
			return Gauge;
		case 'my account':
			return CircleUser;
		case 'website review':
			return MessageCircleWarning;
		case 'setting':
			return Cog;
		case 'wallet':
			return Wallet;
		case 'help':
			return Info;
		case 'about us':
			return BadgeInfo;
		default:
			return Info; // Default icon for unknown titles
	}
};
