import { useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import { Button, Spinner } from "@chakra-ui/core";
import {
  AccessDenied,
  Layout,
  Link,
  PageTitle,
  StyledTable as Table,
} from "components";

export default observer((props) => {
  const [session = props.session] = useSession();
  const router = useRouter();
  const { workshopType } = useStore();
  useEffect(() => {
    const fetchWorkshops = async () => {
      await workshopType.store.fetch();
    };
    fetchWorkshops();
  }, []);

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  if (workshopType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  const onRowClick = (workshop) => {
    router.push("/competences/[...slug]", `/competences/${workshop.slug}`);
  };

  return (
    <Layout>
      <PageTitle>
        Liste des compétences et des observables
        <Link href="/competences/add">
          <Button variant="outline" ml={5}>
            Ajouter
          </Button>
        </Link>
      </PageTitle>
      {profileType.store.state === "error" && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>
            Nous n'avons pas pu charger les compétences !
          </AlertTitle>
          <AlertDescription>
            Veuillez patienter ou contacter le développeur à ce propos
          </AlertDescription>
        </Alert>
      )}
      {!workshopType.store.isEmpty && (
        <Table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Matière</th>
              <th>Niveau</th>
            </tr>
          </thead>
          <tbody>
            {values(workshopType.store.workshops).map((workshop) => {
              return (
                <tr
                  key={workshop._id}
                  tabIndex={0}
                  title={`Cliquez pour ouvrir la compétence ${workshop.code}`}
                  onClick={() => onRowClick(workshop)}
                >
                  <td>{workshop.code}</td>
                  <td>{workshop.description}</td>
                  <td>{workshop.domain}</td>
                  <td>{workshop.level}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
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
