import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html className="h-screen" style={{ backgroundColor: '#090c09' }}>
                <Head>
                    <meta
                        name="viewport"
                        content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no"
                    />
                    <meta name="theme-color" content="#090c09" />
                </Head>
                <div
                    className="font-serif"
                    style={{ height: '0', color: 'transparent' }}>
                    eager font load
                </div>
                <div
                    className="font-sans"
                    style={{ height: '0', color: 'transparent' }}>
                    eager font load
                </div>
                <body>
                    <Main />
                    <div id="portal_root" />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
