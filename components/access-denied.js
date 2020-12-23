import { signIn } from "next-auth/client";
import { Text } from "@chakra-ui/react";
import { Link, PageTitle } from "components";

export const AccessDenied = () => {
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
};
