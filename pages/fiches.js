import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import Layout from "../components/layout";
import AccessDenied from "../components/access-denied";
import { isServer } from "utils/isServer";
import { Table, Heading, Paragraph, Spinner } from "evergreen-ui";

export default function Page() {
  // state
  const [session, loading] = useSession();
  const [profileList, setProfileList] = useState();

  // side effects
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

  // render guards
  if (loading && !isServer) return null;

  if (!loading && !session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading>Les fiches des élèves</Heading>
      <Paragraph>Cliquez sur une fiche pour y accéder.</Paragraph>
      {Array.isArray(profileList) ? (
        <Table>
          <Table.Head>
            <Table.SearchHeaderCell />
            <Table.TextHeaderCell>Date de naissance</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {profileList.map((atom) => (
              <Table.Row
                key={atom._id}
                isSelectable
                onSelect={() => alert(atom.firstname)}
              >
                <Table.TextCell>{atom.firstname}</Table.TextCell>
                <Table.TextCell>{atom.lastname}</Table.TextCell>
                <Table.TextCell>{atom.birthdate}</Table.TextCell>
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
