import { useState } from "react";
import { useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { isStateTreeNode } from "mobx-state-tree";
import { useStore } from "tree";
import { ui2api } from "tree/observation/utils";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Stack,
  FormErrorMessage
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { handleError } from "utils/form";
import { ErrorMessageText } from "components";

export const ObservationForm = (props) => {
  if (props.observation && !isStateTreeNode(props.observation)) {
    console.error("props.observation must be a model instance");
    return null;
  }

  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const { observationType } = useStore();
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

  const onSubmit = async (form) => {
    const apiData = ui2api(form);
    const request = async (observation) =>
      observation
        ? observation.edit(apiData).update()
        : observationType.store.postObservation(apiData);
    const redirect = (observation) => router.push("/observations");

    setIsLoading(true);
    const { data, error } = await request(props.observation);
    setIsLoading(false);

    if (error) handleError(error, setError);
    else redirect(props.observation);
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
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
          placeholder="Description de l'observation"
          ref={register({ required: "Veuillez saisir une description" })}
          defaultValue={props.observation && props.observation.description}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="description" />
        </FormErrorMessage>
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
        {props.observation ? "Modifier l'observation" : "Ajouter"}
      </Button>
    </form>
  );
};
