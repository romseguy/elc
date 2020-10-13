import { getSession } from "next-auth/client";
import { useSession } from "utils/useAuth";
// import { DevTool } from "@hookform/devtools";
import { AccessDenied, Layout, PageTitle, WorkshopForm } from "components";
import { useEffect } from "react";
import { useStore } from "tree";

// registerLocale("fr", fr);
// setDefaultLocale("fr");

export default function Page(props) {
  const [session = props.session] = useSession();
  const { skillType } = useStore();

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  useEffect(() => {
    const fetchSkills = async () => {
      await skillType.store.getSkills();
    };
    fetchSkills();
  }, []);

  return (
    <>
      <Layout>
        <PageTitle>Ajouter un nouveau atelier</PageTitle>
        <WorkshopForm />
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
