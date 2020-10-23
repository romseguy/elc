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
  Stack,
  FormErrorMessage
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { DatePicker } from "components";
import { handleError } from "utils/form";
import { ErrorMessageText } from "./error-message-text";

export const ProfileAddObservationForm = (props) => {
  const router = useRouter();
  const { profileType, observationType } = useStore();
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

  const onSubmit = async ({ observation, date }) => {
    setIsLoading(true);
    props.profile.addObservationRef({
      observation: observationType.store.getById(observation),
      date
    });
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
        id="observation"
        isRequired
        isInvalid={!!errors.observation}
        mb={5}
      >
        <FormLabel>Observation :</FormLabel>
        <Select
          name="observation"
          placeholder="Sélectionner une observation"
          ref={register({ required: "Veuillez sélectionner une observation" })}
          color="gray.400"
        >
          {values(props.observations).map((observation) => {
            return (
              <option key={observation._id} value={observation._id}>
                {observation.description}
              </option>
            );
          })}
        </Select>
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="observation" />
        </FormErrorMessage>
      </FormControl>

      <FormControl id="date" isRequired isInvalid={!!errors.date} mb={5}>
        <FormLabel>Date :</FormLabel>
        <Controller
          name="date"
          control={control}
          defaultValue={new Date()}
          rules={{
            required: "Veuillez saisir la date d'observation"
          }}
          render={(props) => (
            <DatePicker
              minDate={subYears(new Date(), 11)}
              maxDate={new Date()}
              {...props}
            />
          )}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="date" />
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
        Associer
      </Button>
    </form>
  );
};
