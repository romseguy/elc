import { useState } from "react";
import { useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { isStateTreeNode } from "mobx-state-tree";
import { useStore } from "tree";
import { domains, levels } from "tree/skill/skillType";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Select,
  Stack
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
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

    if (props.skill) {
      props.skill.fromUi(formData);
      res = await props.skill.update();
      setIsLoading(false);

      if (error) handleError(error, setError);
      else
        router.push(
          "/competences/[...slug]",
          `/competences/${props.skill.slug}`
        );
    } else {
      const { data, error } = await skillType.store.postSkill(formData);
      setIsLoading(false);

      if (data) router.push("/competences");
      else handleError(error, setError);
    }
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired m={5} mt={0}>
        <FormLabel htmlFor="code">Code</FormLabel>
        <Input
          name="code"
          placeholder="L01"
          ref={register({ required: true })}
          defaultValue={(props.skill && props.skill.code) || ""}
        />
        <ErrorMessage
          errors={errors}
          name="code"
          message="Veuillez saisir un code"
        />
      </FormControl>

      <FormControl isRequired m={5} mt={0}>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Input
          name="description"
          placeholder="J'écoute et je comprends des consignes"
          ref={register({ required: true })}
          defaultValue={(props.skill && props.skill.description) || ""}
        />
        <ErrorMessage
          errors={errors}
          name="description"
          message="Veuillez saisir une description"
        />
      </FormControl>

      <FormControl m={5} mt={0}>
        <FormLabel htmlFor="domain">Matière</FormLabel>
        <Select
          name="domain"
          placeholder="Sélectionner une matière"
          ref={register({ required: true })}
          defaultValue={
            props.skill && props.skill.domain !== "-" ? props.skill.domain : "-"
          }
        >
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl m={5} mt={0}>
        <FormLabel htmlFor="level">Niveau</FormLabel>
        <Select
          name="level"
          placeholder="Sélectionner un niveau"
          ref={register({ required: true })}
          defaultValue={
            props.skill && props.skill.level !== "-" ? props.skill.level : "-"
          }
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
