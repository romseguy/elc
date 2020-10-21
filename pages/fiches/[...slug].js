import { useEffect, useMemo, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import { levels } from "tree/skill/utils";
import tw, { styled } from "twin.macro";
import { format, isDate } from "date-fns";
import { isServer } from "utils/isServer";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  Spinner,
  Tag,
  useColorModeValue,
  VStack,
  Progress,
  Text
} from "@chakra-ui/core";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DeleteIcon,
  EditIcon
} from "@chakra-ui/icons";
import {
  ProfileEditWorkshopForm,
  Layout,
  PageSubTitle,
  PageTitle,
  ProfileAddSkillForm,
  ProfileAddWorkshopForm,
  ProfileEditSkillForm,
  ProfileForm,
  StyledTable,
  Table,
  ProfileAddObservationForm,
  ProfileEditObservationForm
} from "components";

const SkillTable = ({
  withConfirm,
  editAction,
  removeAction,
  profile,
  display
}) => {
  const disableSortBy = useMemo(
    () => profile.skills.length <= 1,
    profile.skills
  );

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        sortType: "log",
        disableSortBy
      },
      {
        Header: "Code",
        accessor: "code",
        disableSortBy
      },
      {
        Header: "Description",
        accessor: "description",
        disableSortBy
      },
      {
        Header: "Matière",
        accessor: "domain",
        disableSortBy
      },
      {
        Header: "Niveau",
        accessor: "level",
        disableSortBy
      },
      {
        Header: "Atelier",
        accessor: "workshop",
        disableSortBy
      },
      {
        Header: "",
        accessor: "editButton",
        disableSortBy: true
      },
      {
        Header: "",
        accessor: "deleteButton",
        disableSortBy: true
      }
    ],
    [disableSortBy]
  );

  const data = useMemo(
    () =>
      values(profile.skills).map((skillRef) => {
        const { skill, workshop, date } = skillRef;

        return {
          date: format(date, "dd/MM/yyyy"),
          code: skill.code,
          description: skill.description,
          domain: skill.domain && skill.domain.name,
          level: skill.level,
          workshop: workshop && workshop.name,
          editButton: (
            <IconButton
              icon={<EditIcon />}
              onClick={() => editAction(skillRef)}
            />
          ),
          deleteButton: (
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={withConfirm({
                header: `Êtes vous sûr(e) ?`,
                body: (
                  <Text>
                    Veuillez confirmer la suppression de la compétence{" "}
                    <strong>{skill.code}</strong> de la fiche élève de{" "}
                    <strong>
                      {profile.firstname} {profile.lastname}
                    </strong>{" "}
                    :
                  </Text>
                ),
                onConfirm: () => removeAction(skillRef)
              })}
            />
          )
        };
      }),
    [profile.skills]
  );

  return (
    <Table
      css={{ display }}
      initialState={{
        sortBy: [
          {
            id: "date",
            desc: true
          }
        ]
      }}
      data={data}
      columns={columns}
      fullWidth
    />
  );
};

const WorkshopTable = ({
  withConfirm,
  editAction,
  removeAction,
  profile,
  display
}) => {
  const disableSortBy = useMemo(() => profile.workshops.length <= 1, [
    profile.workshops
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "Nom",
        accessor: "name",
        disableSortBy
      },
      {
        Header: "Date de début",
        accessor: "started",
        sortType: "basic",
        disableSortBy
      },
      {
        Header: "Date de fin",
        accessor: "completed",
        sortType: "basic",
        disableSortBy
      },
      {
        Header: "Compétences",
        accessor: "skills",
        disableSortBy: true
      },
      {
        Header: "",
        accessor: "editButton",
        disableSortBy: true
      },
      {
        Header: "",
        accessor: "deleteButton",
        disableSortBy: true
      }
    ],
    [disableSortBy]
  );

  const data = useMemo(
    () =>
      values(profile.workshops).map((workshopRef) => {
        const { _id, workshop, started, completed } = workshopRef;

        return {
          name: workshop.name,
          started: isDate(started) && format(started, "dd/MM/yyyy"),
          completed: isDate(completed) && format(completed, "dd/MM/yyyy"),
          skills: workshop.skills.map((skill) => (
            <Tag key={skill._id} mr={2}>
              {skill.code}
            </Tag>
          )),
          editButton: (
            <IconButton
              id="editWorkshop"
              icon={<EditIcon />}
              onClick={() => editAction(workshopRef)}
            />
          ),
          deleteButton: (
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={withConfirm({
                header: `Êtes vous sûr(e) ?`,
                body: (
                  <Text>
                    Veuillez confirmer la suppression de l'atelier{" "}
                    <strong>{workshopRef.workshop.name}</strong> de la fiche
                    élève de{" "}
                    <strong>
                      {profile.firstname} {profile.lastname}
                    </strong>{" "}
                    :
                  </Text>
                ),
                onConfirm: () => removeAction(workshopRef)
              })}
            />
          )
        };
      }),
    [profile.workshops]
  );

  return (
    <Table
      css={{
        display
      }}
      initialState={{
        sortBy: [
          {
            id: "name",
            desc: true
          }
        ]
      }}
      data={data}
      columns={columns}
    />
  );
};

const ObservationTable = ({
  withConfirm,
  editAction,
  removeAction,
  profile,
  display
}) => {
  const disableSortBy = useMemo(() => profile.observations.length <= 1, [
    profile.observations
  ]);

  const columns = useMemo(() => [
    {
      Header: "Date",
      accessor: "date",
      sortType: "basic",
      disableSortBy
    },
    {
      Header: "Description",
      accessor: "description",
      disableSortBy
    },
    {
      Header: "",
      accessor: "editButton",
      disableSortBy: true
    },
    {
      Header: "",
      accessor: "deleteButton",
      disableSortBy: true
    }
  ]);

  const data = useMemo(() =>
    values(profile.observations).map((observationRef) => {
      const { _id, observation, date } = observationRef;

      return {
        description: observation.description,
        date: isDate(date) && format(date, "dd/MM/yyyy"),
        editButton: (
          <IconButton
            id="editObservation"
            icon={<EditIcon />}
            onClick={() => editAction(observationRef)}
          />
        ),
        deleteButton: (
          <IconButton
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={withConfirm({
              header: `Êtes vous sûr(e) ?`,
              body: (
                <>
                  <Text>
                    Veuillez confirmer la suppression de l'observation :
                  </Text>
                  <Text my={2}>
                    <strong>{observationRef.observation.description}</strong>
                  </Text>
                  <Text>
                    {" "}
                    de la fiche élève de {profile.firstname} {profile.lastname}{" "}
                    :
                  </Text>
                </>
              ),
              onConfirm: () => removeAction(observationRef)
            })}
          />
        )
      };
    })
  );

  return (
    <Table
      css={{
        display
      }}
      initialState={{
        sortBy: [
          {
            id: "date",
            desc: true
          }
        ]
      }}
      data={data}
      columns={columns}
    />
  );
};

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
    confirm,
    parentType,
    profileType,
    skillType,
    workshopType,
    observationType
  } = useStore();

  const withConfirm = (props) => (e) => confirm.onOpen(props);

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
  const toggleShowParents = () => setShowParents(!showParents);
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
  const toggleShowSkills = () => setShowSkills(!showSkills);
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
  const removeSkillRefAction = (skillRef) => {
    selectedProfile.removeSkillRef(skillRef._id);
    profileType.store.updateProfile(selectedProfile);
  };

  // levels
  const [showLevels, setShowLevels] = useState(false);
  const toggleShowLevels = () => setShowLevels(!showLevels);

  // workshops
  const [showWorkshops, setShowWorkshops] = useState(false);
  const toggleShowWorkshops = () => setShowWorkshops(!showWorkshops);
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
  const toggleShowObservations = () => setShowObservations(!showObservations);
  const [showObservationForm, setShowObservationForm] = useState(false);
  const toggleObservationForm = (e) => {
    e && e.stopPropagation();
    setShowObservationForm(!showObservationForm);
  };
  const [currentObservationRef, setCurrentObservationRef] = useState();
  const removeObservationRefAction = (_id) => {
    selectedProfile.removeObservationRef(_id);
    profileType.store.updateProfile(selectedProfile);
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
    pl: 5,
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

              <StyledTable>
                <thead>
                  <tr>
                    <th>Prénom </th>
                    <th>Nom </th>
                  </tr>
                </thead>
                <tbody>
                  {values(selectedProfile.parents).map((parent) => {
                    return (
                      <tr
                        key={parent._id}
                        tabIndex={0}
                        title={`Cliquez pour ouvrir la fiche de ${parent.firstname} ${parent.lastname}`}
                        onClick={() => onParentRowClick(parent)}
                      >
                        <td>{parent.firstname}</td>
                        <td>{parent.lastname}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </StyledTable>
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
            <ProfileAddSkillForm
              profile={selectedProfile}
              skills={skillType.store.skills}
              onSubmit={toggleSkillForm}
            />
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
              <StyledTable>
                <thead>
                  <tr>
                    <th>Niveau</th>
                    <th>Progression</th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((level) => {
                    return (
                      <tr key={level}>
                        <td>{level}</td>
                        <td>
                          <Progress
                            value={
                              selectedProfile.getSkillsByLevel(level).length
                            }
                            min={0}
                            max={skillType.store.skills.size}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </StyledTable>
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
            <ProfileAddWorkshopForm
              profile={selectedProfile}
              workshops={workshopType.store.workshops}
              onSubmit={() => {
                setShowWorkshopForm(false);
                setShowWorkshops(true);
              }}
            />
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
            <ProfileAddObservationForm
              profile={selectedProfile}
              observations={observationType.store.observations}
              onSubmit={() => {
                setShowObservationForm(false);
                setShowObservations(true);
              }}
            />
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
