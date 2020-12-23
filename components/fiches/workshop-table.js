import { useMemo } from "react";
import { values } from "mobx";
import { format, isDate } from "date-fns";
import { IconButton, Tag, Text } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Table } from "components";

export const WorkshopTable = ({
  withConfirm,
  editAction,
  removeAction,
  profile,
  display,
  css,
  ...props
}) => {
  const disableSortBy = useMemo(() => profile.workshops.length <= 1, [
    profile.workshops
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "Nom",
        accessor: "name",
        disableSortBy
      },
      {
        Header: "Date de début",
        accessor: "started",
        sortType: "basic",
        disableSortBy
      },
      {
        Header: "Date de fin",
        accessor: "completed",
        sortType: "basic",
        disableSortBy
      },
      {
        Header: "Compétences",
        accessor: "skills",
        disableSortBy: true
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

  const data = /* useMemo(
    () =>
 */ values(profile.workshops).map(
    (workshopRef) => {
      const { _id, workshop, started, completed } = workshopRef;

      return {
        name: workshop.name,
        started: isDate(started) && format(started, "dd/MM/yyyy"),
        completed: isDate(completed) && format(completed, "dd/MM/yyyy"),
        skills: workshop.skills.map((skill) => (
          <Tag key={skill._id} mr={2}>
            {skill.code}
          </Tag>
        )),
        editButton: (
          <IconButton
            id="editWorkshop"
            icon={<EditIcon />}
            onClick={() => editAction(workshopRef)}
          />
        ),
        deleteButton: (
          <IconButton
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={withConfirm({
              header: `Êtes vous sûr(e) ?`,
              body: (
                <Text>
                  Veuillez confirmer la suppression de l'atelier{" "}
                  <strong>{workshopRef.workshop.name}</strong> de la fiche élève
                  de{" "}
                  <strong>
                    {profile.firstname} {profile.lastname}
                  </strong>{" "}
                  :
                </Text>
              ),
              onConfirm: () => removeAction(workshopRef)
            })}
          />
        )
      };
    }
  ); /* ),
    [profile]
    )
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
            id: "name",
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
