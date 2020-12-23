import { Layout } from "components";

export default function Page({ session }) {
  if (!session) {
    return <Layout>Bienvenue</Layout>;
  }

  return <Layout>Bienvenue {session.user.name}</Layout>;
}
