import { useState, useEffect } from "react";
import { getSession } from "next-auth/client";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { isServer } from "utils/isServer";
import { useRouter } from "next/router";
import { Heading, Spinner } from "@chakra-ui/core";

export default function Page({ session }) {
  const [profile, setProfile] = useState();
  const router = useRouter();
  const pid = router.query.pid;

  // Fetch profile from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/profile/${pid}`);
      const json = await res.json();
      if (json.data) {
        setProfile(json.data);
      }
    };
    if (pid) {
      fetchData();
    }
  }, [session]);

  // When rendering client side don't display anything until loading is complete
  // if (!isServer && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  // If session exists, display profile
  return (
    <Layout>
      <Heading>
        Fiche de {profile.firstname} {profile.lastname}
      </Heading>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
