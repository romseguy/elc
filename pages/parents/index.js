import { useEffect } from "react";
import { getSession } from "next-auth/client";
import { useSession } from "utils/useAuth";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import { Button, Spinner } from "@chakra-ui/react";
import {
  AccessDenied,
  Layout,
  Link,
  PageTitle,
  StyledTable as Table
} from "components";

export default observer((props) => {
  const [session = props.session] = useSession();

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
      await parentType.store.getParents();
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
        <Link href="/parents/ajouter">
          <Button variant="outline" ml={5}>
            Ajouter
          </Button>
        </Link>
      </PageTitle>
      {!parentType.store.isEmpty && (
        <Table>
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
      session
    }
  };
}
