import { Controller, useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Icon,
  Stack,
} from "@chakra-ui/core";
import { DatePicker } from "components/datepicker";
import { useRouter } from "next/router";
import { subYears } from "date-fns";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";
import { useStore } from "tree";

export const ProfileForm = ({ profile }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const {
    profile: {
      store: { addProfile, setProfile },
    },
  } = useStore();

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

    if (profile) {
      res = await setProfile({ ...formData, _id: profile._id });
    } else {
      res = await addProfile(formData);
    }

    if (res.status === "error") {
      setIsLoading(false);
      setError("apiErrorMessage", { type: "manual", message: res.message });
    } else {
      router.push("/fiches");
    }
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired p={5}>
        <FormLabel htmlFor="firstname">Prénom</FormLabel>
        <Input
          name="firstname"
          placeholder="Prénom"
          ref={register({ required: true })}
          defaultValue={(profile && profile.firstname) || ""}
        />
        <ErrorMessage
          errors={errors}
          name="firstname"
          message="Veuillez saisir un prénom"
        />
      </FormControl>

      <FormControl isRequired p={5} pt={0}>
        <FormLabel htmlFor="firstname">Nom</FormLabel>
        <Input
          name="lastname"
          placeholder="Nom"
          ref={register({ required: true })}
          defaultValue={(profile && profile.lastname) || ""}
        />
        <ErrorMessage
          errors={errors}
          name="lastname"
          message="Veuillez saisir un nom de famille"
        />
      </FormControl>

      <FormControl isRequired p={5} pt={0}>
        <FormLabel htmlFor="birthdate">Date de naissance</FormLabel>
        <Controller
          name="birthdate"
          control={control}
          defaultValue={(profile && profile.birthdate) || ""}
          rules={{ required: true, message: "yolo" }}
          render={(props) => (
            <DatePicker
              minDate={subYears(new Date(), 11)}
              maxDate={subYears(new Date(), 1)}
              {...props}
            />
          )}
        />
        <ErrorMessage
          errors={errors}
          name="birthdate"
          message="Veuillez saisir une date de naissance"
        />
      </FormControl>

      <ErrorMessage
        errors={errors}
        name="apiErrorMessage"
        render={({ message }) => (
          <Stack isInline p={5} mb={5} shadow="md" color="red.500">
            <Icon name="warning" size={5} />
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
        {profile ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
