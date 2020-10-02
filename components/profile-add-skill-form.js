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
import { ErrorMessageText } from "./error-message-text";

export const ProfileAddSkillForm = (props) => {
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

  const onSubmit = async ({ skill: _id, date }) => {
    setIsLoading(true);
    props.profile.addSkill({ _id, date });
    const { data, error } = await props.profile.update();
    setIsLoading(false);
    if (error) handleError(error, setError);
    else props.onSubmit();
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired mb={5}>
        <FormLabel htmlFor="skill">Compétence</FormLabel>
        <Select
          name="skill"
          placeholder="Sélectionner une compétence"
          ref={register({ required: true })}
          defaultValue={"-"}
        >
          {values(props.skills).map((skill) => {
            return (
              <option key={skill._id} value={skill._id}>
                {skill.code}
              </option>
            );
          })}
        </Select>
        <ErrorMessage
          errors={errors}
          name="skill"
          message="Veuillez sélectionner une compétence"
        />
      </FormControl>

      <FormControl isRequired mb={5}>
        <FormLabel htmlFor="date">Date</FormLabel>
        <Controller
          name="date"
          control={control}
          defaultValue={new Date()}
          rules={{ required: true }}
          render={(props) => (
            <DatePicker
              minDate={subYears(new Date(), 11)}
              maxDate={new Date()}
              {...props}
            />
          )}
        />
        <FormErrorMessage>
          <ErrorMessage
            errors={errors}
            name="date"
            message="Veuillez saisir la date d'obtention de la compétence"
          />
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
