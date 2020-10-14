import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { handleError } from "utils/form";
// import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { values } from "mobx";
import { useStore } from "tree";
import { subYears } from "date-fns";
import {
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
import { DatePicker } from "components";
import { ErrorMessageText } from "./error-message-text";

export const ProfileAddWorkshopForm = (props) => {
  const router = useRouter();
  const { profileType } = useStore();
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

  const onSubmit = async ({ workshop: workshopId }) => {
    setIsLoading(true);
    props.profile.addWorkshop({ workshopId });
    const { data, error } = await profileType.store.updateProfile(
      props.profile
    );
    setIsLoading(false);
    if (error) handleError(error, setError);
    else props.onSubmit();
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        id="workshop"
        isRequired
        isInvalid={!!errors.workshop}
        mb={5}
      >
        <FormLabel>Atelier</FormLabel>
        <Select
          name="workshop"
          placeholder="Sélectionner un atelier"
          ref={register({ required: "Veuillez sélectionner un atelier" })}
        >
          {values(props.workshops).map((workshop) => {
            return (
              <option key={workshop._id} value={workshop._id}>
                {workshop.name}
              </option>
            );
          })}
        </Select>
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="workshop" />
        </FormErrorMessage>
      </FormControl>

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
        mb={5}
      >
        Ajouter
      </Button>
    </form>
  );
};
