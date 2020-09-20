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

export const SkillForm = ({ skill }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const {
    skill: {
      store: { addSkill, setSkill },
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

    if (skill) {
      res = await setSkill({ ...formData, _id: skill._id });
    } else {
      res = await addSkill(formData);
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
      <FormControl isRequired m={5}>
        <FormLabel htmlFor="code">Code</FormLabel>
        <Input
          name="code"
          placeholder="L01"
          ref={register({ required: true })}
          defaultValue={(skill && skill.code) || ""}
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
          name="code"
          placeholder="J'écoute et je comprends des consignes"
          ref={register({ required: true })}
          defaultValue={(skill && skill.description) || ""}
        />
        <ErrorMessage
          errors={errors}
          name="description"
          message="Veuillez saisir une description"
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
        mt={5}
      >
        {skill ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
