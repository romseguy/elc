import { getSession, useSession } from "next-auth/client";
// import { DevTool } from "@hookform/devtools";
import { AccessDenied, Layout, PageTitle, ParentForm } from "components";
import { useEffect } from "react";
import { useStore } from "tree";

// registerLocale("fr", fr);
// setDefaultLocale("fr");

export default function Page(props) {
  const [session = props.session] = useSession();
  const { profileType, parentType, skillType } = useStore();

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      await skillType.store.getSkills();
      await parentType.store.getParents();
      await profileType.store.getProfiles();
    };
    fetchProfiles();
  }, []);

  return (
    <>
      <Layout>
        <PageTitle>Ajouter une nouvelle fiche parent</PageTitle>
        <ParentForm />
      </Layout>
      {/* <DevTool control={control} /> */}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  };
}
