import { useState } from "react";
import { useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { isStateTreeNode } from "mobx-state-tree";
import { useStore } from "tree";
import { domains, levels } from "tree/workshop/workshopType";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Select,
  Stack,
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";

export const WorkshopForm = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const { workshopType } = useStore();

  if (props.workshop && !isStateTreeNode(props.workshop)) {
    console.error("props.workshop must be a model instance");
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
    let res;
    setIsLoading(true);

    const handleError = () => {
      setIsLoading(false);
      setError("apiErrorMessage", { type: "manual", message: res.message });
    };

    if (props.workshop) {
      props.workshop.merge(formData);
      res = await props.workshop.update();

      if (res.status === "error") handleError();
      else
        router.push(
          "/competences/[...slug]",
          `/competences/${props.workshop.slug}`
        );
    } else {
      res = await workshopType.store.postWorkshop(formData);

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
          defaultValue={(props.workshop && props.workshop.code) || ""}
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
          defaultValue={(props.workshop && props.workshop.description) || ""}
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
            props.workshop && props.workshop.domain !== "-"
              ? props.workshop.domain
              : "-"
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
            props.workshop && props.workshop.level !== "-"
              ? props.workshop.level
              : "-"
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
        {props.workshop ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
