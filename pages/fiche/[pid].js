import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { isServer } from "utils/isServer";
import { useRouter } from "next/router";
import { Heading, Spinner } from "@chakra-ui/core";
import api from "utils/api";

export default function Page(props) {
  const [session = props.session, loading] = useSession();

  if (loading && !isServer) return null;

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  const [profile, setProfile] = useState();
  const router = useRouter();
  const pid = router.query.pid;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get(`profile/${pid}`);
      if (data) {
        setProfile(data);
      }
    };
    if (pid) {
      fetchData();
    }
  }, [session]);

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
