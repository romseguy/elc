import { useEffect } from "react";
import { getSession } from "next-auth/client";
import { useSession } from "utils/useAuth";
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

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const router = useRouter();
  const parentSlug = router.query.slug[0];
  const action = router.query.slug[1];

  if (!isServer() && action && action !== "edit") {
    router.push("/parents/[...slug]", `/parents/${parentSlug}`);
    return null;
  }

  const { confirm, parentType } = useStore();
  const withConfirm = (props) => (e) => confirm.onOpen(props);

  useEffect(() => {
    const selectParent = async () => {
      await parentType.store.getParents();
      parentType.selectParent(parentSlug);
    };
    selectParent();
  }, []);

  const selectedParent = parentType.selectedParent;

  if (parentType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  if (parentType.store.isEmpty)
    return <Layout>Aucune fiche parent n'a été ajoutée à l'application</Layout>;
  if (selectedParent === null)
    return (
      <Layout>Nous n'avons pas pu trouver de fiche associée à ce parent</Layout>
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
        <Button
          variant="outline"
          onClick={withConfirm({
            header: `Êtes vous sûr(e) ?`,
            body: `Veuillez confirmer la suppression de la fiche parent ${selectedParent.firstname} ${selectedParent.lastname} :`,
            onConfirm: removeAction
          })}
        >
          Supprimer
        </Button>
      </PageTitle>

      <PageSubTitle>Enfants</PageSubTitle>

      {!selectedParent.children || !selectedParent.children.length ? (
        <Text>
          <Link textDecoration="underline" href={editLink}>
            Modifier la fiche du parent pour associer un ou plusieurs enfants
          </Link>
        </Text>
      ) : (
        <ChildrenList>
          {values(selectedParent.children).map((profile) => (
            <li key={profile._id}>
              <a
                title={`Cliquez pour ouvrir la fiche de ${profile.firstname} ${profile.lastname}`}
                onClick={() => onRowClick(profile)}
              >
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
