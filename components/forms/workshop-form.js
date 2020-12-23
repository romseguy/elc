import { useState } from "react";
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
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { handleError } from "utils/form";
import { ErrorMessageText } from "components";

export const WorkshopForm = (props) => {
  if (props.workshop && !isStateTreeNode(props.workshop)) {
    console.error("props.workshop must be a model instance");
    return null;
  }

  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const { skillType, workshopType } = useStore();

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
        <FormLabel>Nom de l'atelier :</FormLabel>
        <Input
          name="name"
          placeholder="Entrez le nom de l'atelier"
          ref={register({ required: "Veuillez saisir le nom de l'atelier" })}
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
              Compétences acquises une fois l'atelier terminé :
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
        {props.workshop ? "Modifier l'atelier" : "Ajouter"}
      </Button>
      {/* <DevTool control={control} /> */}
    </form>
  );
};
