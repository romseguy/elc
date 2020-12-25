import { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import { useSession } from "utils/useAuth";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import { isServer } from "utils/isServer";
import { Button, Spinner } from "@chakra-ui/react";
import { AccessDenied, Layout, PageTitle, ObservationForm } from "components";

export default observer((props) => {
  const [session = props.session] = useSession();
  const router = useRouter();
  const observationSlug = router.query.slug[0];
  const action = router.query.slug[1];
  const { confirmType, observationType } = useStore();
  const withConfirm = (props) => (e) => confirmType.onOpen(props);
  const [selectedObservation, setObservation] = useState();

  useEffect(() => {
    const fetchObservations = async () => {
      await observationType.store.getObservations();

      let found = false;
      values(observationType.store.observations).forEach((observation) => {
        if (observation._id === observationSlug) {
          found = true;
          setObservation(observation);
        }
      });
      if (!found) setObservation(null);
    };

    fetchObservations();
  }, []);

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  if (!isServer() && action && action !== "edit") {
    router.push("/observations/[...slug]", `/observations/${observationSlug}`);
    return null;
  }

  if (observationType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  if (observationType.store.isEmpty)
    return <Layout>Aucune observation n'a été ajoutée à l'application</Layout>;
  if (selectedObservation === null)
    return <Layout>Nous n'avons pas pu trouver cette observation</Layout>;
  if (!selectedObservation)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  if (action === "edit") {
    return (
      <Layout>
        <PageTitle>{`Modification de l'observation`}</PageTitle>
        <ObservationForm observation={selectedObservation} />
      </Layout>
    );
  }

  const editAction = () => {
    router.push(
      "/observations/[...slug]",
      `/observations/${selectedObservation.slug}/edit`
    );
  };
  const removeAction = async () => {
    const removedObservation = await selectedObservation.remove();
    router.push("/observations");
  };

  return (
    <Layout>
      <PageTitle>
        {`Observation : ${selectedObservation.description}`}
        <Button variant="outline" mx={5} onClick={editAction}>
          Modifier
        </Button>
        <Button
          variant="outline"
          onClick={withConfirm({
            header: `Êtes vous sûr(e) ?`,
            body: `Veuillez confirmer la suppression de l'observation :`,
            onConfirm: removeAction
          })}
        >
          Supprimer
        </Button>
      </PageTitle>
    </Layout>
  );
});
