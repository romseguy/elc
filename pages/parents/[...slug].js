import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { getSession, useSession } from "next-auth/client";
import { isServer } from "utils/isServer";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { useRouter } from "next/router";
import { ParentForm } from "components/parent-form";
import { useEffect, useState } from "react";
import { getSnapshot, useStore } from "tree";
import { Button, Spinner, useColorMode, useTheme } from "@chakra-ui/core";
import { PageSubTitle, PageTitle } from "components/page-title";
import tw, { styled } from "twin.macro";

const ChildrenList = styled.ul`
  ${tw`ml-5`}
  list-style-type: square;
  a {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default observer((props) => {
  const { colorMode } = useColorMode();
  const theme = useTheme()[colorMode || "dark"];
  const [session = props.session, loading] = useSession();

  if (loading && !isServer) return null;
  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const router = useRouter();
  const parentSlug = router.query.slug[0];
  const action = router.query.slug[1];

  if (!isServer && action && action !== "edit") {
    router.push("/parents/[...slug]", `/parents/${parentSlug}`);
    return null;
  }

  const { parentType, profileType } = useStore();

  useEffect(() => {
    const selectParent = async () => {
      await profileType.store.fetch();
      await parentType.selectParent(parentSlug);
    };

    selectParent();
  }, []);

  const selectedParent = parentType.selectedParent;

  if (!parentType.store.isLoading) {
    if (parentType.store.isEmpty) return <Layout>Aucune fiche trouvée</Layout>;

    if (selectedParent === null)
      return (
        <Layout>
          Nous n'avons pas pu trouver de fiche associée à cet élève
        </Layout>
      );
  }

  if (action === "edit") {
    return (
      <Layout>
        {!!selectedParent ? (
          <>
            <PageTitle>
              {`Modification de la fiche parent de ${selectedParent.firstname} ${selectedParent.lastname}`}
            </PageTitle>
            <ParentForm parent={selectedParent} />
          </>
        ) : (
          <Spinner />
        )}
      </Layout>
    );
  } else {
    const editAction = () => {
      router.push("/parents/[...slug]", `/parents/${selectedParent.slug}/edit`);
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
        {!!selectedParent ? (
          <>
            <PageTitle>
              {`Fiche du parent : ${selectedParent.firstname} ${selectedParent.lastname}`}
              <Button mx={5} border="1px" onClick={editAction}>
                Modifier
              </Button>
              <Button border="1px" onClick={removeAction}>
                Supprimer
              </Button>
            </PageTitle>

            <PageSubTitle>Enfants</PageSubTitle>

            <ChildrenList>
              {values(selectedParent.children).map((profile) => (
                <li key={profile._id}>
                  <a onClick={() => onRowClick(profile)}>
                    {profile.firstname} {profile.lastname}
                  </a>
                </li>
              ))}
            </ChildrenList>
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
