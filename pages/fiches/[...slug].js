import { getSession, useSession } from "next-auth/client";
import { isServer } from "utils/isServer";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { useRouter } from "next/router";
import { ProfileForm } from "components/profile-form";
import { useEffect, useState } from "react";
import { useStore } from "tree";
import { Button, Spinner } from "@chakra-ui/core";
import { PageTitle } from "components/page-title";

export default function Page(props) {
  const [session = props.session, loading] = useSession();

  if (loading && !isServer) return null;
  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const router = useRouter();
  const profileSlug = router.query.slug[0];
  const action = router.query.slug[1];

  if (!isServer && action && action !== "edit") {
    router.push("/fiches/[...slug]", `/fiches/${profileSlug}`);
    return null;
  }

  const {
    profile: {
      store: { fetch, isLoading, isEmpty },
    },
  } = useStore();
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = await fetch();

      if (!profiles) router.push("/fiches");
      else {
        let found = false;
        Object.keys(profiles).forEach((_id) => {
          if (profiles[_id].slug === profileSlug) {
            found = true;
            setProfile(profiles[_id]);
          }
        });
        if (!found) setProfile(null);
      }
    };
    fetchProfiles();
  }, []);

  if (isLoading || profile === undefined)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  if (isEmpty) return <Layout>Aucune fiche trouvée</Layout>;
  if (profile === null)
    return (
      <Layout>Nous n'avons pas pu trouver de fiche associée à cet élève</Layout>
    );

  if (action === "edit") {
    return (
      <Layout>
        <ProfileForm profile={profile} />
      </Layout>
    );
  }

  const editAction = () => {
    router.push("/fiches/[...slug]", `/fiches/${profile.slug}/edit`);
  };
  const removeAction = async () => {
    const removedProfile = await profile.remove();
    router.push("/fiches");
  };

  return (
    <Layout>
      <PageTitle>
        {`Fiche de ${profile.firstname} ${profile.lastname}`}
      </PageTitle>
      <Button my={5} border="1px" onClick={editAction}>
        Modifier
      </Button>
      <Button my={5} border="1px" onClick={removeAction}>
        Supprimer
      </Button>
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
