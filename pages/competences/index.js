import { getSession, useSession } from "next-auth/client";
import { isServer } from "utils/isServer";
import { Button, useTheme, useColorMode, Spinner } from "@chakra-ui/core";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { Link } from "components/link";
import { PageTitle } from "components/page-title";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "tree";
import { StyledTable as Table } from "components/table";

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
    skill: {
      store: { fetch, isLoading, isEmpty },
    },
  } = useStore();
  const [skills = {}, setskills] = useState();

  useEffect(() => {
    const fetchskills = async () => {
      setskills(await fetch());
    };
    fetchskills();
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
        Les compétences pouvant être acquises par les élèves
        <Link href="/competences/add">
          <Button ml={5} border="1px">
            Ajouter
          </Button>
        </Link>
      </PageTitle>
      {!isEmpty && (
        <Table bg={theme[colorMode].hover.bg}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(skills).map((_id) => {
              const skill = skills[_id];
              return (
                <tr
                  key={_id}
                  tabIndex={0}
                  title={`Cliquez pour ouvrir la compétence ${skill.code}`}
                  onClick={() =>
                    router.push(
                      "/competences/[...slug]",
                      `/competences/${skill.slug}`
                    )
                  }
                >
                  <td>{skill.code}</td>
                  <td>{skill.description}</td>
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
