import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  Stack
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

  const onSubmit = async ({ workshop: _id }) => {
    setIsLoading(true);
    props.profile.addWorkshop({ _id });
    const { data, error } = await props.profile.update();
    setIsLoading(false);
    if (error) handleError(error, setError);
    else props.onSubmit();
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired mb={5}>
        <FormLabel htmlFor="workshop">Atelier</FormLabel>
        <Select
          name="workshop"
          placeholder="Sélectionner un atelier"
          ref={register({ required: true })}
          defaultValue={null}
        >
          {values(props.workshops).map((workshop) => {
            return (
              <option key={workshop._id} value={workshop._id}>
                {workshop.name}
              </option>
            );
          })}
        </Select>
        <ErrorMessage
          as={ErrorMessageText}
          errors={errors}
          name="workshop"
          message="Veuillez sélectionner un atelier"
        />
      </FormControl>

      <ErrorMessage
        errors={errors}
        name="formErrorMessage"
        render={({ message }) => (
          <Stack isInline p={5} mb={5} shadow="md" color="red.600">
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
        mb={5}
      >
        Ajouter
      </Button>
    </form>
  );
};