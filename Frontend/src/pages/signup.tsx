import Container from '@components/ui/container';
import Layout from '@components/layout/layout';
import SignUpForm from '@components/auth/sign-up-form';
import PageHeader from '@components/ui/page-header';
import Subscription from '@components/common/subscription';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import { siteSettings } from '@settings/site-settings';
import { absoluteSiteUrl } from '@utils/site-url';

export default function SignUpPage() {
  const { t } = useTranslation('common');
  return (
    <>
      <NextSeo
        title={`${t('text-page-signup')} | ${siteSettings.name}`}
        description={siteSettings.description}
        canonical={absoluteSiteUrl('/signup')}
      />
      <PageHeader pageHeader={t('text-page-signup')} />
      <Container>
        <div className="py-16 lg:py-20">
          <SignUpForm />
        </div>
        <Subscription />
      </Container>
    </>
  );
}

SignUpPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'forms', 'menu', 'footer'])),
    },
  };
};
