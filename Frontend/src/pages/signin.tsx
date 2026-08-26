import Container from '@components/ui/container';
import Layout from '@components/layout/layout';
import Subscription from '@components/common/subscription';
import LoginForm from '@components/auth/login-form';
import PageHeader from '@components/ui/page-header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import { siteSettings } from '@settings/site-settings';
import { absoluteSiteUrl } from '@utils/site-url';

export default function SignInPage() {
  const { t } = useTranslation('common');
  return (
    <>
      <NextSeo
        title={`${t('text-page-signin')} | ${siteSettings.name}`}
        description={siteSettings.description}
        canonical={absoluteSiteUrl('/signin')}
      />
      <PageHeader pageHeader={t('text-page-signin')} />
      <Container>
        <div className="py-16 lg:py-20">
          <LoginForm />
        </div>
        <Subscription />
      </Container>
    </>
  );
}

SignInPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'forms', 'menu', 'footer'])),
    },
  };
};
