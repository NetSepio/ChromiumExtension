/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				inter: ['Inter']
			},
			boxShadow: {
				dark: '0px 3px 10px 0px rgba(0,0,0,0.25)',
				light: ' 0px 3px 10px 0px #11D9C56b)'
			}
		}
	},
	plugins: [require('daisyui')]
};
