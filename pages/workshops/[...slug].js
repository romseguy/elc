import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import { isServer } from "utils/isServer";
import { Button, Spinner } from "@chakra-ui/core";
import { AccessDenied, Layout, PageTitle, WorkshopForm } from "components";

export default observer((props) => {
  const [session = props.session] = useSession();
  const router = useRouter();
  const { workshopType } = useStore();
  const [selectedWorkshop, setWorkshop] = useState();
  useEffect(() => {
    const fetchWorkshops = async () => {
      await workshopType.store.fetch();

      let found = false;
      values(workshopType.store.workshops).forEach((workshop) => {
        if (workshop.code === workshopSlug) {
          found = true;
          setWorkshop(workshop);
        }
      });
      if (!found) setWorkshop(null);
    };

    fetchWorkshops();
  }, []);

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const workshopSlug = router.query.slug[0];
  const action = router.query.slug[1];

  if (!isServer() && action && action !== "edit") {
    router.push("/competences/[...slug]", `/competences/${workshopSlug}`);
    return null;
  }

  if (workshopType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  if (workshopType.store.isEmpty)
    return <Layout>Aucune compétence n'a été ajoutée à l'application</Layout>;
  if (selectedWorkshop === null)
    return <Layout>Nous n'avons pas pu trouver cette compétence</Layout>;
  if (!selectedWorkshop)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  if (action === "edit") {
    return (
      <Layout>
        <PageTitle>{`Modification de la compétence ${selectedWorkshop.code}`}</PageTitle>
        <WorkshopForm workshop={selectedWorkshop} />
      </Layout>
    );
  }

  const editAction = () => {
    router.push(
      "/competences/[...slug]",
      `/competences/${selectedWorkshop.slug}/edit`
    );
  };
  const removeAction = async () => {
    const removedWorkshop = await selectedWorkshop.remove();
    router.push("/competences");
  };

  return (
    <Layout>
      <PageTitle>
        {`Compétence ${selectedWorkshop.code}`}
        <Button variant="outline" mx={5} onClick={editAction}>
          Modifier
        </Button>
        <Button variant="outline" onClick={removeAction}>
          Supprimer
        </Button>
      </PageTitle>
    </Layout>
  );
});

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
