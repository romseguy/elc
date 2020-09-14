import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { isServer } from "utils/isServer";
import { Table } from "evergreen-ui";
import { Heading, Spinner, Button } from "@chakra-ui/core";
import tw from "twin.macro";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { PageTitle } from "components/page-title";

export default function Page() {
  const [session, loading] = useSession();
  const [profileList, setProfileList] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/profiles");
      const { data } = await res.json();

      if (data) {
        setProfileList(data);
      }
    };

    fetchData();
  }, [session]);

  if (loading && !isServer) return null;

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
      <Link href="/fiches/add">
        <Button my={5} border="1px">
          Ajouter une fiche élève
        </Button>
      </Link>
      {Array.isArray(profileList) ? (
        <Table>
          <Table.Head>
            <Table.SearchHeaderCell
              placeholder="Filtrer..."
              onChange={(value) => console.log(value)}
            />
            <Table.TextHeaderCell>Date de naissance</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {profileList.map((atom) => (
              <Table.Row
                key={atom._id}
                isSelectable
                onSelect={() =>
                  router.push("/fiche/[pid]", `/fiche/${atom._id}`)
                }
              >
                <Table.TextCell>{atom.firstname}</Table.TextCell>
                <Table.TextCell>{atom.lastname}</Table.TextCell>
                <Table.TextCell>
                  {format(parseISO(atom.birthdate), "dd/MM/yyyy")}
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
}
