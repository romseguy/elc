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

export const ProfileEditObservationForm = ({
  currentObservationRef,
  onModalClose,
  selectedProfile,
  ...props
}) => {
  if (!currentObservationRef) return null;

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
    if (currentObservationRef) onOpen();
    else onClose();
  }, [currentObservationRef]);

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
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            {/* Modification de l'observation acquise par
            {selectedProfile.firstname} {selectedProfile.lastname} */}
          </ModalHeader>
          <ModalCloseButton />
          <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              {["description"].map((name) => (
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
                    {name.substr(1, name.length)} de l'observation
                  </FormLabel>

                  <Input
                    name={name}
                    ref={register()}
                    defaultValue={currentObservationRef.observation[name]}
                  />
                  <FormErrorMessage>
                    <ErrorMessage errors={errors} name={name} />
                  </FormErrorMessage>
                </FormControl>
              ))}

              <FormControl id="date" isInvalid={!!errors["date"]} m={5} mt={0}>
                <FormLabel>Date de l'observation</FormLabel>
                <Controller
                  name="date"
                  control={control}
                  defaultValue={currentObservationRef.date}
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
