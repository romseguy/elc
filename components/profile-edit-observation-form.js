import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerCloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useDisclosure
} from "@chakra-ui/core";
import { ArrowDownIcon, ArrowUpIcon, WarningIcon } from "@chakra-ui/icons";
import { DatePicker, ObservationForm } from "components";
import { format, subYears } from "date-fns";
import { ErrorMessageText } from "./error-message-text";
import { handleError } from "utils/form";

export const ProfileEditObservationForm = ({
  currentObservationRef,
  selectedProfile,
  ...props
}) => {
  if (!currentObservationRef) return null;

  const [showObservationForm, setShowObservationForm] = useState();
  const toggleShowObservationForm = (e) =>
    setShowObservationForm(!showObservationForm);
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
    <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader>
            {/* Modification de l'observation acquise par
            {selectedProfile.firstname} {selectedProfile.lastname} */}
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
              {/* {["description"].map((name) => (
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
              ))} */}

              <FormControl id="date" isInvalid={!!errors["date"]}>
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
                onClick={toggleShowObservationForm}
                mb={5}
              >
                Modifier l'observation
                {showObservationForm ? (
                  <ArrowUpIcon ml={2} />
                ) : (
                  <ArrowDownIcon ml={2} />
                )}
              </Button>

              {showObservationForm && (
                <ObservationForm
                  observation={currentObservationRef.observation}
                />
              )}
            </>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
