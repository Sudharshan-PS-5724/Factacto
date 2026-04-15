import './globals.css';

const siteName = 'FACTACTO';
const defaultTitle = 'FACTACTO — Faculty Activity Tracking & Collaboration';
const defaultDescription =
  'Official faculty activity platform for the Department of Information Technology, SSN College of Engineering, Kalavakkam. Submit publications, conferences, projects, and events; dashboards and monthly reports.';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s · ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    'FACTACTO',
    'SSN College of Engineering',
    'faculty activities',
    'IT department',
    'faculty dashboard',
    'research publications',
    'conference',
    'Kalavakkam',
  ],
  authors: [{ name: 'SSNCE IT Department' }],
  creator: 'SSN College of Engineering',
  publisher: 'SSN College of Engineering',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: '/images/ssn.jpeg', type: 'image/jpeg' }],
    apple: '/images/ssn.jpeg',
    shortcut: '/images/ssn.jpeg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: '/',
    images: [
      {
        url: '/images/ssn.jpeg',
        width: 1200,
        height: 630,
        alt: 'SSN College of Engineering — FACTACTO',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/images/ssn.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport = {
  themeColor: '#FDF2F7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
