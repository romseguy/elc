import { signIn } from "next-auth/client";
import { Heading, Text } from "@chakra-ui/core";
import { Link } from "components/link";

export default function AccessDenied() {
  return (
    <>
      <Heading>Accès refusé</Heading>
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
