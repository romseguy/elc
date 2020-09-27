import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { getSession, useSession } from "next-auth/client";
import { isServer } from "utils/isServer";
import { Button, Spinner } from "@chakra-ui/core";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { Link } from "components/link";
import { PageTitle } from "components/page-title";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useStore } from "tree";
import { StyledTable as Table } from "components/table";

export default observer((props) => {
  const [session = props.session] = useSession();

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const router = useRouter();
  const { skillType } = useStore();

  useEffect(() => {
    const fetchSkills = async () => {
      await skillType.store.fetch();
    };
    fetchSkills();
  }, []);

  if (skillType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  const onRowClick = (skill) => {
    router.push("/competences/[...slug]", `/competences/${skill.slug}`);
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
      {!skillType.store.isEmpty && (
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
            {values(skillType.store.skills).map((skill) => {
              return (
                <tr
                  key={skill._id}
                  tabIndex={0}
                  title={`Cliquez pour ouvrir la compétence ${skill.code}`}
                  onClick={() => onRowClick(skill)}
                >
                  <td>{skill.code}</td>
                  <td>{skill.description}</td>
                  <td>{skill.domain}</td>
                  <td>{skill.level}</td>
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
