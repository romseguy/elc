import { useColorModeValue } from "@chakra-ui/core";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { useSortBy, useTable } from "react-table";
import tw, { styled } from "twin.macro";

export const StyledTable = (props) => {
  const borderColor =useColorModeValue("black", "white")

  const Component = styled.table`
    thead {
      th {
      ${tw`pr-16`}
      }
      tr {
        ${tw`border-b`}
        border-color: ${borderColor}
      }
    }
    tbody {
      tr {
        ${tw`cursor-pointer`}

        &:hover {
          ${tw`border-b`}
          border-color: ${borderColor}
        }

        td {
          ${tw`py-4`}
        }
      }
    }
  `
  return <Component {...props}/>
}

export const Table = (props) => {
  // extract props for useTable hook config
  const { columns, data, initialState } = props;

  if (!columns || !data) return null;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState,
      sortTypes: {
        log: (row1, row2, columnName) => {
          console.log(row1, row2, columnName);
        },
      },
    },
    useSortBy
  );

  return (
    <StyledTable {...getTableProps()} {...props}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => {
              //console.log(column);

              return (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  title="Changer l'ordre d'affichage"
                >
                  {column.render("Header")}
                  <span>
                    {column.canSort && (
                      /* column.isSorted
                      ?  */ column.isSortedDesc
                        ? <ArrowDownIcon ml={2}/>
                        : <ArrowUpIcon ml={2}/>
                      /* : "" */
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
};
