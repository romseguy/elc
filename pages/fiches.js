import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { isServer } from "utils/isServer";
// import { Table } from "evergreen-ui";
import { Heading, Spinner, Button, Box } from "@chakra-ui/core";
import tw, { styled } from "twin.macro";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { PageTitle } from "components/page-title";
import api from "utils/api";

const Table = styled.table`
  thead th {
    ${tw`pr-8`}
  }
  tbody > tr {
    ${tw`border-t hover:bg-teal-100 cursor-pointer`}
  }
`;

export default function Page(props) {
  const [session = props.session, loading] = useSession();

  if (loading && !isServer) return null;

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  const [profileList, setProfileList] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get("profiles");
      setProfileList(data);
    };

    fetchData();
  }, [session]);

  const router = useRouter();

  return (
    <Layout>
      <PageTitle>Les fiches des élèves</PageTitle>
      <Box>
        <Link href="/fiches/add">
          <Button my={5} border="1px">
            Ajouter une nouvelle fiche élève
          </Button>
        </Link>
      </Box>
      {!profileList ? (
        <Spinner />
      ) : profileList.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Prénom </th>
              <th>Nom </th>
              <th>Date de naissance </th>
            </tr>
          </thead>
          <tbody>
            {profileList.map((atom) => (
              <tr
                key={atom._id}
                tabIndex={0}
                title={`Cliquez pour ouvrir la fiche de ${atom.firstname}`}
                onClick={() =>
                  router.push("/fiche/[pid]", `/fiche/${atom._id}`)
                }
              >
                <td>{atom.firstname}</td>
                <td>{atom.lastname}</td>
                <td>{format(parseISO(atom.birthdate), "dd/MM/yyyy")}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <></>
      )}
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
