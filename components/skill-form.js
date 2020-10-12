import { useState } from "react";
import { useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { isStateTreeNode } from "mobx-state-tree";
import { useStore } from "tree";
import { domains, levels, uiToApi } from "tree/skill/skillType";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Select,
  Stack,
  FormErrorMessage
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { handleError } from "utils/form";
import { ErrorMessageText } from "./error-message-text";

export const SkillForm = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const { skillType } = useStore();

  if (props.skill && !isStateTreeNode(props.skill)) {
    console.error("props.skill must be a model instance");
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
    const apiData = uiToApi(formData);
    const request = async (skill) =>
      skill ? skill.edit(apiData) : skillType.store.postSkill(apiData);
    const redirect = (skill) =>
      skill
        ? router.push("/competences/[...slug]", `/competences/${skill.slug}`)
        : router.push("/competences");
    const { data, error } = await request(props.skill);
    setIsLoading(false);
    if (error) handleError(error, setError);
    else redirect(props.skill);
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="code" isRequired isInvalid={!!errors.code} m={5} mt={0}>
        <FormLabel>Code</FormLabel>
        <Input
          name="code"
          placeholder="L01"
          ref={register({ required: "Veuillez saisir un code" })}
          defaultValue={props.skill && props.skill.code}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="code" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="description"
        isRequired
        isInvalid={!!errors.description}
        m={5}
        mt={0}
      >
        <FormLabel>Description</FormLabel>
        <Input
          name="description"
          placeholder="J'écoute et je comprends des consignes"
          ref={register({ required: "Veuillez saisir une description" })}
          defaultValue={props.skill && props.skill.description}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="description" />
        </FormErrorMessage>
      </FormControl>

      <FormControl id="domain" m={5} mt={0}>
        <FormLabel>Matière</FormLabel>
        <Select
          name="domain"
          placeholder="Sélectionner une matière"
          ref={register()}
          defaultValue={props.skill && props.skill.domain}
        >
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl id="level" m={5} mt={0}>
        <FormLabel>Niveau</FormLabel>
        <Select
          name="level"
          placeholder="Sélectionner un niveau"
          ref={register()}
          defaultValue={props.skill && props.skill.level}
        >
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
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
        {props.skill ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
