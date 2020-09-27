import { getSession, useSession } from "next-auth/client";
// import { DevTool } from "@hookform/devtools";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { isServer } from "utils/isServer";
import { PageTitle } from "components/page-title";
import { SkillForm } from "components/skill-form";

// registerLocale("fr", fr);
// setDefaultLocale("fr");

export default function Page(props) {
  const [session = props.session] = useSession();

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
      session,
    },
  };
}
