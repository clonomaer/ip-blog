// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const defaultConfig = require('tailwindcss/stubs/defaultConfig.stub')

/**@type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
    mode: 'jit',
    important: false,
    purge: [
        './pages/**/*.{js,jsx,ts,tsx,scss,sass,css}',
        './components/**/*.{js,jsx,ts,tsx,scss,sass,css}',
        './styles/**/*.{scss,sass,css}',
    ],
    darkMode: true,
    theme: {
        extend: {
            boxShadow: {
                strong: '0 25px 50px -12px rgb(0 0 0 / 1)',
            },
        },
        /**@type {{[x in import('./types').Screens]: string}} */
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        fontFamily: {
            ...defaultConfig.theme.fontFamily,
            sans: [
                '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                ...defaultConfig.theme.fontFamily.sans,
            ],
            serif: ['Yellowtail', ...defaultConfig.theme.fontFamily.serif],
        },
        fontSize: {
            ...defaultConfig.theme.fontSize,
            //@ts-expect-error custom
            '2xs': '0.5625rem',
        },
        colors: {
            ...defaultConfig.theme.colors,
            primary: '#d400ff',
            'primary-dark': '#530063',
            'primary-darker': '#3c0047',
            'page-bg': '#1b0f24',
        },
        spacing: {
            ...defaultConfig.theme.spacing,
            13: '3.125rem',
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        // eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
        require('tailwindcss-children'),
    ],
}
// eslint-disable-next-line no-undef
module.exports = config
