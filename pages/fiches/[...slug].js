import { getSession, useSession } from "next-auth/client";
import { isServer } from "utils/isServer";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { useRouter } from "next/router";
import { ProfileForm } from "components/profile-form";
import { useEffect, useState } from "react";
import { useStore } from "tree";
import { Button, Spinner, useColorMode, useTheme } from "@chakra-ui/core";
import { PageSubTitle, PageTitle } from "components/page-title";
import { Table } from "components/table";
import { format, subDays } from "date-fns";

export default function Page(props) {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const [session = props.session, loading] = useSession();

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

  const {
    profile: {
      store: { fetch, isLoading, isEmpty },
    },
  } = useStore();
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = await fetch();

      if (!profiles) router.push("/fiches");
      else {
        let found = false;
        Object.keys(profiles).forEach((_id) => {
          if (profiles[_id].slug === profileSlug) {
            found = true;
            setProfile(profiles[_id]);
          }
        });
        if (!found) setProfile(null);
      }
    };
    fetchProfiles();
  }, [action]);

  if (isLoading || profile === undefined)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  if (isEmpty) return <Layout>Aucune fiche trouvée</Layout>;
  if (profile === null)
    return (
      <Layout>Nous n'avons pas pu trouver de fiche associée à cet élève</Layout>
    );

  if (action === "edit") {
    return (
      <Layout>
        <ProfileForm profile={profile} />
      </Layout>
    );
  }

  const editAction = () => {
    router.push("/fiches/[...slug]", `/fiches/${profile.slug}/edit`);
  };
  const removeAction = async () => {
    const removedProfile = await profile.remove();
    router.push("/fiches");
  };

  return (
    <Layout>
      <PageTitle>
        {`Fiche de ${profile.firstname} ${profile.lastname}`}
        <Button mx={5} border="1px" onClick={editAction}>
          Modifier
        </Button>
        <Button border="1px" onClick={removeAction}>
          Supprimer
        </Button>
      </PageTitle>
      <PageSubTitle>Compétences acquises</PageSubTitle>
      <Table
        initialState={{
          sortBy: [
            {
              id: "date",
              desc: true,
            },
            {
              id: "domain",
              desc: true,
            },
            {
              id: "workshop",
              desc: true,
            },
          ],
        }}
        data={[
          {
            date: format(new Date(), "dd/MM/yyyy"),
            code: "L01",
            description: "J'écoute et je comprends des consignes",
            domain: "Français / Langage oral",
            workshop: "Chiffres",
          },
          {
            date: format(subDays(new Date(), 7), "dd/MM/yyyy"),
            code: "L02",
            description: "J'écoute et je comprends des consignes",
            domain: "Français / Langage oral",
            workshop: "Chiffres",
          },
        ]}
        columns={
          // [
          //   {
          //     Header: "Compétence",
          //     columns:
          [
            {
              Header: "Date",
              accessor: "date",
              sortType: "basic",
            },
            { Header: "Code", accessor: "code" },
            { Header: "Description", accessor: "description" },
            { Header: "Matière", accessor: "domain", sortType: "basic" },
            { Header: "Atelier", accessor: "workshop", sortType: "basic" },
          ]
          //   },
          // ]
        }
        bg={theme[colorMode].hover.bg}
      >
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>L01</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
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
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
