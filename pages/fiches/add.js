import { getSession, useSession } from "next-auth/client";
import { Controller, useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import Layout from "components/layout";
import AccessDenied from "components/access-denied";
import { isServer } from "utils/isServer";
import { PageTitle } from "components/page-title";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Icon,
  Stack,
} from "@chakra-ui/core";
import { DatePicker } from "components/datepicker";
import api from "utils/api";
import { useRouter } from "next/router";
import { isValid, subYears } from "date-fns";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";

// registerLocale("fr", fr);
// setDefaultLocale("fr");

export default function Page(props) {
  const [session = props.session, loading] = useSession();
  const [isLoading, setIsLoading] = useState();
  const router = useRouter();

  if (loading && !isServer) return null;

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  const {
    control,
    register,
    handleSubmit,
    watch,
    errors,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
  });

  const onChange = () => {
    clearErrors("errorMessage");
  };

  const onSubmit = async ({ firstname, lastname, birthdate }) => {
    setIsLoading(true);
    // if (!isValid(new Date(birthdate))) {
    //   setError("birthdate", {
    //     type: "manual",
    //     message: "Veuillez entrer une date de naissance valide",
    //   });
    // }

    const data = await api.create("profiles", {
      firstname,
      lastname,
      birthdate,
    });

    if (data.status === "error") {
      setIsLoading(false);
      setError("errorMessage", { type: "manual", message: data.message });
    } else {
      router.push("/fiches");
    }
  };

  console.log("errors", errors);

  return (
    <>
      <Layout>
        <PageTitle>Ajouter une nouvelle fiche élève</PageTitle>

        <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
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
              name="birthdate"
              control={control}
              defaultValue={null}
              rules={{ required: true }}
              render={(props) => (
                <DatePicker
                  minDate={subYears(new Date(), 11)}
                  maxDate={subYears(new Date(), 1)}
                  {...props}
                />
              )}
            />
          </FormControl>

          <ErrorMessage
            errors={errors}
            name="errorMessage"
            render={({ message }) => (
              <Stack isInline p={5} mb={5} shadow="md" color="red.500">
                <Icon name="warning" size={5} />
                <Box>
                  <Text>{message}</Text>
                </Box>
              </Stack>
            )}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            isDisabled={Object.keys(errors).length > 0}
          >
            Ajouter
          </Button>
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
