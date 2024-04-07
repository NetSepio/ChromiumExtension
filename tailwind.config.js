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
			},
			colors: {
				action: '#11D9C5',
				appPink: '#FF85C2',
				appPurple: '#37406D',
				sec: '#7247FF',
				appGray: '#788AA3',
				appAsh: '#98A8BE',
				appTransparent: '#788AA3',
				secondary: '#263238',
				dark: '#171C2F'
			}
		}
	},
	plugins: [require('daisyui')]
};
