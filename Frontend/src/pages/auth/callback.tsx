import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/my-account");
  }, [router]);

  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
