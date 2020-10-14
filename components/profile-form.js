import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { isStateTreeNode } from "mobx-state-tree";
import { useStore } from "tree";
import { ui2api } from "tree/skill/utils";
import { format, subYears } from "date-fns";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Stack,
  FormErrorMessage,
  RequiredIndicator
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { DatePicker } from "components";
import { handleError } from "utils/form";
import { ErrorMessageText } from "./error-message-text";

export const ProfileForm = (props) => {
  if (props.profile && !isStateTreeNode(props.profile)) {
    console.error("props.profile must be a model instance");
    return null;
  }

  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const { profileType } = useStore();

  const {
    control,
    register,
    handleSubmit,
    watch,
    errors,
    setError,
    clearErrors
  } = useForm({
    mode: "onChange"
  });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form) => {
    const apiData = ui2api(form);
    const request = async (profile) =>
      profile
        ? profile.edit(apiData).update()
        : profileType.store.postProfile(apiData);
    const redirect = (profile) =>
      profile
        ? router.push("/fiches/[...slug]", `/fiches/${props.profile.slug}`)
        : router.push("/fiches");

    setIsLoading(true);
    const { data, error } = await request(props.profile);
    setIsLoading(false);

    if (error) handleError(error, setError);
    else redirect(props.profile);
  };

  return (
    <form method="post" onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        id="firstname"
        isRequired
        isInvalid={!!errors["firstname"]}
        m={5}
        mt={0}
      >
        <FormLabel>
          Prénom
          {/* <RequiredIndicator /> */}
        </FormLabel>
        <Input
          name="firstname"
          placeholder="Prénom"
          ref={register({ required: "Veuillez saisir un prénom" })}
          defaultValue={props.profile && props.profile.firstname}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="firstname" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="lastname"
        isRequired
        isInvalid={!!errors["lastname"]}
        m={5}
        mt={0}
      >
        <FormLabel>Nom</FormLabel>
        <Input
          name="lastname"
          placeholder="Nom"
          ref={register({ required: "Veuillez saisir un nom de famille" })}
          defaultValue={props.profile && props.profile.lastname}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="lastname" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="birthdate"
        isInvalid={!!errors["birthdate"]}
        m={5}
        mt={0}
      >
        <FormLabel>Date de naissance</FormLabel>
        <Controller
          name="birthdate"
          control={control}
          defaultValue={(props.profile && props.profile.birthdate) || null}
          render={(props) => (
            <DatePicker
              minDate={subYears(new Date(), 11)}
              maxDate={subYears(new Date(), 1)}
              placeholderText={format(new Date(), "dd/MM/yyyy")}
              {...props}
            />
          )}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="birthdate" />
        </FormErrorMessage>
      </FormControl>

      <ErrorMessage
        errors={errors}
        name="formErrorMessage"
        render={({ message }) => (
          <Stack isInline p={5} mb={5} shadow="md" color="red.500">
            <WarningIcon boxSize={5} />
            <Box>
              <ErrorMessageText>{message}</ErrorMessageText>
            </Box>
          </Stack>
        )}
      />

      <Button
        type="submit"
        isLoading={isLoading}
        isDisabled={Object.keys(errors).length > 0}
      >
        {props.profile ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
