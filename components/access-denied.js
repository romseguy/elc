import { signIn } from "next-auth/client";
import { Text } from "@chakra-ui/core";
import { Link } from "components/link";
import { PageTitle } from "./page-title";

export default function AccessDenied() {
  return (
    <>
      <PageTitle>Accès refusé</PageTitle>
      <Text>
        <Link
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          Vous devez être identifié pour accéder à cette page.
        </Link>
      </Text>
    </>
  );
}
