import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/my-account");
  }, [router]);

  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};
