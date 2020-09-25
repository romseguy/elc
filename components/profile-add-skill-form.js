import { Controller, useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import {
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Select,
  Stack,
  useTheme,
  useColorMode,
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { DatePicker } from "components/datepicker";
import { useRouter } from "next/router";
import { subYears } from "date-fns";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";
import { getSnapshot, useStore } from "tree";
import { values } from "mobx";

export const ProfileAddSkillForm = (props) => {
  const { colorMode } = useColorMode();
  const theme = useTheme()[colorMode || "dark"];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const { profileType } = useStore();

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

  const onSubmit = async ({ skill: _id, date }) => {
    const handleError = () => {
      setIsLoading(false);
      setError("apiErrorMessage", { type: "manual", message: res.message });
    };

    setIsLoading(true);

    await props.profile.addSkill({ _id, date });
    const res = props.profile.update();

    if (res.status === "error") handleError();
    else props.onSubmit();
  };

  return (
    <form
      className="mb-8"
      onChange={onChange}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl isRequired m={5} mt={0}>
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

      <FormControl isRequired m={5} mt={0}>
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
        <ErrorMessage
          errors={errors}
          name="date"
          message="Veuillez saisir la date d'obtention de la compétence"
        />
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
        Ajouter
      </Button>
    </form>
  );
};