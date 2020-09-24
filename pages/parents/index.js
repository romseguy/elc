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
  const { parentType } = useStore();

  useEffect(() => {
    const fetchParents = async () => {
      await parentType.store.fetch();
    };
    fetchParents();
  }, []);

  if (parentType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  const onRowClick = (parent) => {
    router.push("/parents/[...slug]", `/parents/${parent.slug}`);
  };

  return (
    <Layout>
      <PageTitle>
        Liste des parents
        <Link href="/parents/add">
          <Button ml={5} border="1px">
            Ajouter
          </Button>
        </Link>
      </PageTitle>
      {!parentType.store.isEmpty && (
        <Table bg={theme.hover.bg}>
          <thead>
            <tr>
              <th>Prénom </th>
              <th>Nom </th>
              <th>Email </th>
            </tr>
          </thead>
          <tbody>
            {values(parentType.store.parents).map((parent) => {
              return (
                <tr
                  key={parent._id}
                  tabIndex={0}
                  title={`Cliquez pour ouvrir la fiche de ${parent.firstname} ${parent.lastname}`}
                  onClick={() => onRowClick(parent)}
                >
                  <td>{parent.firstname}</td>
                  <td>{parent.lastname}</td>
                  <td>{parent.email}</td>
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
