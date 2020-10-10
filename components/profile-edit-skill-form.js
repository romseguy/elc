import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useDisclosure
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { DatePicker } from "components";
import { format, subYears } from "date-fns";
import { ErrorMessageText } from "./error-message-text";
import { handleError } from "utils/form";

export const ProfileEditSkillForm = ({
  currentSkillRef,
  setCurrentSkillRef,
  selectedProfile
}) => {
  if (!currentSkillRef) return null;

  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
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
    setIsLoading(true);
    currentSkillRef.fromUi(formData);
    const { data, error } = await selectedProfile.update();
    if (error) handleError(error);
    setIsLoading(false);
  };
  const onModalClose = () => setCurrentSkillRef();

  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            {/* Modification de la compétence acquise par
            {selectedProfile.firstname} {selectedProfile.lastname} */}
          </ModalHeader>
          <ModalCloseButton />
          <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              {["code", "description"].map((name) => (
                <FormControl
                  key={name}
                  id={name}
                  isInvalid={!!errors[name]}
                  ml={5}
                  mb={5}
                  isDisabled
                >
                  <FormLabel>
                    {name.substr(0, 1).toUpperCase()}
                    {name.substr(1, name.length)} de la compétence
                  </FormLabel>

                  <Input
                    name={name}
                    ref={register()}
                    defaultValue={currentSkillRef.skill[name]}
                  />
                  <FormErrorMessage>
                    <ErrorMessage errors={errors} name={name} />
                  </FormErrorMessage>
                </FormControl>
              ))}

              <FormControl id="date" isInvalid={!!errors["date"]} m={5} mt={0}>
                <FormLabel>Date d'acquisition de la compétence</FormLabel>
                <Controller
                  name="date"
                  control={control}
                  defaultValue={currentSkillRef.date || null}
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
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isLoading}
                isDisabled={Object.keys(errors).length > 0}
              >
                Modifier
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
