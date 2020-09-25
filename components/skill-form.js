import { useState } from "react";
import { isStateTreeNode } from "mobx-state-tree";
import { useForm } from "react-hook-form";
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
  useTheme,
  useColorMode,
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { Select } from "./select";
import { useStore } from "tree";
import { domains, levels } from "tree/skill";

export const SkillForm = (props) => {
  const { colorMode } = useColorMode();
  const theme = useTheme()[colorMode || "dark"];
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

    if (props.skill) {
      props.skill.merge(formData);
      res = await props.skill.update();

      if (res.status === "error") handleError();
      else
        router.push(
          "/competences/[...slug]",
          `/competences/${props.skill.slug}`
        );
    } else {
      res = await skillType.store.postSkill(formData);

      if (res.status === "error") handleError();
      else router.push("/competences");
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
          colorMode={colorMode}
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
          colorMode={colorMode}
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
        {props.skill ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
