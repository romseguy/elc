import { useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Spinner,
} from "@chakra-ui/core";
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
      await workshopType.store.getWorkshops();
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
    router.push("/ateliers/[...slug]", `/ateliers/${workshop.slug}`);
  };

  return (
    <Layout>
      <PageTitle>
        Liste des ateliers
        <Link href="/ateliers/add">
          <Button variant="outline" ml={5}>
            Ajouter
          </Button>
        </Link>
      </PageTitle>
      {workshopType.store.state === "error" && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>
            Nous n'avons pas pu charger les ateliers !
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
              <th>Nom</th>
              <th>Compétences</th>
            </tr>
          </thead>
          <tbody>
            {values(workshopType.store.workshops).map((workshop) => {
              return (
                <tr
                  key={workshop._id}
                  tabIndex={0}
                  title={`Cliquez pour ouvrir l'atelier ${workshop.code}`}
                  onClick={() => onRowClick(workshop)}
                >
                  <td>{workshop.name}</td>
                  <td>{/* {workshop.domain} */}</td>
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
