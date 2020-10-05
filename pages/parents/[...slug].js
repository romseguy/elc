import { useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import tw, { styled } from "twin.macro";
import { isServer } from "utils/isServer";
import { Button, Spinner, Text } from "@chakra-ui/core";
import {
  AccessDenied,
  Layout,
  PageTitle,
  PageSubTitle,
  ParentForm,
  Link
} from "components";

const ChildrenList = styled.ul`
  ${tw`ml-5`}
  list-style-type: square;
  a {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default observer((props) => {
  const [session = props.session] = useSession();
  const router = useRouter();
  const { parentType, profileType, skillType } = useStore();
  useEffect(() => {
    const selectParent = async () => {
      await skillType.store.getSkills();
      await parentType.store.getParents();
      await profileType.store.getProfiles();
      await parentType.selectParent(parentSlug);
    };

    selectParent();
  }, []);

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const parentSlug = router.query.slug[0];
  const action = router.query.slug[1];

  if (!isServer() && action && action !== "edit") {
    router.push("/parents/[...slug]", `/parents/${parentSlug}`);
    return null;
  }

  const selectedParent = parentType.selectedParent;

  if (profileType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  if (parentType.store.isEmpty) return <Layout>Aucune fiche trouvée</Layout>;
  if (selectedParent === null)
    return (
      <Layout>Nous n'avons pas pu trouver de fiche associée à cet élève</Layout>
    );
  if (!selectedParent)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  if (action === "edit") {
    return (
      <Layout>
        <PageTitle>
          {`Fiche du parent : ${selectedParent.firstname} ${selectedParent.lastname}`}
        </PageTitle>
        <ParentForm parent={selectedParent} />
      </Layout>
    );
  }
  const editLink = `/parents/${selectedParent.slug}/edit`;
  const editAction = () => {
    router.push("/parents/[...slug]", editLink);
  };
  const removeAction = async () => {
    const removedParent = await selectedParent.remove();
    router.push("/parents");
  };

  const onRowClick = (profile) => {
    router.push("/fiches/[...slug]", `/fiches/${profile.slug}`);
  };

  return (
    <Layout>
      <PageTitle>
        {`Fiche du parent : ${selectedParent.firstname} ${selectedParent.lastname}`}
        <Button variant="outline" mx={5} onClick={editAction}>
          Modifier
        </Button>
        <Button variant="outline" onClick={removeAction}>
          Supprimer
        </Button>
      </PageTitle>

      <PageSubTitle>Enfants</PageSubTitle>

      {selectedParent.children.length === 0 ? (
        <Text>
          <Link textDecoration="underline" href={editLink}>
            Modifier la fiche du parent pour associer un ou plusieurs enfants
          </Link>
        </Text>
      ) : (
        <ChildrenList>
          {values(selectedParent.children).map((profile) => (
            <li key={profile._id}>
              <a onClick={() => onRowClick(profile)}>
                {profile.firstname} {profile.lastname}
              </a>
            </li>
          ))}
        </ChildrenList>
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
