import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import axios from 'axios';

// Utility function to merge class values
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Type for FlyAndScale transition parameters
type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

// FlyAndScale transition function
export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	// Get the computed style of the node
	const style = getComputedStyle(node);
	// Extract the transform property from the style
	const transform = style.transform === 'none' ? '' : style.transform;

	// Helper function to convert values between two scales
	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	// Helper function to convert a style object to a string
	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	// Return the transition configuration
	return {
		// Duration of the transition (default: 200ms)
		duration: params.duration ?? 200,
		// Delay before the transition starts (default: 0ms)
		delay: 0,
		// CSS function to apply styles at each point in the transition
		css: (t) => {
			// Convert time parameter to achieve desired values for y, x, and scale
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			// Generate the transform and opacity styles
			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		// Easing function for the transition (default: cubicOut)
		easing: cubicOut
	};
};

// Remove IPFS prefix

export const removePrefix = (uri: string) => {
	return uri.substring(7, uri.length);
};

export async function fetchMetadataFromIPFS(ipfsUrl: string, id: string): Promise<any> {
	try {
		const response = await axios.get(ipfsUrl);
		const data = {
			...response.data,
			ipfsUrl: ipfsUrl,
			id: id
		};
		return data;
	} catch (error) {
		return null;
	}
}

export function formatTransactionAmount(transaction: any) {
	const amount = transaction.amount / 10 ** transaction.decimal;

	let formattedAmount;
	// Add commas for non-decimal numbers
	const absoluteAmount = Math.abs(amount);
	const integerPart = Math.floor(absoluteAmount)
		.toString()
		.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	const decimalPart =
		absoluteAmount.toString().length > 5
			? absoluteAmount.toFixed(5).split('.')[1]
			: absoluteAmount.toString().split('.')[1]; // Get only 2 decimal places

	formattedAmount =
		(!transaction.activity_type.includes('Deposit') ? '-' : '+') +
		integerPart +
		(!decimalPart ? '' : `.${decimalPart}`);

	return formattedAmount.substring(0, 8) + ' ' + transaction.symbol;
}

export function formatDate(dateString: any) {
	const date = new Date(dateString);

	// Format date components
	const day = date.getDate();
	const month = date.getMonth() + 1; // Months are zero-based
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const ampm = hours >= 12 ? 'PM' : 'AM';

	// Pad single digit values with leading zero
	const formattedDay = day < 10 ? '0' + day : day;
	const formattedMonth = month < 10 ? '0' + month : month;
	const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
	const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
	const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

	// Construct formatted date string
	const formattedDate = `${formattedMonth}/${formattedDay}/${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;

	return formattedDate;
}

// Store data with a timestamp
export function setData(key: string, value: string, expirationMinutes: number) {
	const now = new Date();
	const item = {
		value: value,
		expiration: now.getTime() + expirationMinutes * 60 * 1000 // Convert minutes to milliseconds
	};
	localStorage.setItem(key, JSON.stringify(item));
}

// Retrieve data and check if it's expired
export function getData(key: string) {
	const itemStr = localStorage.getItem(key);
	if (!itemStr) return null;

	const item = JSON.parse(itemStr);
	const now = new Date().getTime();
	if (now > item.expiration) {
		// Data has expired, remove it
		localStorage.removeItem(key);
		return null;
	}

	return item.value;
}

export function checkChainType(chain: string) {
	const eth = ['ethereum', 'base', 'manta', 'optimism', 'polygon', 'peaq'];

	const apt = ['aptos'];
	const sol = ['solana'];

	if (eth.includes(chain)) {
		return 'evm';
	} else if (apt.includes(chain)) {
		return 'apt';
	} else if (sol.includes(chain)) {
		return 'sol';
	}
}
