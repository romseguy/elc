import { getSession, useSession } from "next-auth/client";
// import { DevTool } from "@hookform/devtools";
import { AccessDenied, Layout, PageTitle, ParentForm } from "components";

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
      session,
    },
  };
}
