import { values } from "mobx";
import { Observer } from "mobx-react-lite";
import { isStateTreeNode } from "mobx-state-tree";
import { useState } from "react";
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
  Stack,
  Spinner,
  FormErrorMessage
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { useStore } from "tree";
import { handleError } from "utils/form";
import { ErrorMessageText } from "components";

export const ParentForm = (props) => {
  if (props.parent && !isStateTreeNode(props.parent)) {
    console.error("props.parent must be a model instance");
    return null;
  }

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

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    const request = (parent) =>
      parent
        ? parentType.store.updateParent(props.parent.edit(formData))
        : parentType.store.postParent(formData);
    const redirect = (parent) =>
      parent
        ? router.push("/parents/[...slug]", `/parents/${props.parent.slug}`)
        : router.push("/parents");
    const { data, error } = await request(props.parent);
    setIsLoading(false);
    if (error) handleError(error, setError);
    else if (props.onSubmit) props.onSubmit();
    else redirect(props.parent);
  };

  const mapProfile = (profile) => ({
    _id: profile._id,
    firstname: profile.firstname,
    lastname: profile.lastname
  });

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        id="firstname"
        isRequired
        isInvalid={!!errors["firstname"]}
        m={5}
        mt={0}
      >
        <FormLabel>Prénom</FormLabel>
        <Input
          name="firstname"
          placeholder="Prénom"
          ref={register({ required: "Veuillez saisir un prénom" })}
          defaultValue={props.parent && props.parent.firstname}
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
          defaultValue={props.parent && props.parent.lastname}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="lastname" />
        </FormErrorMessage>
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
          placeholder="adresse-email-du-parent@email.com"
          ref={register({
            required: "Veuillez saisir une adresse email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Adresse email invalide"
            }
          })}
          defaultValue={props.parent && props.parent.email}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="email" />
        </FormErrorMessage>
      </FormControl>

      <Observer>
        {() => (
          <FormControl
            m={5}
            mt={0}
            id="children"
            isInvalid={!!errors["children"]}
          >
            <FormLabel>Enfants</FormLabel>
            {profileType.store.isLoading ? (
              <Spinner />
            ) : (
              <Controller
                className="react-select-container"
                classNamePrefix="react-select"
                as={ReactSelect}
                name="children"
                control={control}
                defaultValue={
                  props.parent
                    ? props.parent.children.map(mapProfile)
                    : //: props.profiles
                      //? props.profiles.map(mapProfile)
                      []
                }
                placeholder="Sélectionner un ou plusieurs enfants"
                menuPlacement="top"
                isClearable
                isMulti
                isSearchable
                closeMenuOnSelect
                options={values(profileType.store.profiles).map(mapProfile)}
                getOptionLabel={(option) =>
                  `${option.firstname} ${option.lastname}`
                }
                getOptionValue={(option) => option._id}
                onChange={([option]) => option._id}
              />
            )}
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="children" />
            </FormErrorMessage>
          </FormControl>
        )}
      </Observer>

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
        {props.parent ? "Modifier le parent" : "Ajouter le parent"}
      </Button>
    </form>
  );
};
