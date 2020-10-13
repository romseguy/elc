import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import { levels } from "tree/skill/skillType";
import tw, { styled } from "twin.macro";
import { format, isDate } from "date-fns";
import { isServer } from "utils/isServer";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Spinner,
  Tag,
  useColorModeValue,
  VStack
} from "@chakra-ui/core";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DeleteIcon,
  EditIcon
} from "@chakra-ui/icons";
import {
  AccessDenied,
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
  ParentForm
} from "components";

export default observer(function ProfilePage(props) {
  const [session = props.session] = useSession();
  const router = useRouter();
  const { parentType, profileType, skillType, workshopType } = useStore();
  const [showParentForm, setShowParentForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showWorkshopForm, setShowWorkshopForm] = useState(false);
  const [showParents, setShowParents] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [showWorkshops, setShowWorkshops] = useState(false);
  const [currentSkillRef, setCurrentSkillRef] = useState();
  const [currentWorkshopRef, setCurrentWorkshopRef] = useState();
  const boxProps = {
    bg: useColorModeValue("orange.200", "gray.800"),
    rounded: "lg",
    px: 5
  };

  const toggleParentForm = (e) => {
    e && e.stopPropagation();
    setShowParentForm(!showParentForm);
  };
  const toggleAddSkillForm = (e) => {
    e && e.stopPropagation();
    setShowSkillForm(!showSkillForm);
  };
  const toggleAddWorkshopForm = (e) => {
    e && e.stopPropagation();
    setShowWorkshopForm(!showWorkshopForm);
  };
  const toggleShowParents = () => setShowParents(!showParents);
  const toggleShowSkills = () => setShowSkills(!showSkills);
  const toggleShowLevels = () => setShowLevels(!showLevels);
  const toggleShowWorkshops = () => setShowWorkshops(!showWorkshops);

  const profileSlug = router.query.slug[0];
  const action = router.query.slug[1];

  if (!isServer() && action && action !== "edit") {
    router.push("/fiches/[...slug]", `/fiches/${profileSlug}`);
    return null;
  }

  useEffect(() => {
    const selectProfile = async () => {
      await skillType.store.getSkills();
      await workshopType.store.getWorkshops();
      await parentType.store.getParents();
      await profileType.selectProfile(profileSlug);
    };

    selectProfile();
  }, []);

  const selectedProfile = profileType.selectedProfile;

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

  const editAction = () => {
    router.push("/fiches/[...slug]", `/fiches/${selectedProfile.slug}/edit`);
  };
  const removeAction = async () => {
    const removedProfile = await selectedProfile.remove();
    router.push("/fiches");
  };

  const onParentRowClick = (parent) => {
    router.push("/parents/[...slug]", `/parents/${parent.slug}`);
  };

  const disableSortBySkill = selectedProfile.skills.length <= 1;
  const removeSkillAction = (skill) => {
    selectedProfile.removeSkill(skill);
    profileType.store.updateProfile(selectedProfile);
  };
  const editSkillAction = (skillRef) => {
    setCurrentSkillRef(skillRef);
  };

  const disableSortByWorkshop = selectedProfile.workshops.length <= 1;
  const removeWorkshopRefAction = (_id) => {
    selectedProfile.removeWorkshopRef(_id);
    profileType.store.updateProfile(selectedProfile);
  };
  const editWorkshopAction = (workshopRef) => {
    setCurrentWorkshopRef(workshopRef);
  };

  return (
    <Layout>
      <ProfileEditSkillForm
        currentSkillRef={currentSkillRef}
        selectedProfile={selectedProfile}
        onModalClose={() => setCurrentSkillRef()}
        onSubmit={() => setCurrentSkillRef()}
      />

      <ProfileEditWorkshopForm
        currentWorkshopRef={currentWorkshopRef}
        selectedProfile={selectedProfile}
        onModalClose={() => setCurrentWorkshopRef()}
        onSubmit={() => setCurrentWorkshopRef()}
      />

      <PageTitle>
        {`Fiche de l'élève : ${selectedProfile.firstname} ${selectedProfile.lastname}`}
        <Button variant="outline" mx={5} onClick={editAction}>
          Modifier
        </Button>
        <Button variant="outline" onClick={removeAction}>
          Supprimer
        </Button>
      </PageTitle>

      <VStack align="stretch" spacing={5}>
        <Box {...boxProps}>
          <PageSubTitle
            button={
              <Button
                display="none"
                variant="outline"
                mx={5}
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
              <Divider mb={5} />

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

        <Box {...boxProps}>
          <PageSubTitle
            button={
              <Button variant="outline" mx={5} onClick={toggleAddSkillForm}>
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
          >
            Compétences acquises
          </PageSubTitle>

          {showSkillForm && (
            <ProfileAddSkillForm
              profile={selectedProfile}
              skills={skillType.store.skills}
              onSubmit={toggleAddSkillForm}
            />
          )}

          {showSkills && selectedProfile.skills.length > 0 && (
            <>
              <Divider mb={5} />
              <Table
                initialState={{
                  sortBy: [
                    {
                      id: "date",
                      desc: true
                    }
                  ]
                }}
                data={values(selectedProfile.skills).map((skillRef) => {
                  const { skill, workshop, date } = skillRef;
                  return {
                    date: format(date, "dd/MM/yyyy"),
                    code: skill.code,
                    description: skill.description,
                    domain: skill.domain,
                    level: skill.level,
                    workshop: workshop && workshop.name,
                    editButton: (
                      <IconButton
                        icon={<EditIcon />}
                        onClick={() => editSkillAction(skillRef)}
                      />
                    ),
                    deleteButton: (
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => removeSkillAction(skill)}
                      />
                    )
                  };
                })}
                columns={[
                  {
                    Header: "Date",
                    accessor: "date",
                    sortType: "basic",
                    disableSortBy: disableSortBySkill
                  },
                  {
                    Header: "Code",
                    accessor: "code",
                    disableSortBy: disableSortBySkill
                  },
                  {
                    Header: "Description",
                    accessor: "description",
                    disableSortBy: disableSortBySkill
                  },
                  {
                    Header: "Matière",
                    accessor: "domain",
                    disableSortBy: disableSortBySkill
                  },
                  {
                    Header: "Niveau",
                    accessor: "level",
                    disableSortBy: disableSortBySkill
                  },
                  {
                    Header: "Atelier",
                    accessor: "workshop",
                    disableSortBy: disableSortBySkill
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
                ]}
              />
            </>
          )}
        </Box>

        <Box {...boxProps}>
          <PageSubTitle
            toggled={showLevels}
            onToggle={toggleShowLevels}
            onClick={toggleShowLevels}
          >
            Niveaux
          </PageSubTitle>

          {showLevels && (
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
                        {selectedProfile.getSkillsByLevel(level).length +
                          "/" +
                          skillType.store.getSkillsByLevel(level).length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </StyledTable>
          )}
        </Box>

        <Box {...boxProps}>
          <PageSubTitle
            button={
              <Button variant="outline" mx={5} onClick={toggleAddWorkshopForm}>
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
              <Divider mb={5} />
              <Table
                css={{
                  display: !showWorkshops
                    ? "none"
                    : selectedProfile.workshops.length > 0
                    ? "block"
                    : "none"
                }}
                initialState={{
                  sortBy: [
                    {
                      id: "name",
                      desc: true
                    }
                  ]
                }}
                data={values(selectedProfile.workshops).map((workshopRef) => {
                  const { _id, workshop, started, completed } = workshopRef;

                  return {
                    name: workshop.name,
                    started: isDate(started) && format(started, "dd/MM/yyyy"),
                    completed:
                      isDate(completed) && format(completed, "dd/MM/yyyy"),
                    skills: workshop.skills.map((skill) => (
                      <Tag key={skill._id}>{skill.code}</Tag>
                    )),
                    editButton: (
                      <IconButton
                        id="editWorkshop"
                        icon={<EditIcon />}
                        onClick={() => editWorkshopAction(workshopRef)}
                      />
                    ),
                    deleteButton: (
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => removeWorkshopRefAction(_id)}
                      />
                    )
                  };
                })}
                columns={[
                  {
                    Header: "Nom",
                    accessor: "name",
                    disableSortBy: disableSortByWorkshop
                  },
                  {
                    Header: "Date de début",
                    accessor: "started",
                    sortType: "basic",
                    disableSortBy: disableSortByWorkshop
                  },
                  {
                    Header: "Date de fin",
                    accessor: "completed",
                    sortType: "basic",
                    disableSortBy: disableSortByWorkshop
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
                ]}
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
