import { getSession } from "next-auth/client";
import { useSession } from "utils/useAuth";
// import { DevTool } from "@hookform/devtools";
import { AccessDenied, Layout, PageTitle, ProfileForm } from "components";

// registerLocale("fr", fr);
// setDefaultLocale("fr");

export default function AddProfilePage(props) {
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
        <PageTitle>Ajouter une nouvelle fiche élève</PageTitle>
        <ProfileForm />
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
