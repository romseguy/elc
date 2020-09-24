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
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { DatePicker } from "components/datepicker";
import { subYears } from "date-fns";
import { useStore } from "tree";

export const ParentForm = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const { parentType } = useStore();

  if (props.parent && !isStateTreeNode(props.parent)) {
    console.error("props.parent must be a model instance");
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
    let res;

    const handleError = () => {
      setIsLoading(false);
      setError("apiErrorMessage", { type: "manual", message: res.message });
    };

    if (Object.keys(errors).length > 0) handleError();

    if (props.parent) {
      props.parent.merge(formData);
      res = await props.parent.update();
      if (res.status === "error") handleError();
      else router.push("/parents/[...slug]", `/parents/${props.parent.slug}`);
    } else {
      res = await parentType.store.postParent(formData);
      if (res.status === "error") handleError();
      else router.push("/parents");
    }
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired m={5} mt={0}>
        <FormLabel htmlFor="firstname">Prénom</FormLabel>
        <Input
          name="firstname"
          placeholder="Prénom"
          ref={register({ required: true })}
          defaultValue={(props.parent && props.parent.firstname) || ""}
        />
        <ErrorMessage
          errors={errors}
          name="firstname"
          message="Veuillez saisir un prénom"
        />
      </FormControl>

      <FormControl isRequired m={5} mt={0}>
        <FormLabel htmlFor="lastname">Nom</FormLabel>
        <Input
          name="lastname"
          placeholder="Nom"
          ref={register({ required: true })}
          defaultValue={(props.parent && props.parent.lastname) || ""}
        />
        <ErrorMessage
          errors={errors}
          name="lastname"
          message="Veuillez saisir un nom de famille"
        />
      </FormControl>

      <FormControl isRequired m={5} mt={0}>
        <FormLabel htmlFor="lastname">Adresse email</FormLabel>
        <Input
          name="email"
          placeholder="david@gmail.com"
          ref={register({
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Adresse email invalide",
            },
          })}
          defaultValue={(props.parent && props.parent.email) || ""}
        />
        <ErrorMessage
          errors={errors}
          name="email"
          message="Veuillez saisir un email"
        />
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
        {props.parent ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
