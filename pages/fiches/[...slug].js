import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { getSession, useSession } from "next-auth/client";
import { isServer } from "utils/isServer";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { useRouter } from "next/router";
import { ProfileForm } from "components/profile-form";
import { useEffect, useState } from "react";
import { useStore } from "tree";
import { Button, Icon, Spinner, useColorMode, useTheme } from "@chakra-ui/core";
import { PageSubTitle, PageTitle } from "components/page-title";
import { Table } from "components/table";
import { format } from "date-fns";
import { ProfileAddSkillForm } from "components/profile-add-skill-form";

export default observer((props) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const [session = props.session, loading] = useSession();
  const [showSkillForm, setShowSkillForm] = useState(false);
  const toggleAddSkillForm = () => setShowSkillForm(!showSkillForm);

  if (loading && !isServer) return null;
  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const router = useRouter();
  const profileSlug = router.query.slug[0];
  const action = router.query.slug[1];

  if (!isServer && action && action !== "edit") {
    router.push("/fiches/[...slug]", `/fiches/${profileSlug}`);
    return null;
  }

  const { profileType, skillType } = useStore();

  useEffect(() => {
    const selectProfile = async () => {
      await skillType.store.fetch();
      await profileType.selectProfile(profileSlug);
    };

    selectProfile();
  }, []);

  const selectedProfile = profileType.selectedProfile;

  if (!profileType.store.isLoading && profileType.store.isEmpty)
    return <Layout>Aucune fiche trouvée</Layout>;
  if (selectedProfile === null)
    return (
      <Layout>Nous n'avons pas pu trouver de fiche associée à cet élève</Layout>
    );

  if (action === "edit") {
    return (
      <Layout>
        {!!selectedProfile ? (
          <>
            <PageTitle>
              {`Modification de la fiche de ${selectedProfile.firstname} ${selectedProfile.lastname}`}
            </PageTitle>
            <ProfileForm profile={selectedProfile} />
          </>
        ) : (
          <Spinner />
        )}
      </Layout>
    );
  } else {
    const editAction = () => {
      router.push("/fiches/[...slug]", `/fiches/${selectedProfile.slug}/edit`);
    };
    const removeAction = async () => {
      const removedProfile = await selectedProfile.remove();
      router.push("/fiches");
    };
    const addSkillAction = () => {
      toggleAddSkillForm();
    };
    const removeSkillAction = (skill) => {
      const p = selectedProfile.removeSkill(skill);
      const res = p.update();

      if (res.status === "error") {
        console.error(res.message); // @todo: toast
      }
    };

    return (
      <Layout>
        {!!selectedProfile ? (
          <>
            <PageTitle>
              {`Fiche de ${selectedProfile.firstname} ${selectedProfile.lastname}`}
              <Button mx={5} border="1px" onClick={editAction}>
                Modifier
              </Button>
              <Button border="1px" onClick={removeAction}>
                Supprimer
              </Button>
            </PageTitle>
            <PageSubTitle>
              Compétences acquises
              <Button mx={5} border="1px" onClick={addSkillAction}>
                Ajouter {showSkillForm ? " 🔼" : " 🔽"}
              </Button>
            </PageSubTitle>
            {showSkillForm && (
              <ProfileAddSkillForm
                profile={selectedProfile}
                skills={skillType.store.skills}
                onSubmit={toggleAddSkillForm}
              />
            )}
            <Table
              initialState={{
                sortBy: [
                  {
                    id: "date",
                    desc: true,
                  },
                ],
              }}
              data={values(selectedProfile.skills).map(({ skill, date }) => {
                return {
                  deleteButton: (
                    <Button onClick={() => removeSkillAction(skill)}>
                      <Icon name="delete" />
                    </Button>
                  ),
                  code: skill.code,
                  description: skill.description,
                  date: format(date, "dd/MM/yyyy"),
                };
              })}
              columns={[
                {
                  Header: "Date",
                  accessor: "date",
                  sortType: "basic",
                },
                { Header: "Code", accessor: "code" },
                { Header: "Description", accessor: "description" },
                { Header: "Matière", accessor: "domain", sortType: "basic" },
                { Header: "Atelier", accessor: "workshop", sortType: "basic" },
                { Header: "", accessor: "deleteButton", disableSortBy: true },
              ]}
              bg={theme[colorMode].hover.bg}
            />
            {/*
            <PageSubTitle>Ateliers</PageSubTitle>
            <Table bg={theme[colorMode].hover.bg}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>L01</td>
                  <td>J'écoute et je comprends des consignes</td>
                  <td>En cours</td>
                </tr>
              </tbody>
            </Table>
          */}
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
