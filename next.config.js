/** @type {import('next').NextConfig} */
module.exports = {
    experimental: {},
    future: {},
    reactStrictMode: true,
    target: 'serverless',
    async rewrites() {
        return [
            {
                source: '/:any*',
                destination: '/',
            },
        ]
    },
    // i18n: {
    //     locales: ['fa'],
    //     defaultLocale: 'fa',
    // },
    images: {
        domains: [],
    },
}
