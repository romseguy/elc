import { useState, useEffect } from "react";
import { getSession } from "next-auth/client";
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

const Table = styled.table`
  thead th {
    ${tw`pr-8`}
  }
  tbody > tr {
    ${tw`border-t hover:bg-teal-100 cursor-pointer`}
  }
`;

export default function Page({ session }) {
  const [profileList, setProfileList] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/profiles");
      const { data } = await res.json();

      if (data) {
        setProfileList(data);
        //setProfileList(data.concat(data));
      }
    };

    fetchData();
  }, [session]);

  // if (loading && !isServer) return null;

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

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
      {Array.isArray(profileList) ? (
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
        // <Table>
        //   <Table.Head>
        //     <Table.SearchHeaderCell
        //       placeholder="Filtrer..."
        //       onChange={(value) => console.log(value)}
        //     />
        //     <Table.TextHeaderCell>Date de naissance</Table.TextHeaderCell>
        //   </Table.Head>
        //   <Table.Body height={240}>
        //     {profileList.map((atom) => (
        //       <Table.Row
        //         key={atom._id}
        //         isSelectable
        //         onSelect={() =>
        //           router.push("/fiche/[pid]", `/fiche/${atom._id}`)
        //         }
        //       >
        //         <Table.TextCell>{atom.firstname}</Table.TextCell>
        //         <Table.TextCell>{atom.lastname}</Table.TextCell>
        //         <Table.TextCell>
        //           {format(parseISO(atom.birthdate), "dd/MM/yyyy")}
        //         </Table.TextCell>
        //       </Table.Row>
        //     ))}
        //   </Table.Body>
        // </Table>
        <Spinner />
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
