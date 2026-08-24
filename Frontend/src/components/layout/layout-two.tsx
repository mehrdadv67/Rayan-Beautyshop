import { NextSeo } from 'next-seo';
import HeaderTwo from '@components/layout/header/header-two';
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
			<HeaderTwo />
			<main
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
						{t('text-accept-cookies')}
					</Button>
				}
			/>
		</div>
	);
}
