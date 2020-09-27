import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { getSession, useSession } from "next-auth/client";
import { isServer } from "utils/isServer";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { useRouter } from "next/router";
import { SkillForm } from "components/skill-form";
import { useEffect, useState } from "react";
import { useStore } from "tree";
import { Button, Spinner } from "@chakra-ui/core";
import { PageTitle } from "components/page-title";

export default observer((props) => {
  const [session = props.session] = useSession();

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const router = useRouter();
  const skillSlug = router.query.slug[0];
  const action = router.query.slug[1];

  if (!isServer && action && action !== "edit") {
    router.push("/competences/[...slug]", `/competences/${skillSlug}`);
    return null;
  }

  const { skillType } = useStore();
  const [skill, setSkill] = useState();

  useEffect(() => {
    const fetchSkills = async () => {
      await skillType.store.fetch();

      let found = false;
      values(skillType.store.skills).forEach((skill) => {
        if (skill.code === skillSlug) {
          found = true;
          setSkill(skill);
        }
      });
      if (!found) setSkill(null);
    };

    fetchSkills();
  }, []);

  if (!skillType.store.isLoading && skillType.store.isEmpty)
    return <Layout>Aucune compétence n'a été ajoutée à l'application</Layout>;
  if (skill === null)
    return <Layout>Nous n'avons pas pu trouver cette compétence</Layout>;

  if (action === "edit") {
    return (
      <Layout>
        {!!skill ? (
          <>
            <PageTitle>{`Modification de la compétence ${skill.code}`}</PageTitle>
            <SkillForm skill={skill} />
          </>
        ) : (
          <Spinner />
        )}
      </Layout>
    );
  } else {
    const editAction = () => {
      router.push("/competences/[...slug]", `/competences/${skill.slug}/edit`);
    };
    const removeAction = async () => {
      const removedSkill = await skill.remove();
      router.push("/competences");
    };

    return (
      <Layout>
        {!!skill ? (
          <>
            <PageTitle>
              {`Compétence ${skill.code}`}
              <Button variant="outline" mx={5} onClick={editAction}>
                Modifier
              </Button>
              <Button variant="outline" onClick={removeAction}>
                Supprimer
              </Button>
            </PageTitle>
          </>
        ) : (
          <Spinner />
        )}
      </Layout>
    );
  }
});

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
