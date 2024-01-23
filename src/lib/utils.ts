import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

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
