import { getSession } from "next-auth/client";
import { Controller, useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { isServer } from "utils/isServer";
import { PageTitle } from "components/page-title";
import { Input, Button, FormControl, FormLabel } from "@chakra-ui/core";
import { DatePicker } from "components/datepicker";

// registerLocale("fr", fr);
// setDefaultLocale("fr");

export default function Page({ session }) {
  const { control, register, handleSubmit, watch, errors } = useForm({
    mode: "onChange",
  });
  const onSubmit = (data) => console.log(data);

  //if (loading && !isServer) return null;

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <PageTitle>Ajouter une nouvelle fiche élève</PageTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isRequired p={5}>
            <FormLabel htmlFor="firstname">Prénom</FormLabel>
            <Input
              name="firstname"
              placeholder="Prénom"
              ref={register({ required: true })}
            />
          </FormControl>

          <FormControl isRequired p={5} pt={0}>
            <FormLabel htmlFor="firstname">Nom</FormLabel>
            <Input
              name="lastname"
              placeholder="Nom"
              ref={register({ required: true })}
            />
          </FormControl>

          <FormControl isRequired p={5} pt={0}>
            <FormLabel htmlFor="birtdate">Date de naissance</FormLabel>
            <Controller
              as={DatePicker}
              name="Datepicker"
              control={control}
              defaultValue={null}
            />
          </FormControl>

          <Button type="submit">Ajouter</Button>
        </form>
      </Layout>
      {/* <DevTool control={control} /> */}
    </>
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
