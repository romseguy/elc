import { getSession } from "next-auth/client";
import { useSession } from "utils/useAuth";
import { useEffect } from "react";
import { useStore } from "tree";
// import { DevTool } from "@hookform/devtools";
import { AccessDenied, Layout, PageTitle, SkillForm } from "components";

// registerLocale("fr", fr);
// setDefaultLocale("fr");

export default function Page(props) {
  const [session = props.session] = useSession();
  const { skillType } = useStore();
  useEffect(() => {
    const fetchDomains = async () => {
      await skillType.domainType.store.getDomains();
    };
    fetchDomains();
  });

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <PageTitle>Ajouter une nouvelle compétence</PageTitle>
        <SkillForm />
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
