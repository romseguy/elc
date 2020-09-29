import { getSession } from "next-auth/client";
import { Layout } from "components";

export default function Page({ session }) {
  if (!session) {
    return <Layout>Bienvenue</Layout>;
  }

  return <Layout>Bienvenue {session.user.name}</Layout>;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
