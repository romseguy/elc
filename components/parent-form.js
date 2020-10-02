import { useEffect, useState } from "react";
import { isStateTreeNode } from "mobx-state-tree";
import { Controller, useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import ReactSelect from "react-select";
import { useRouter } from "next/router";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Stack,
  Spinner
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { useStore } from "tree";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import api from "utils/api";
import { handleError } from "utils/form";
import { ErrorMessageText } from "./error-message-text";

export const ParentForm = observer((props) => {
  const router = useRouter();
  const { profileType, parentType } = useStore();
  const [isLoading, setIsLoading] = useState();
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

  if (props.parent && !isStateTreeNode(props.parent)) {
    console.error("props.parent must be a model instance");
    return null;
  }

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);

    if (props.parent) {
      props.parent.fromUi(formData);
      const { error } = await props.parent.update();
      setIsLoading(false);

      if (error) handleError(error, setError);
      router.push("/parents/[...slug]", `/parents/${props.parent.slug}`);
    } else {
      const parent = { ...formData };

      if (formData.profiles) {
        parent.children = formData.profiles.map((profile) => profile._id);
      }

      const { data, error } = await parentType.store.postParent(parent);
      setIsLoading(false);

      if (data) router.push("/parents");
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
          defaultValue={(props.parent && props.parent.lastname) || ""}
        />
        <ErrorMessage
          errors={errors}
          name="lastname"
          message="Veuillez saisir un nom de famille"
        />
      </FormControl>

      <FormControl
        id="email"
        isRequired
        isInvalid={!!errors["email"]}
        m={5}
        mt={0}
      >
        <FormLabel>Adresse email</FormLabel>
        <Input
          name="email"
          placeholder="adresse-email-du-parent@gmail.com"
          ref={register({
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Adresse email invalide"
            }
          })}
          defaultValue={(props.parent && props.parent.email) || ""}
        />
        <ErrorMessage
          errors={errors}
          name="email"
          message="Veuillez saisir un email"
        />
      </FormControl>

      <FormControl m={5} mt={0} id="profiles" isInvalid={!!errors["profiles"]}>
        <FormLabel>Enfants</FormLabel>
        {profileType.store.isLoading ? (
          <Spinner />
        ) : (
          <Controller
            className="react-select-container"
            classNamePrefix="react-select"
            as={ReactSelect}
            name="profiles"
            control={control}
            defaultValue={props.parent ? props.parent.children : null}
            placeholder="Sélectionner un ou plusieurs enfants"
            menuPlacement="top"
            isClearable
            isMulti
            isSearchable
            closeMenuOnSelect
            options={values(profileType.store.profiles)}
            getOptionLabel={(option) =>
              `${option.firstname} ${option.lastname}`
            }
            getOptionValue={(option) => option._id}
            onChange={([option]) => option._id}
          />
        )}
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
        {props.parent ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
});
