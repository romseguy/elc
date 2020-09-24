import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { getSession, useSession } from "next-auth/client";
import { isServer } from "utils/isServer";
import { Button, useTheme, useColorMode, Spinner } from "@chakra-ui/core";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { Link } from "components/link";
import { PageTitle } from "components/page-title";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useStore } from "tree";
import { StyledTable as Table } from "components/table";
import { format } from "date-fns";

export default observer((props) => {
  const { colorMode } = useColorMode();
  const theme = useTheme()[colorMode || "light"];
  const [session = props.session, loading] = useSession();

  if (loading && !isServer) return null;
  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const router = useRouter();
  const { profileType } = useStore();

  useEffect(() => {
    const fetchProfiles = async () => {
      await profileType.store.fetch();
    };
    fetchProfiles();
  }, []);

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
          <Button ml={5} border="1px">
            Ajouter
          </Button>
        </Link>
      </PageTitle>
      {!profileType.store.isEmpty && (
        <Table bg={theme.hover.bg}>
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
