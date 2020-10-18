import { values } from "mobx";
import { Observer } from "mobx-react-lite";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { isStateTreeNode } from "mobx-state-tree";
import { useStore } from "tree";
import { levels, ui2api } from "tree/skill/utils";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Text,
  Select,
  Stack,
  FormErrorMessage,
  IconButton,
  InputGroup,
  InputRightAddon,
  Spinner
} from "@chakra-ui/core";
import { AddIcon, CheckIcon, MinusIcon, WarningIcon } from "@chakra-ui/icons";
import { handleError } from "utils/form";
import { ErrorMessageText } from "components";

export const SkillForm = (props) => {
  if (props.skill && !isStateTreeNode(props.skill)) {
    console.error("props.skill must be a model instance");
    return null;
  }

  const router = useRouter();
  const [isLoading, setIsLoading] = useState();
  const [showAddDomainForm, setShowAddDomainForm] = useState();
  const toggleShowAddDomainForm = () =>
    setShowAddDomainForm(!showAddDomainForm);
  const [showRemoveDomainForm, setShowRemoveDomainForm] = useState();
  const toggleShowRemoveDomainForm = () =>
    setShowRemoveDomainForm(!showRemoveDomainForm);
  const [domainId, setDomainId] = useState();
  const { skillType } = useStore();
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

  const newDomainValue = watch("newDomain");
  const oldDomainValue = watch("oldDomain");

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form) => {
    const apiData = ui2api(form);
    const request = async (skill) =>
      skill ? skill.edit(apiData).update() : skillType.store.postSkill(apiData);
    const redirect = (skill) =>
      skill
        ? router.push("/competences/[...slug]", `/competences/${skill.slug}`)
        : router.push("/competences");

    setIsLoading(true);
    const { data, error } = await request(props.skill);
    setIsLoading(false);

    if (error) handleError(error, setError);
    else redirect(props.skill);
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="code" isRequired isInvalid={!!errors.code} m={5} mt={0}>
        <FormLabel>Code</FormLabel>
        <Input
          name="code"
          placeholder="L01"
          ref={register({ required: "Veuillez saisir un code" })}
          defaultValue={props.skill && props.skill.code}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="code" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="description"
        isRequired
        isInvalid={!!errors.description}
        m={5}
        mt={0}
      >
        <FormLabel>Description</FormLabel>
        <Input
          name="description"
          placeholder="J'écoute et je comprends des consignes"
          ref={register({ required: "Veuillez saisir une description" })}
          defaultValue={props.skill && props.skill.description}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="description" />
        </FormErrorMessage>
      </FormControl>

      {/* Select domain */}
      <Observer>
        {() => (
          <FormControl id="domain" m={5} mt={0}>
            <FormLabel>Matière</FormLabel>

            <Select
              name="domain"
              placeholder="Sélectionner une matière"
              ref={register()}
              defaultValue={
                props.skill && props.skill.domain && props.skill.domain._id
              }
            >
              {values(skillType.domainType.store.domains).map((domain) => (
                <option key={domain._id} value={domain._id}>
                  {domain.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
      </Observer>

      {/* Add domain */}
      <Box ml={5}>
        <Button
          mb={2}
          variant="outline"
          size="xs"
          onClick={() => {
            setShowRemoveDomainForm(false);
            toggleShowAddDomainForm();
          }}
        >
          Ajouter une matière
          {showAddDomainForm ? <MinusIcon ml={2} /> : <AddIcon ml={2} />}
        </Button>

        {showAddDomainForm && (
          <FormControl id="newDomain" my={2} isInvalid={!!errors.newDomain}>
            <InputGroup>
              <Input
                id="newDomain"
                name="newDomain"
                ref={register({
                  required: "Veuillez saisir un libellé de matière"
                })}
                size="xs"
                width="50%"
                placeholder="Français"
              />
              <InputRightAddon
                children={
                  <IconButton
                    id="newDomainSubmit"
                    icon={<CheckIcon />}
                    size="xs"
                    onClick={async () => {
                      const {
                        data,
                        error
                      } = await skillType.domainType.store.postDomain({
                        name: newDomainValue
                      });
                      if (error) handleError(error, setError);
                      else setShowAddDomainForm(false);
                    }}
                  />
                }
              />
            </InputGroup>
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="newDomain" />
            </FormErrorMessage>
          </FormControl>
        )}
      </Box>

      {/* Remove domain */}
      <Observer>
        {() => (
          <Box ml={5} mb={5}>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                setShowAddDomainForm(false);
                toggleShowRemoveDomainForm();
              }}
            >
              Supprimer une matière{" "}
              {showRemoveDomainForm ? <MinusIcon ml={2} /> : <AddIcon ml={2} />}
            </Button>
            {showRemoveDomainForm && skillType.domainType.store.isLoading && (
              <Spinner />
            )}
            {showRemoveDomainForm && !skillType.domainType.store.isLoading && (
              <FormControl my={2} id="oldDomain" isInvalid={!!errors.oldDomain}>
                <InputGroup>
                  <Select
                    name="oldDomain"
                    ref={register()}
                    size="xs"
                    width="50%"
                    placeholder="Sélectionner une matière"
                  >
                    {values(skillType.domainType.store.domains).map(
                      (domain) => (
                        <option key={domain._id} value={domain._id}>
                          {domain.name}
                        </option>
                      )
                    )}
                  </Select>
                  <InputRightAddon
                    children={
                      <IconButton
                        icon={<CheckIcon />}
                        size="xs"
                        onClick={async () => {
                          const {
                            error,
                            data
                          } = await skillType.domainType.store.removeDomain({
                            _id: oldDomainValue
                          });
                          if (error) handleError(error, setError);
                          else {
                            setShowRemoveDomainForm(false);
                          }
                        }}
                      />
                    }
                  />
                </InputGroup>
              </FormControl>
            )}
          </Box>
        )}
      </Observer>

      <FormControl id="level" m={5} mt={0}>
        <FormLabel>Niveau</FormLabel>
        <Select
          name="level"
          placeholder="Sélectionner un niveau"
          ref={register()}
          defaultValue={props.skill && props.skill.level}
        >
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
      </FormControl>

      <ErrorMessage
        errors={errors}
        name="formErrorMessage"
        render={({ message }) => (
          <Stack isInline p={5} mb={5} shadow="md" color="red.500">
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
      >
        {props.skill ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
