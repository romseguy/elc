import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
//import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import ReactSelect from "react-select";
import { useRouter } from "next/router";
import { values } from "mobx";
import { Observer } from "mobx-react-lite";
import { isStateTreeNode } from "mobx-state-tree";
import { useStore } from "tree";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Select,
  Stack,
  Spinner,
  FormErrorMessage
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { handleError } from "utils/form";
import { ErrorMessageText } from "./error-message-text";

export const WorkshopForm = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const { skillType, workshopType } = useStore();

  if (props.workshop && !isStateTreeNode(props.workshop)) {
    console.error("props.workshop must be a model instance");
    return null;
  }

  useEffect(() => {
    const fetch = async () => {
      await skillType.store.getSkills();
    };

    fetch();
  }, []);

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
    const request = (workshop) =>
      workshop
        ? workshopType.store.updateWorkshop(props.workshop.edit(formData))
        : workshopType.store.postWorkshop(formData);
    const redirect = (workshop) =>
      workshop
        ? router.push("/ateliers/[...slug]", `/ateliers/${props.workshop.slug}`)
        : router.push("/ateliers");
    const { data, error } = await request(props.workshop);
    setIsLoading(false);
    if (error) handleError(error, setError);
    else redirect(props.workshop);
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        id="name"
        isRequired
        m={5}
        mt={0}
        isInvalid={!!errors["name"]}
      >
        <FormLabel>Nom</FormLabel>
        <Input
          name="name"
          placeholder="Compter jusqu'à 10"
          ref={register({ required: "Veuillez saisir un nom" })}
          defaultValue={props.workshop && props.workshop.name}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="name" />
        </FormErrorMessage>
      </FormControl>

      <Observer>
        {() => (
          <FormControl m={5} mt={0} id="skills" isInvalid={!!errors["skills"]}>
            <FormLabel>
              Compétences pouvant être acquises au cours de cet atelier
            </FormLabel>
            {skillType.store.isLoading ? (
              <Spinner />
            ) : (
              <Controller
                className="react-select-container"
                classNamePrefix="react-select"
                as={ReactSelect}
                name="skills"
                control={control}
                defaultValue={(props.workshop && props.workshop.skills) || []}
                placeholder="Sélectionner une ou plusieurs compétences"
                menuPlacement="top"
                isClearable
                isMulti
                isSearchable
                closeMenuOnSelect
                options={values(skillType.store.skills)}
                getOptionLabel={(option) =>
                  `${option.description} (${option.code})`
                }
                getOptionValue={(option) => option._id}
                onChange={([option]) => option._id}
              />
            )}
          </FormControl>
        )}
      </Observer>

      <ErrorMessage
        errors={errors}
        name="formErrorMessage"
        render={({ message }) => (
          <Stack isInline p={5} mb={5} shadow="md" color="red.600">
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
        {props.workshop ? "Modifier" : "Ajouter"}
      </Button>
      {/* <DevTool control={control} /> */}
    </form>
  );
};
