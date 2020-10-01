import { useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import { format } from "date-fns";
import {
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
  const { profileType } = useStore();
  useEffect(() => {
    const fetchProfiles = async () => {
      await profileType.store.getProfiles();
    };
    fetchProfiles();
  }, []);

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  if (profileType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  const onRowClick = (profile) => {
    router.push("/fiches/[...slug]", `/fiches/${profile.slug}`);
  };

  return (
    <Layout>
      <PageTitle>
        Liste des fiches élèves
        <Link href="/fiches/add">
          <Button variant="outline" ml={5}>
            Ajouter
          </Button>
        </Link>
      </PageTitle>
      {profileType.store.state === "error" && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>
            Nous n'avons pas pu charger les fiches élèves !
          </AlertTitle>
          <AlertDescription>
            Veuillez patienter ou contacter le développeur à ce propos
          </AlertDescription>
        </Alert>
      )}
      {!profileType.store.isEmpty && (
        <Table>
          <thead>
            <tr>
              <th>Prénom </th>
              <th>Nom </th>
              <th>Date de naissance </th>
            </tr>
          </thead>
          <tbody>
            {values(profileType.store.profiles).map((profile) => {
              return (
                <tr
                  key={profile._id}
                  tabIndex={0}
                  title={`Cliquez pour ouvrir la fiche de ${profile.firstname} ${profile.lastname}`}
                  onClick={() => onRowClick(profile)}
                >
                  <td>{profile.firstname}</td>
                  <td>{profile.lastname}</td>
                  <td>{format(profile.birthdate, "dd/MM/yyyy")}</td>
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
