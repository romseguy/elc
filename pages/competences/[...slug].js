import { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import { useSession } from "utils/useAuth";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import { isServer } from "utils/isServer";
import { Button, Spinner } from "@chakra-ui/react";
import { AccessDenied, Layout, PageTitle, SkillForm } from "components";

export default observer((props) => {
  const [session = props.session] = useSession();
  const router = useRouter();
  const skillSlug = router.query.slug[0];
  const action = router.query.slug[1];
  const { confirmType, skillType } = useStore();
  const withConfirm = (props) => (e) => confirmType.onOpen(props);
  const [selectedSkill, setSkill] = useState();
  useEffect(() => {
    const fetchSkills = async () => {
      await skillType.store.getSkills();

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

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  if (!isServer() && action && action !== "edit") {
    router.push("/competences/[...slug]", `/competences/${skillSlug}`);
    return null;
  }

  if (skillType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  if (skillType.store.isEmpty)
    return <Layout>Aucune compétence n'a été ajoutée à l'application</Layout>;
  if (selectedSkill === null)
    return <Layout>Nous n'avons pas pu trouver cette compétence</Layout>;
  if (!selectedSkill)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  if (action === "edit") {
    return (
      <Layout>
        <PageTitle>{`Modification de la compétence ${selectedSkill.code}`}</PageTitle>
        <SkillForm skill={selectedSkill} />
      </Layout>
    );
  }

  const editAction = () => {
    router.push(
      "/competences/[...slug]",
      `/competences/${selectedSkill.slug}/edit`
    );
  };
  const removeAction = async () => {
    const removedSkill = await selectedSkill.remove();
    router.push("/competences");
  };

  return (
    <Layout>
      <PageTitle>
        {`Compétence ${selectedSkill.code}`}
        <Button variant="outline" mx={5} onClick={editAction}>
          Modifier
        </Button>
        <Button
          variant="outline"
          onClick={withConfirm({
            header: `Êtes vous sûr(e) ?`,
            body: `Veuillez confirmer la suppression de la compétence ${selectedSkill.code} :`,
            onConfirm: removeAction
          })}
        >
          Supprimer
        </Button>
      </PageTitle>
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
