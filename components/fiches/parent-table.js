import { values } from "mobx";
import { StyledTable } from "components";

export const ParentTable = ({ profile, onParentRowClick, ...props }) => {
  return (
    <StyledTable {...props}>
      <thead>
        <tr>
          <th>Prénom </th>
          <th>Nom </th>
        </tr>
      </thead>
      <tbody>
        {values(profile.parents).map((parent) => {
          return (
            <tr
              key={parent._id}
              tabIndex={0}
              title={`Cliquez pour ouvrir la fiche de ${parent.firstname} ${parent.lastname}`}
              onClick={() => onParentRowClick(parent)}
            >
              <td>{parent.firstname}</td>
              <td>{parent.lastname}</td>
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
};
