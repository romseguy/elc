import { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import { useSession } from "utils/useAuth";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import { isServer } from "utils/isServer";
import { Button, Spinner } from "@chakra-ui/core";
import {
  AccessDenied,
  Layout,
  PageSubTitle,
  PageTitle,
  Table,
  WorkshopForm
} from "components";

export default observer((props) => {
  const [session = props.session] = useSession();
  const router = useRouter();
  const { workshopType } = useStore();
  useEffect(() => {
    const selectWorkshop = async () => {
      await workshopType.store.getWorkshops();
      workshopType.selectWorkshop(workshopSlug);
    };
    selectWorkshop();
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
    router.push("/ateliers/[...slug]", `/ateliers/${workshopSlug}`);
    return null;
  }

  const selectedWorkshop = workshopType.selectedWorkshop;

  if (workshopType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  if (workshopType.store.isEmpty)
    return <Layout>Aucun atelier n'a été ajouté à l'application</Layout>;
  if (selectedWorkshop === null)
    return <Layout>Nous n'avons pas pu trouver cet atelier</Layout>;
  if (!selectedWorkshop)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  if (action === "edit") {
    return (
      <Layout>
        <PageTitle>{`Modification de l'atelier ${selectedWorkshop.name}`}</PageTitle>
        <WorkshopForm workshop={selectedWorkshop} />
      </Layout>
    );
  }

  const editAction = () => {
    router.push(
      "/ateliers/[...slug]",
      `/ateliers/${selectedWorkshop.slug}/edit`
    );
  };
  const removeAction = async () => {
    const removedWorkshop = await selectedWorkshop.remove();
    router.push("/ateliers");
  };

  return (
    <Layout>
      <PageTitle>
        {`Atelier ${selectedWorkshop.name}`}
        <Button variant="outline" mx={5} onClick={editAction}>
          Modifier
        </Button>
        <Button variant="outline" onClick={removeAction}>
          Supprimer
        </Button>
      </PageTitle>

      <PageSubTitle>
        Compétences acquises une fois l'atelier terminé
      </PageSubTitle>

      <Table
        initialState={{
          sortBy: [
            {
              id: "code",
              desc: true
            }
          ]
        }}
        data={values(selectedWorkshop.skills).map((skill) => {
          return {
            code: skill.code,
            description: skill.description,
            domain: skill.domain && skill.domain.name,
            level: skill.level
          };
        })}
        columns={[
          { Header: "Code", accessor: "code" },
          { Header: "Description", accessor: "description" },
          {
            Header: "Matière",
            accessor: "domain"
          },
          {
            Header: "Niveau",
            accessor: "level"
          }
        ]}
      />
    </Layout>
  );
});

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  };
}
