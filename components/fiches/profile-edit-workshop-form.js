import { values } from "mobx";
import { useStore } from "tree";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { handleError } from "utils/form";
import { format, subYears } from "date-fns";
import {
  Box,
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
  Stack,
  useDisclosure
} from "@chakra-ui/core";
import { ArrowDownIcon, ArrowUpIcon, WarningIcon } from "@chakra-ui/icons";
import { DatePicker, ErrorMessageText, WorkshopForm } from "components";

export const ProfileEditWorkshopForm = ({
  currentWorkshopRef,
  profile,
  ...props
}) => {
  if (!currentWorkshopRef || !currentWorkshopRef.workshop) return null;

  const { profileType, observationType } = useStore();
  const [showWorkshopForm, setShowWorkshopForm] = useState();
  const toggleShowWorkshopForm = (e) => setShowWorkshopForm(!showWorkshopForm);
  const { isOpen, onOpen, ...disclosure } = useDisclosure({
    defaultIsOpen: false
  });
  const onClose = () => (disclosure.onClose(), props.onClose());
  const [isLoading, setIsLoading] = useState(false);
  const [
    showAddObservationControls,
    setShowAddObservationControls
  ] = useState();
  const [newObservation, setNewObservation] = useState();
  const toggleShowAddObservationControls = () =>
    setShowAddObservationControls(!showAddObservationControls);
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
    if (currentWorkshopRef) onOpen();
    else onClose();
  }, [currentWorkshopRef]);

  const onChange = (e) => {
    clearErrors("formErrorMessage");
  };
  const onSubmit = async (formData) => {
    setIsLoading(true);
    const { workshop } = currentWorkshopRef;

    if (formData.completed)
      workshop.skills.forEach((skill) =>
        profile.addSkillRef({
          skill,
          workshop,
          date: formData.completed
        })
      );

    currentWorkshopRef.edit(formData);
    const { data, error } = await profileType.store.updateProfile(profile);
    setIsLoading(false);

    if (error) handleError(error, setError);
    else props.onSubmit();
  };
  const started = watch("started", currentWorkshopRef.started);
  const completed = watch("completed", currentWorkshopRef.completed);

  return (
    <Drawer placement="bottom" isFullHeight isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader>
            Atelier {currentWorkshopRef.workshop.name}
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
              <FormControl id="started" isInvalid={!!errors["started"]}>
                <FormLabel>
                  Date à laquelle {profile.firstname} {profile.lastname} a
                  commencé cet atelier :
                </FormLabel>
                <Controller
                  name="started"
                  control={control}
                  defaultValue={currentWorkshopRef.started}
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
                  <ErrorMessage errors={errors} name="started" />
                </FormErrorMessage>
              </FormControl>

              <FormControl
                id="completed"
                isInvalid={!!errors["completed"]}
                isDisabled={!started}
                mt={2}
              >
                <FormLabel>
                  Date à laquelle {profile.firstname} {profile.lastname} a
                  terminé l'atelier :
                </FormLabel>
                <Controller
                  name="completed"
                  control={control}
                  defaultValue={currentWorkshopRef.completed}
                  render={(props) => (
                    <DatePicker
                      minDate={started}
                      maxDate={new Date()}
                      placeholderText={format(new Date(), "dd/MM/yyyy")}
                      {...props}
                    />
                  )}
                />
                <FormErrorMessage>
                  <ErrorMessage errors={errors} name="completed" />
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
                {completed
                  ? "Terminer l'atelier"
                  : started
                  ? "Commencer l'atelier"
                  : "Modifier"}
              </Button>
            </form>

            <>
              <Button
                isLoading={isLoading}
                isDisabled={Object.keys(errors).length > 0}
                colorScheme="blue"
                onClick={toggleShowWorkshopForm}
                mb={5}
              >
                Modifier l'atelier {currentWorkshopRef.workshop.name}
                {showWorkshopForm ? (
                  <ArrowUpIcon ml={2} />
                ) : (
                  <ArrowDownIcon ml={2} />
                )}
              </Button>

              {showWorkshopForm && (
                <WorkshopForm workshop={currentWorkshopRef.workshop} />
              )}
            </>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
