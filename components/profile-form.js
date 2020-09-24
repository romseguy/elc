import { useState } from "react";
import { isStateTreeNode } from "mobx-state-tree";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
// import { DevTool } from "@hookform/devtools";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Stack,
  FormErrorMessage,
  RequiredIndicator,
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { DatePicker } from "components/datepicker";
import { format, subYears } from "date-fns";
import { useStore } from "tree";

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
    clearErrors,
  } = useForm({
    mode: "onChange",
  });

  const onChange = () => {
    clearErrors("apiErrorMessage");
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    let res = {};

    const handleError = () => {
      setIsLoading(false);
      setError("apiErrorMessage", { type: "manual", message: res.message });
    };

    if (Object.keys(errors).length > 0) handleError();

    if (props.profile) {
      props.profile.merge(formData);
      res = await props.profile.update();
      if (res.status === "error") handleError();
      else router.push("/fiches/[...slug]", `/fiches/${props.profile.slug}`);
    } else {
      res = await profileType.store.postProfile(formData);
      if (res.status === "error") handleError();
      else router.push("/fiches");
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
        name="apiErrorMessage"
        render={({ message }) => (
          <Stack isInline p={5} mb={5} shadow="md" color="red.500">
            <WarningIcon boxSize={5} />
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
        {props.profile ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
