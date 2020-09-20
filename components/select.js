import { Select as cSelect } from "@chakra-ui/core";

import { styled } from "twin.macro";

export const Select = styled(cSelect)`
  option {
    background: ${({ colorMode }) => colorMode === "dark" && "#505c73"};
  }
`;
