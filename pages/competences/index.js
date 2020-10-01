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
  const { skillType } = useStore();
  useEffect(() => {
    const fetchSkills = async () => {
      await skillType.store.getSkills();
    };
    fetchSkills();
  }, []);

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

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
      {skillType.store.state === "error" && (
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
