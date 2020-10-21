import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerCloseButton,
  Drawer,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useDisclosure
} from "@chakra-ui/core";
import { ArrowDownIcon, ArrowUpIcon, WarningIcon } from "@chakra-ui/icons";
import { DatePicker, SkillForm } from "components";
import { format, subYears } from "date-fns";
import { ErrorMessageText } from "./error-message-text";
import { handleError } from "utils/form";

export const ProfileEditSkillForm = ({
  currentSkillRef,
  profile,
  ...props
}) => {
  if (!currentSkillRef) return null;

  const [showSkillForm, setShowSkillForm] = useState();
  const toggleShowSkillForm = (e) => setShowSkillForm(!showSkillForm);
  const { isOpen, onOpen, ...disclosure } = useDisclosure({
    defaultIsOpen: false
  });
  const onClose = () => (disclosure.onClose(), props.onClose());
  const [isLoading, setIsLoading] = useState(false);
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
  useEffect(() => {
    if (currentSkillRef) onOpen();
    else onClose();
  }, [currentSkillRef]);

  const onChange = (e) => {
    clearErrors("formErrorMessage");
  };
  const onSubmit = async (formData) => {
    // todo
    setIsLoading(true);
    setIsLoading(false);

    const { data, error } = {};

    if (error) handleError(error, setError);
    else props.onSubmit();
  };

  return (
    <Drawer placement="bottom" isFullHeight isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader>
            {/* Modification de la compétence acquise par
            {profile.firstname} {profile.lastname} */}
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
              <FormControl id="date" isInvalid={!!errors["date"]}>
                <FormLabel>
                  Date de la validation de la compétence{" "}
                  {currentSkillRef.skill.code} :
                </FormLabel>
                <Controller
                  name="date"
                  control={control}
                  defaultValue={currentSkillRef.date}
                  render={(props) => (
                    <DatePicker
                      minDate={subYears(new Date(), 1)}
                      maxDate={new Date()}
                      placeholderText={format(new Date(), "dd/MM/yyyy")}
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
                my={5}
              >
                Modifier
              </Button>
            </form>

            <>
              <Button
                isLoading={isLoading}
                isDisabled={Object.keys(errors).length > 0}
                colorScheme="blue"
                onClick={toggleShowSkillForm}
                mb={5}
              >
                Modifier la compétence {currentSkillRef.skill.code}
                {showSkillForm ? (
                  <ArrowUpIcon ml={2} />
                ) : (
                  <ArrowDownIcon ml={2} />
                )}
              </Button>

              {showSkillForm && <SkillForm skill={currentSkillRef.skill} />}
            </>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
