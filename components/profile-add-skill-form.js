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

export const ProfileAddSkillForm = (props) => {
  const router = useRouter();
  const { profileType, skillType } = useStore();
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

  const onSubmit = async ({ skill, date }) => {
    setIsLoading(true);
    props.profile.addSkillRef({
      skill: skillType.store.getById(skill),
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
      <FormControl id="skill" isRequired isInvalid={!!errors.skill} mb={5}>
        <FormLabel>Compétence :</FormLabel>
        <Select
          name="skill"
          placeholder="Sélectionner une compétence"
          ref={register({ required: "Veuillez sélectionner une compétence" })}
          color="gray.400"
        >
          {values(props.skills).map((skill) => {
            return (
              <option key={skill._id} value={skill._id}>
                {skill.description} ({skill.code})
              </option>
            );
          })}
        </Select>
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="skill" />
        </FormErrorMessage>
      </FormControl>

      <FormControl id="date" isRequired isInvalid={!!errors.date} mb={5}>
        <FormLabel>
          Date à laquelle {props.profile.firstname} {props.profile.lastname} a
          validé cette compétence :
        </FormLabel>
        <Controller
          name="date"
          control={control}
          defaultValue={new Date()}
          rules={{
            required: "Veuillez saisir la date d'obtention de la compétence"
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
        Valider
      </Button>
    </form>
  );
};
