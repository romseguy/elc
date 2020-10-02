import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import tw, { styled } from "twin.macro";
import { format, isDate } from "date-fns";
import { isServer } from "utils/isServer";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Spinner,
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
  ProfileForm,
  StyledTable,
  Table
} from "components";

export default observer((props) => {
  const [session = props.session] = useSession();
  const router = useRouter();
  const { parentType, profileType, skillType, workshopType } = useStore();
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showWorkshopForm, setShowWorkshopForm] = useState(false);
  const [showParents, setShowParents] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showWorkshops, setShowWorkshops] = useState(false);
  const [currentWorkshopRef, setCurrentWorkshopRef] = useState();

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

  if (profileType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  if (profileType.store.isEmpty)
    return <Layout>Aucune fiche n'a été ajoutée à l'application</Layout>;
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

  const removeSkillAction = (skill) => {
    selectedProfile.removeSkill(skill);
    selectedProfile.update();
  };

  const removeWorkshopAction = (workshop) => {
    selectedProfile.removeWorkshop(workshop);
    selectedProfile.update();
  };
  const onWorkshopEditClick = (workshopRef) => {
    setCurrentWorkshopRef(workshopRef);
  };

  const boxProps = {
    bg: useColorModeValue("orange.200", "gray.800"),
    rounded: "lg",
    px: 5
  };

  return (
    <Layout>
      {currentWorkshopRef && (
        <ProfileEditWorkshopForm
          currentWorkshopRef={currentWorkshopRef}
          setCurrentWorkshopRef={setCurrentWorkshopRef}
        />
      )}

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
            togglable={selectedProfile.parents.length > 0}
            toggled={showParents}
            onToggle={toggleShowParents}
            onClick={toggleShowParents}
          >
            Parents
          </PageSubTitle>

          {showParents && selectedProfile.parents.length > 0 && (
            <>
              <Divider mb={5} />

              <StyledTable borderColor={useColorModeValue("black", "white")}>
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
            togglable={selectedProfile.skills.length > 0}
            toggled={showSkills}
            onToggle={toggleShowSkills}
            onClick={toggleShowSkills}
          >
            Compétences acquises
            <Button variant="outline" mx={5} onClick={toggleAddSkillForm}>
              Ajouter{" "}
              {showSkillForm ? (
                <ArrowUpIcon ml={2} />
              ) : (
                <ArrowDownIcon ml={2} />
              )}
            </Button>
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
                borderColor={useColorModeValue("black", "white")}
                initialState={{
                  sortBy: [
                    {
                      id: "date",
                      desc: true
                    }
                  ]
                }}
                data={values(selectedProfile.skills).map(({ skill, date }) => {
                  return {
                    deleteButton: (
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => removeSkillAction(skill)}
                      />
                    ),
                    code: skill.code,
                    description: skill.description,
                    date: format(date, "dd/MM/yyyy")
                  };
                })}
                columns={[
                  {
                    Header: "Date",
                    accessor: "date",
                    sortType: "basic"
                  },
                  { Header: "Code", accessor: "code" },
                  { Header: "Description", accessor: "description" },
                  { Header: "Matière", accessor: "domain", sortType: "basic" },
                  {
                    Header: "Atelier",
                    accessor: "workshop",
                    sortType: "basic"
                  },
                  { Header: "", accessor: "deleteButton", disableSortBy: true }
                ]}
              />
            </>
          )}
        </Box>

        <Box {...boxProps}>
          <PageSubTitle
            togglable={selectedProfile.workshops.length > 0}
            toggled={showWorkshops}
            onToggle={toggleShowWorkshops}
            onClick={toggleShowWorkshops}
          >
            Ateliers
            <Button variant="outline" mx={5} onClick={toggleAddWorkshopForm}>
              Ajouter
              {showWorkshopForm ? (
                <ArrowUpIcon ml={2} />
              ) : (
                <ArrowDownIcon ml={2} />
              )}
            </Button>
          </PageSubTitle>

          {showWorkshopForm && (
            <ProfileAddWorkshopForm
              profile={selectedProfile}
              workshops={workshopType.store.workshops}
              onSubmit={toggleAddWorkshopForm}
            />
          )}

          {showWorkshops && selectedProfile.workshops.length > 0 && (
            <>
              <Divider mb={5} />
              <Table
                borderColor={useColorModeValue("black", "white")}
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
                  const { workshop, started, completed } = workshopRef;
                  return {
                    deleteButton: (
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => removeWorkshopAction(workshop)}
                      />
                    ),
                    editButton: (
                      <IconButton
                        icon={<EditIcon />}
                        onClick={() => onWorkshopEditClick(workshopRef)}
                      />
                    ),
                    name: workshop.name,
                    started: isDate(started) && format(started, "dd/MM/yyyy"),
                    completed:
                      isDate(completed) && format(completed, "dd/MM/yyyy")
                  };
                })}
                columns={[
                  { Header: "Nom", accessor: "name" },
                  {
                    Header: "Date de début",
                    accessor: "started",
                    sortType: "basic"
                  },
                  {
                    Header: "Date de fin",
                    accessor: "completed",
                    sortType: "basic"
                  },
                  { Header: "", accessor: "editButton", disableSortBy: true },
                  { Header: "", accessor: "deleteButton", disableSortBy: true }
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
