import { NextSeo } from 'next-seo';
import Header from '@components/layout/header/header';
import Footer from '@components/layout/footer/footer';
import MobileNavigation from '@components/layout/mobile-navigation/mobile-navigation';
import Search from '@components/common/search';
import CookieBar from '@components/common/cookie-bar';
import { useAcceptCookies } from '@utils/use-accept-cookies';
import Button from '@components/ui/button';
import { useTranslation } from 'next-i18next';
import { siteSettings } from '@settings/site-settings';
import { absoluteSiteUrl } from '@utils/site-url';

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  	const { acceptedCookies, onAcceptCookies } = useAcceptCookies();
  	const { t } = useTranslation('common');
  	const baseUrl = absoluteSiteUrl('/');
  	return (
  		<div className="flex flex-col min-h-screen">
  			<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-heading focus:text-white focus:rounded">
  				{t('text-skip-to-content', 'Skip to main content')}
  			</a>
  			<NextSeo
				additionalMetaTags={[
					{
						name: 'viewport',
						content: 'width=device-width, initial-scale=1.0',
					},
				]}
				title={siteSettings.name}
				description={siteSettings.description}
				canonical={baseUrl}
				openGraph={{
					url: baseUrl,
					title: siteSettings.name,
					description: siteSettings.description,
					images: [
						{
							url: '/assets/images/og-image-01.png',
							width: 800,
							height: 600,
							alt: siteSettings.name,
						},
					],
				}}
			/>
			<Header />
  			<main
  				id="main-content"
  				className="relative flex-grow"
  				style={{
  					minHeight: '-webkit-fill-available',
  					WebkitOverflowScrolling: 'touch',
  				}}
  			>
				{children}
			</main>
			<Footer />
			<MobileNavigation />
			<Search />
			<CookieBar
				title={t('text-cookies-title')}
				hide={acceptedCookies}
				action={
					<Button onClick={() => onAcceptCookies()} variant="slim">
						{/* @ts-ignore */}
						{t('text-accept-cookies')}
					</Button>
				}
			/>
		</div>
	);
}
