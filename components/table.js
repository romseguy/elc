import tw, { styled } from "twin.macro";

export const Table = styled.table`
  thead th {
    ${tw`pr-8`}
  }
  tbody > tr {
    ${tw`border-t cursor-pointer`}
    &:hover {
      background-color: ${({ bg }) => bg};
    }
  }
`;
