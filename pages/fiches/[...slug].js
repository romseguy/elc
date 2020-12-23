import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import { format } from "date-fns";
import { isServer } from "utils/isServer";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Spinner,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Layout,
  PageSubTitle,
  PageTitle,
  ProfileForm,
  ParentTable,
  SkillTable,
  ProfileAddSkillForm,
  ProfileEditSkillForm,
  LevelTable,
  WorkshopTable,
  ProfileAddWorkshopForm,
  ProfileEditWorkshopForm,
  ObservationTable,
  ProfileAddObservationForm,
  ProfileEditObservationForm
} from "components";

export default observer(function ProfilePage(props) {
  const [session = props.session] = useSession();
  const router = useRouter();
  const profileSlug = router.query.slug[0];
  const action = router.query.slug[1];

  if (!isServer() && action && action !== "edit") {
    router.push("/fiches/[...slug]", `/fiches/${profileSlug}`);
    return null;
  }

  const {
    confirmType,
    parentType,
    profileType,
    skillType,
    workshopType,
    observationType
  } = useStore();

  const withConfirm = (props) => (e) => confirmType.onOpen(props);

  const selectedProfile = profileType.selectedProfile;
  const editAction = () => {
    router.push("/fiches/[...slug]", `/fiches/${selectedProfile.slug}/edit`);
  };
  const removeAction = async () => {
    const removedProfile = await selectedProfile.remove();
    router.push("/fiches");
  };

  // parents
  const [showParents, setShowParents] = useState(false);
  const toggleShowParents = () => {
    setShowParentForm(false);
    setShowParents(!showParents);
  };
  const [showParentForm, setShowParentForm] = useState(false);
  const toggleParentForm = (e) => {
    e && e.stopPropagation();
    setShowParentForm(!showParentForm);
  };
  const onParentRowClick = (parent) => {
    router.push("/parents/[...slug]", `/parents/${parent.slug}`);
  };

  // skills
  const [showSkills, setShowSkills] = useState(false);
  const toggleShowSkills = () => {
    setShowSkillForm(false);
    setShowSkills(!showSkills);
  };
  const [showSkillForm, setShowSkillForm] = useState(false);
  const toggleSkillForm = (e) => {
    e && e.stopPropagation();
    setShowSkillForm(!showSkillForm);
  };
  const [currentSkillRef, setCurrentSkillRef] = useState();
  const displaySkills = !showSkills
    ? "none"
    : selectedProfile.skills.length > 0
    ? "block"
    : "none";
  const editSkillRefAction = (skillRef) => {
    setCurrentSkillRef(skillRef);
  };
  const removeSkillRefAction = async (skillRef) => {
    selectedProfile.removeSkillRef(skillRef);
    const { data, error } = await profileType.store.updateProfile(
      selectedProfile
    );
    // TODO: handle error
  };

  // levels
  const [showLevels, setShowLevels] = useState(false);
  const toggleShowLevels = () => setShowLevels(!showLevels);

  // workshops
  const [showWorkshops, setShowWorkshops] = useState(false);
  const toggleShowWorkshops = () => {
    setShowWorkshopForm(false);
    setShowWorkshops(!showWorkshops);
  };
  const [showWorkshopForm, setShowWorkshopForm] = useState(false);
  const toggleWorkshopForm = (e) => {
    e && e.stopPropagation();
    setShowWorkshopForm(!showWorkshopForm);
  };
  const [currentWorkshopRef, setCurrentWorkshopRef] = useState();
  const displayWorkshops = !showWorkshops
    ? "none"
    : selectedProfile.workshops.length > 0
    ? "block"
    : "none";
  const removeWorkshopRefAction = (workshopRef) => {
    selectedProfile.removeWorkshopRef(workshopRef._id);
    profileType.store.updateProfile(selectedProfile);
  };
  const editWorkshopRefAction = (workshopRef) => {
    setCurrentWorkshopRef(workshopRef);
  };

  // observations
  const [showObservations, setShowObservations] = useState(false);
  const toggleShowObservations = () => {
    setShowObservationForm(false);
    setShowObservations(!showObservations);
  };
  const [showObservationForm, setShowObservationForm] = useState(false);
  const toggleObservationForm = (e) => {
    e && e.stopPropagation();
    setShowObservationForm(!showObservationForm);
  };
  const [currentObservationRef, setCurrentObservationRef] = useState();
  const removeObservationRefAction = async (observationRef) => {
    selectedProfile.removeObservationRef(observationRef);
    const { data, error } = await profileType.store.updateProfile(
      selectedProfile
    );
    // TODO: handle error
  };
  const editObservationRefAction = (observationRef) => {
    setCurrentObservationRef(observationRef);
  };
  const displayObservations = !showObservations
    ? "none"
    : selectedProfile.observations.length > 0
    ? "block"
    : "none";

  // rendering
  const sectionProps = {
    as: "section",
    bg: useColorModeValue("orange.200", "gray.800"),
    rounded: "lg"
  };

  const pageSubtitleProps = {
    p: 2,
    _hover: {
      bg: useColorModeValue("orange.300", "gray.700"),
      rounded: "lg"
    }
  };

  useEffect(() => {
    const selectProfile = async () => {
      await parentType.store.getParents();
      profileType.selectProfile(profileSlug);
    };
    selectProfile();
  }, []);

  if (!profileType.store.isLoading && profileType.store.isEmpty)
    return <Layout>Aucune fiche élève n'a été ajoutée à l'application</Layout>;
  if (selectedProfile === null)
    return (
      <Layout>Nous n'avons pas pu trouver de fiche associée à cet élève</Layout>
    );
  if (!selectedProfile)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  if (action === "edit")
    return (
      <Layout>
        <PageTitle>
          {`Fiche de l'élève : ${selectedProfile.firstname} ${selectedProfile.lastname}`}
        </PageTitle>
        <ProfileForm profile={selectedProfile} />
      </Layout>
    );

  return (
    <Layout>
      <ProfileEditSkillForm
        currentSkillRef={currentSkillRef}
        profile={selectedProfile}
        onClose={() => setCurrentSkillRef()}
        onSubmit={() => setCurrentSkillRef()}
      />

      <ProfileEditWorkshopForm
        currentWorkshopRef={currentWorkshopRef}
        profile={selectedProfile}
        onClose={() => setCurrentWorkshopRef()}
        onSubmit={() => setCurrentWorkshopRef()}
      />

      <ProfileEditObservationForm
        currentObservationRef={currentObservationRef}
        profile={selectedProfile}
        onClose={() => setCurrentObservationRef()}
        onSubmit={() => setCurrentObservationRef()}
      />

      <PageTitle>
        {`Fiche de l'élève : ${selectedProfile.firstname} ${selectedProfile.lastname}`}
        <Button variant="outline" mx={5} onClick={editAction}>
          Modifier
        </Button>
        <Button
          variant="outline"
          onClick={withConfirm({
            header: `Êtes vous sûr(e) ?`,
            body: `Veuillez confirmer la suppression de la fiche élève de ${selectedProfile.firstname} ${selectedProfile.lastname} :`,
            onConfirm: removeAction
          })}
        >
          Supprimer
        </Button>
      </PageTitle>

      <List mb={5}>
        {selectedProfile.birthdate && (
          <ListItem>
            Date de naissance :{" "}
            {format(selectedProfile.birthdate, "dd/MM/yyyy")}
          </ListItem>
        )}
      </List>

      <VStack align="stretch" spacing={5}>
        <Box {...sectionProps}>
          <PageSubTitle
            button={
              <Button
                display="none"
                variant="outline"
                ml={5}
                onClick={toggleParentForm}
              >
                Associer un parent
                {showParentForm ? (
                  <ArrowUpIcon ml={2} />
                ) : (
                  <ArrowDownIcon ml={2} />
                )}
              </Button>
            }
            togglable={selectedProfile.parents.length > 0}
            toggled={showParents}
            onToggle={toggleShowParents}
            onClick={toggleShowParents}
            {...pageSubtitleProps}
          >
            Parents
          </PageSubTitle>

          {/* {showParentForm && (
                <ParentForm
                  profiles={[selectedProfile]}
                  onSubmit={async () => {
                    await parentType.store.getParents();
                    await profileType.store.getProfiles();
                    toggleParentForm();
                  }}
                />
              )} */}

          {showParents && selectedProfile.parents.length > 0 && (
            <>
              <Divider mb={5} borderColor="white" borderWidth={2} />
              <ParentTable
                onParentRowClick={onParentRowClick}
                profile={selectedProfile}
                css={{ marginLeft: "1rem" }}
              />
            </>
          )}
        </Box>

        <Box {...sectionProps}>
          <PageSubTitle
            button={
              <Button variant="outline" ml={5} onClick={toggleSkillForm}>
                Valider une compétence
                {showSkillForm ? (
                  <ArrowUpIcon ml={2} />
                ) : (
                  <ArrowDownIcon ml={2} />
                )}
              </Button>
            }
            togglable={selectedProfile.skills.length > 0}
            toggled={showSkills}
            onToggle={toggleShowSkills}
            onClick={toggleShowSkills}
            {...pageSubtitleProps}
          >
            Compétences acquises
          </PageSubTitle>

          {showSkillForm && (
            <Box ml={5}>
              <ProfileAddSkillForm
                profile={selectedProfile}
                skills={skillType.store.skills}
                onSubmit={toggleSkillForm}
              />
            </Box>
          )}

          {showSkills && selectedProfile.skills.length > 0 && (
            <>
              <Divider mb={5} borderColor="white" borderWidth={2} />
              <SkillTable
                editAction={editSkillRefAction}
                removeAction={removeSkillRefAction}
                withConfirm={withConfirm}
                profileType={profileType}
                profile={selectedProfile}
                display={displaySkills}
                css={{ marginLeft: "1rem" }}
              />
            </>
          )}
        </Box>

        <Box {...sectionProps}>
          <PageSubTitle
            toggled={showLevels}
            onToggle={toggleShowLevels}
            onClick={toggleShowLevels}
            {...pageSubtitleProps}
          >
            Niveaux
          </PageSubTitle>

          {showLevels && (
            <>
              <Divider mb={5} borderColor="white" borderWidth={2} />
              <LevelTable
                profile={selectedProfile}
                maxProgress={skillType.store.skills.size}
                css={{ marginLeft: "1rem" }}
              />
            </>
          )}
        </Box>

        <Box {...sectionProps}>
          <PageSubTitle
            button={
              <Button variant="outline" ml={5} onClick={toggleWorkshopForm}>
                Associer un atelier
                {showWorkshopForm ? (
                  <ArrowUpIcon ml={2} />
                ) : (
                  <ArrowDownIcon ml={2} />
                )}
              </Button>
            }
            togglable={selectedProfile.workshops.length > 0}
            toggled={showWorkshops}
            onToggle={toggleShowWorkshops}
            onClick={toggleShowWorkshops}
            {...pageSubtitleProps}
          >
            Ateliers
          </PageSubTitle>

          {showWorkshopForm && (
            <Box ml={5}>
              <ProfileAddWorkshopForm
                profile={selectedProfile}
                workshops={workshopType.store.workshops}
                onSubmit={() => {
                  setShowWorkshopForm(false);
                  setShowWorkshops(true);
                }}
              />
            </Box>
          )}

          {showWorkshops && selectedProfile.workshops.length > 0 && (
            <>
              <Divider mb={5} borderColor="white" borderWidth={2} />
              <WorkshopTable
                withConfirm={withConfirm}
                editAction={editWorkshopRefAction}
                removeAction={removeWorkshopRefAction}
                profile={selectedProfile}
                display={displayWorkshops}
                css={{ marginLeft: "1rem" }}
              />
            </>
          )}
        </Box>

        <Box {...sectionProps}>
          <PageSubTitle
            button={
              <Button variant="outline" ml={5} onClick={toggleObservationForm}>
                Associer une observation
                {showObservationForm ? (
                  <ArrowUpIcon ml={2} />
                ) : (
                  <ArrowDownIcon ml={2} />
                )}
              </Button>
            }
            togglable={selectedProfile.observations.length > 0}
            toggled={showObservations}
            onToggle={toggleShowObservations}
            onClick={toggleShowObservations}
            {...pageSubtitleProps}
          >
            Observations
          </PageSubTitle>

          {showObservationForm && (
            <Box ml={5}>
              <ProfileAddObservationForm
                profile={selectedProfile}
                observations={observationType.store.observations}
                onSubmit={() => {
                  setShowObservationForm(false);
                  setShowObservations(true);
                }}
              />
            </Box>
          )}

          {showObservations && selectedProfile.observations.length > 0 && (
            <>
              <Divider mb={5} borderColor="white" borderWidth={2} />
              <ObservationTable
                withConfirm={withConfirm}
                editAction={editObservationRefAction}
                removeAction={removeObservationRefAction}
                profile={selectedProfile}
                display={displayObservations}
                css={{ marginLeft: "1rem" }}
              />
            </>
          )}
        </Box>
      </VStack>
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
