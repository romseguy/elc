import { useMemo } from "react";
import { values } from "mobx";
import { format, isDate } from "date-fns";
import { IconButton, Text } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Table } from "components";

export const ObservationTable = ({
  withConfirm,
  editAction,
  removeAction,
  profile,
  display,
  css,
  ...props
}) => {
  const disableSortBy = useMemo(
    () => profile.observations.length <= 1,
    [profile.observations],
    [profile.observations]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        sortType: "basic",
        disableSortBy
      },
      {
        Header: "Atelier",
        accessor: "workshop",
        sortType: "basic",
        disableSortBy
      },
      {
        Header: "Description",
        accessor: "description",
        disableSortBy
      },
      {
        Header: "",
        accessor: "editButton",
        disableSortBy: true
      },
      {
        Header: "",
        accessor: "deleteButton",
        disableSortBy: true
      }
    ],
    [disableSortBy]
  );

  const data =
    /* useMemo(
    () => */
    values(profile.observations).map((observationRef) => {
      const { _id, observation, date, workshop } = observationRef;

      return {
        description: observation.description,
        date: isDate(date) && format(date, "dd/MM/yyyy"),
        workshop: workshop && workshop.name,
        editButton: (
          <IconButton
            id="editObservation"
            icon={<EditIcon />}
            onClick={() => editAction(observationRef)}
          />
        ),
        deleteButton: (
          <IconButton
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={withConfirm({
              header: `Êtes vous sûr(e) ?`,
              body: (
                <>
                  <Text>
                    Veuillez confirmer la suppression de l'observation :
                  </Text>
                  <Text my={2}>
                    <strong>{observationRef.observation.description}</strong>
                  </Text>
                  <Text>
                    {" "}
                    de la fiche élève de {profile.firstname} {profile.lastname}{" "}
                    :
                  </Text>
                </>
              ),
              onConfirm: () => removeAction(observationRef)
            })}
          />
        )
      };
    }); /* ,
    [profile]
  );
 */
  return (
    <Table
      css={{
        display,
        ...css
      }}
      initialState={{
        sortBy: [
          {
            id: "date",
            desc: true
          }
        ]
      }}
      data={data}
      columns={columns}
      {...props}
    />
  );
};
