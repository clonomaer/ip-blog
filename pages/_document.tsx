import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html style={{ backgroundColor: 'hsl(120,40%,5%)' }}>
                <Head>
                    <meta name="theme-color" content="#0e1f2f" />
                    <meta
                        name="darkreader"
                        content="ee8a9ee6-93a6-427a-87dc-5936040ec8a6"
                    />
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
