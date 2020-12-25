import { getSession } from "next-auth/client";
import { useSession } from "utils/useAuth";
// import { DevTool } from "@hookform/devtools";
import { AccessDenied, Layout, PageTitle, ParentForm } from "components";
import { useEffect } from "react";
import { useStore } from "tree";

// registerLocale("fr", fr);
// setDefaultLocale("fr");

export default function Page(props) {
  const [session = props.session] = useSession();
  const { parentType } = useStore();

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  useEffect(() => {
    const fetchParents = async () => {
      await parentType.store.getParents();
    };
    fetchParents();
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
