const plugin = require('tailwindcss/plugin')

// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const defaultConfig = require('tailwindcss/stubs/defaultConfig.stub')

/**@type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
    mode: 'jit',
    important: false,
    content: [
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
            height: {
                'top-bar': 'theme(spacing.24)',
            },
            minHeight: {
                'main-content': `calc(var(--h-screen) - ${defaultConfig.theme.spacing[24]})`,
            },
            colors: {
                primary: '#4ea832',
                'primary-dark': '#1f4314',
                'primary-darker': '#0f1f09',
                'page-bg': '#090c09',
                'page-text': '#ccc',
                'page-text-hover': '#fff',
            },
            fontFamily: {
                sans: [
                    'source code pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                ],
                serif: ['Yellowtail'],
            },
            fontSize: {
                '2xs': '0.5625rem',
            },
            spacing: {
                13: '3.125rem',
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
    },
    variants: {
        extend: {},
    },
    plugins: [
        // eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
        require('tailwindcss-children'),
        plugin(({ addUtilities, theme }) => {
            addUtilities({
                '.revert-tailwind-preflight': {
                    '& blockquote,& dl,& dd,& h1,& h2,& h3,& h4,& h5,& h6,& hr,& figure,& p,& pre':
                        {
                            margin: 'revert',
                        },
                    '& h1,& h2,& h3,& h4,& h5,& h6': {
                        fontSize: 'revert',
                        fontWeight: 'revert',
                    },
                    '& ol,& ul': {
                        listStyle: 'revert',
                        margin: 'revert',
                        padding: 'revert',
                    },
                    '& img,& svg,& video,& canvas,& audio,& iframe,& embed,& object':
                        {
                            display: 'revert',
                            verticalAlign: 'revert',
                        },
                    '& *,& ::before,& ::after': {
                        borderWidth: 'revert',
                        borderStyle: 'revert',
                        borderColor: 'revert',
                    },
                    '& .google-map *': {
                        borderStyle: 'revert',
                    },
                    '& button:focus': {
                        outline: 'revert',
                    },
                },
            })
        }),
    ],
}
// eslint-disable-next-line no-undef
module.exports = config
