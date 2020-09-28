import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "tree";
import tw, { styled } from "twin.macro";
import { format } from "date-fns";
import { isServer } from "utils/isServer";
import { Button, IconButton, Spinner } from "@chakra-ui/core";
import { DeleteIcon } from "@chakra-ui/icons";
import AccessDenied from "components/access-denied";
import Layout from "components/layout";
import { PageSubTitle, PageTitle } from "components/page-title";
import { ProfileAddSkillForm } from "components/profile-add-skill-form";
import { ProfileForm } from "components/profile-form";
import { Table } from "components/table";

const ParentList = styled.ul`
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
  const [showSkillForm, setShowSkillForm] = useState(false);
  useEffect(() => {
    const selectProfile = async () => {
      await skillType.store.fetch();
      await parentType.store.fetch();
      await profileType.selectProfile(profileSlug);
    };

    selectProfile();
  }, []);

  if (!session)
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );

  const profileSlug = router.query.slug[0];
  const action = router.query.slug[1];

  if (!isServer() && action && action !== "edit") {
    router.push("/fiches/[...slug]", `/fiches/${profileSlug}`);
    return null;
  }

  const selectedProfile = profileType.selectedProfile;

  if (profileType.store.isLoading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  if (profileType.store.isEmpty) return <Layout>Aucune fiche trouvée</Layout>;
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
          {`Modification de la fiche de l'élève ${selectedProfile.firstname} ${selectedProfile.lastname}`}
        </PageTitle>
        <ProfileForm profile={selectedProfile} />
      </Layout>
    );

  const toggleAddSkillForm = () => setShowSkillForm(!showSkillForm);
  const editAction = () => {
    router.push("/fiches/[...slug]", `/fiches/${selectedProfile.slug}/edit`);
  };
  const removeAction = async () => {
    const removedProfile = await selectedProfile.remove();
    router.push("/fiches");
  };
  const removeSkillAction = (skill) => {
    selectedProfile.removeSkill(skill);
    const res = selectedProfile.update();

    if (res.status === "error") {
      console.error(res.message); // @todo: toast
    }
  };
  const onParentRowClick = (parent) => {
    router.push("/parents/[...slug]", `/parents/${parent.slug}`);
  };

  return (
    <Layout>
      <PageTitle>
        {`Fiche de l'élève : ${selectedProfile.firstname} ${selectedProfile.lastname}`}
        <Button variant="outline" mx={5} onClick={editAction}>
          Modifier
        </Button>
        <Button variant="outline" onClick={removeAction}>
          Supprimer
        </Button>
      </PageTitle>
      <PageSubTitle>Parents</PageSubTitle>
      <ParentList>
        {selectedProfile.parents.map((parent) => {
          return (
            <li key={parent._id}>
              <a onClick={() => onParentRowClick(parent)}>
                {parent.firstname} {parent.lastname}
              </a>
            </li>
          );
        })}
      </ParentList>
      <PageSubTitle>
        Compétences acquises
        <Button variant="outline" mx={5} onClick={toggleAddSkillForm}>
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
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => removeSkillAction(skill)}
              />
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
      />
      {/*
            <PageSubTitle>Ateliers</PageSubTitle>
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
    </Layout>
  );
});

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
