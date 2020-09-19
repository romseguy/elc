import { getSession, useSession } from "next-auth/client";
import { isServer } from "utils/isServer";
import { Button, Box, useTheme, useColorMode, Spinner } from "@chakra-ui/core";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { Link } from "components/link";
import { PageTitle } from "components/page-title";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "tree";
import { StyledTable as Table } from "components/table";
import { format } from "date-fns";

export default function Page(props) {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const [session = props.session, loading] = useSession();

  if (loading && !isServer) return null;
  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const router = useRouter();
  const {
    profile: {
      store: { fetch, isLoading, isEmpty },
    },
  } = useStore();
  const [profiles = {}, setProfiles] = useState();

  useEffect(() => {
    const fetchProfiles = async () => {
      setProfiles(await fetch());
    };
    fetchProfiles();
  }, []);

  if (isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  return (
    <Layout>
      <PageTitle>
        Les fiches des élèves
        <Link href="/fiches/add">
          <Button ml={5} border="1px">
            Ajouter
          </Button>
        </Link>
      </PageTitle>
      {!isEmpty && (
        <Table bg={theme[colorMode].hover.bg}>
          <thead>
            <tr>
              <th>Prénom </th>
              <th>Nom </th>
              <th>Date de naissance </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(profiles).map((_id) => {
              const profile = profiles[_id];
              return (
                <tr
                  key={_id}
                  tabIndex={0}
                  title={`Cliquez pour ouvrir la fiche de ${profile.firstname} ${profile.lastname}`}
                  onClick={() =>
                    router.push("/fiches/[...slug]", `/fiches/${profile.slug}`)
                  }
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
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
