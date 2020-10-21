import { useEffect } from "react";
import { getSession } from "next-auth/client";
import { useSession } from "utils/useAuth";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import {
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/core";
import {
  AccessDenied,
  Layout,
  Link,
  PageTitle,
  StyledTable as Table
} from "components";

export default observer((props) => {
  const [session = props.session] = useSession();
  const router = useRouter();
  const { observationType } = useStore();
  useEffect(() => {
    const fetchObservations = async () => {
      await observationType.store.getObservations();
    };
    fetchObservations();
  }, []);

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  if (observationType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  const onRowClick = (observation) => {
    router.push("/observations/[...slug]", `/observations/${observation.slug}`);
  };

  return (
    <Layout>
      <PageTitle>
        Liste des observations
        <Link href="/observations/ajouter">
          <Button variant="outline" ml={5}>
            Ajouter
          </Button>
        </Link>
      </PageTitle>
      {observationType.store.state === "error" && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>
            Nous n'avons pas pu charger les observations !
          </AlertTitle>
          <AlertDescription>
            Veuillez patienter ou contacter le développeur à ce propos
          </AlertDescription>
        </Alert>
      )}
      {!observationType.store.isEmpty && (
        <Table>
          <thead>
            <tr>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {values(observationType.store.observations).map((observation) => {
              return (
                <tr
                  key={observation._id}
                  tabIndex={0}
                  title={`Cliquez pour afficher les détails de l'observation`}
                  onClick={() => onRowClick(observation)}
                >
                  <td>{observation.description}</td>
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
      session
    }
  };
}
