import { Layout } from 'nextra-theme-docs'
import Script from 'next/script'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Instrument_Sans, Inter } from 'next/font/google'

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument-sans' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
import '../style.css'
import { SITE_CONFIG } from '../config/site'
import { CustomNavbar } from '../components/CustomNavbar'
import { CustomFooter } from '../components/CustomFooter'

export const metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  openGraph: {
    images: [{ url: `${SITE_CONFIG.siteUrl}/og.jpg` }],
    url: SITE_CONFIG.siteUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@quint_lang',
    images: [`${SITE_CONFIG.siteUrl}/og.jpg`],
  },
}

const navbar = <CustomNavbar />

const footer = <CustomFooter />

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${instrumentSans.variable} ${inter.variable}`}>
      <Head
        color={{
          hue: { dark: 264, light: 264 },
          saturation: { dark: 52, light: 90 },
        }}
      >
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <link rel="icon" href="/icon-light.png" type="image/png" />
        <link rel="icon" href="/icon-dark.png" type="image/png" media="(prefers-color-scheme: dark)" />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/informalsystems/quint/blob/main/docs"
          search={false}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            toggleButton: true,
          }}
        >
          {children}
        </Layout>
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || []
              function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date())
              gtag('config', 'G-HD6HX8DTXE')
            `,
          }}
        />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-HD6HX8DTXE" />
      </body>
      <Script strategy="afterInteractive" src="https://cdn.iubenda.com/iubenda.js" />
    </html>
  )
}
