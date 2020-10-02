import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { isStateTreeNode } from "mobx-state-tree";
import { useStore } from "tree";
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const { profileType } = useStore();

  if (props.profile && !isStateTreeNode(props.profile)) {
    console.error("props.profile must be a model instance");
    return null;
  }

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

  const onSubmit = async (formData) => {
    setIsLoading(true);

    if (props.profile) {
      props.profile.fromUi(formData);
      const { error } = await props.profile.update();
      setIsLoading(false);

      if (error) handleError(error, setError);
      else router.push("/fiches/[...slug]", `/fiches/${props.profile.slug}`);
    } else {
      const { data, error } = await profileType.store.postProfile(formData);
      setIsLoading(false);

      if (data) router.push("/fiches");
      else handleError(error, setError);
    }
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
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
          ref={register({ required: true })}
          defaultValue={(props.profile && props.profile.firstname) || ""}
        />
        <FormErrorMessage>
          <ErrorMessage
            errors={errors}
            name="firstname"
            message="Veuillez saisir un prénom"
          />
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
          ref={register({ required: true })}
          defaultValue={(props.profile && props.profile.lastname) || ""}
        />
        <FormErrorMessage>
          <ErrorMessage
            errors={errors}
            name="lastname"
            message="Veuillez saisir un nom de famille"
          />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="birthdate"
        isRequired
        isInvalid={!!errors["birthdate"]}
        m={5}
        mt={0}
      >
        <FormLabel>Date de naissance</FormLabel>
        <Controller
          name="birthdate"
          control={control}
          defaultValue={(props.profile && props.profile.birthdate) || ""}
          rules={{ required: true }}
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
          <ErrorMessage
            errors={errors}
            name="birthdate"
            message="Veuillez saisir une date de naissance"
          />
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
