import { useMemo } from "react";
import { values } from "mobx";
import { format } from "date-fns";
import { IconButton, Text } from "@chakra-ui/core";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Table } from "components";

export const SkillTable = ({
  withConfirm,
  editAction,
  removeAction,
  profile,
  display,
  css,
  ...props
}) => {
  const disableSortBy = useMemo(() => profile.skills.length <= 1, [
    profile.skills
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        sortType: "basic",
        disableSortBy
      },
      {
        Header: "Code",
        accessor: "code",
        disableSortBy
      },
      {
        Header: "Description",
        accessor: "description",
        disableSortBy
      },
      {
        Header: "Matière",
        accessor: "domain",
        disableSortBy
      },
      {
        Header: "Niveau",
        accessor: "level",
        disableSortBy
      },
      {
        Header: "Atelier",
        accessor: "workshop",
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

  const data = useMemo(
    () =>
      values(profile.skills).map((skillRef) => {
        const { skill, workshop, date } = skillRef;

        return {
          date: format(date, "dd/MM/yyyy"),
          code: skill.code,
          description: skill.description,
          domain: skill.domain && skill.domain.name,
          level: skill.level,
          workshop: workshop && workshop.name,
          editButton: (
            <IconButton
              icon={<EditIcon />}
              onClick={() => editAction(skillRef)}
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
                    Veuillez confirmer la suppression de la compétence{" "}
                    <strong>{skill.code}</strong> de la fiche élève de{" "}
                    <strong>
                      {profile.firstname} {profile.lastname}
                    </strong>{" "}
                    :
                  </Text>
                ),
                onConfirm: () => removeAction(skillRef)
              })}
            />
          )
        };
      }),
    [profile]
  );

  return (
    <Table
      css={{ display, ...css }}
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
      fullWidth
      {...props}
    />
  );
};
