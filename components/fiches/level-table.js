import { levels } from "tree/skill/utils";
import { Progress } from "@chakra-ui/core";
import { StyledTable } from "components";

export const LevelTable = ({ profile, maxProgress, ...props }) => {
  return (
    <StyledTable {...props}>
      <thead>
        <tr>
          <th>Niveau</th>
          <th>Progression</th>
        </tr>
      </thead>
      <tbody>
        {levels.map((level) => {
          return (
            <tr key={level}>
              <td>{level}</td>
              <td>
                <Progress
                  value={profile.getSkillsByLevel(level).length}
                  min={0}
                  max={maxProgress}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
};
