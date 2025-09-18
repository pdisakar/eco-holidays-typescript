import '@/styles/main.scss';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Roboto, Rubik } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { getGlobalData, getOptionsData } from '@/services/network_requests';
import { BASE_URL } from '@/lib/constants';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import { Toaster } from '@/components/ui/toaster';
import { GlobalDataProvider } from '@/context/globalContext';
import type { Metadata } from 'next';
import Script from 'next/script';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--secondary',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--primary',
});

export const metadata: Metadata = {
  generator: process.env.COMPANY_NAME,
  applicationName: process.env.COMPANY_NAME,
  creator: process.env.COMPANY_NAME,
  publisher: process.env.COMPANY_NAME,
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'standard',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Book Guided Tours/blog and Travel Category',
  },
  twitter: {
    card: 'summary_large_image',
    creator: process.env.TWITTER_USER_NAME,
  },
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
  },
  icons: {
    icon: [
      {
        url: `${BASE_URL}favicon-32x32.png`,
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: `${BASE_URL}favicon-16x16.png`,
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: `${BASE_URL}apple-touch-icon.png`,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const [data, optionsData] = await Promise.all([
    getGlobalData(),
    getOptionsData(),
  ]);

  const LocalBusiness = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: process.env.COMPANY_NAME,
    image: process.env.CANONICAL_BASE + 'logo.png',
    '@id': process.env.CANONICAL_BASE,
    url: process.env.CANONICAL_BASE,
    telephone: data.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address,
      addressLocality: 'Kathmandu',
      addressRegion: 'Bagmati',
      postalCode: '44600',
      addressCountry: 'NP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.72081724283795,
      longitude: 85.31023775483172,
    },
    potentialAction: {
      '@type': 'ReviewAction',
      name: 'TripAdvisor',
      target:
        'https://www.tripadvisor.com/Attraction_Review-g293890-d2619800-Reviews-Adventure_Bound-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html',
    },
    openingHoursSpecification: [
      {
        opens: '08:00',
        closes: '18:59',
        dayOfWeek: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        validFrom: '2009-12-23',
        validThrough: '2028-04-02',
        '@type': 'OpeningHoursSpecification',
      },
      {
        opens: '8:00',
        closes: '11:00',
        dayOfWeek: 'Saturday',
        validFrom: '2009-12-23',
        validThrough: '2028-04-02',
        '@type': 'OpeningHoursSpecification',
      },
    ],
    sameAs: [
      data.facebook,
      data.twitter,
      data.instagram,
      data.youtube,
      data.pinterest,
    ],
  };

  const Website = {
    '@context': 'https://schema.org/',
    '@type': 'WebSite',
    name: process.env.COMPANY_NAME,
    url: process.env.CANONICAL_BASE,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.CANONICAL_BASE}serach?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html
      lang="en"
      className="scroll-p-20 scroll-smooth">
      <head>
        <link
          rel="manifest"
          href={`${BASE_URL}manifest.json`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LocalBusiness) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(Website) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${roboto.variable} ${rubik.variable} antialiased`}>
        <GlobalDataProvider
          globalData={data}
          optionsData={optionsData}>
          <div id="wrapper">
            <NextTopLoader
              color="#04A681"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl
              showSpinner={false}
              easing="ease"
              speed={200}
            />
            <Header globalData={data} />
            <main role="main">{children}</main>
            <Footer globalData={data} />
          </div>
          <Toaster
            swipeDirection="up"
            duration={3000}
          />
        </GlobalDataProvider>
      </body>
    </html>
  );
}
