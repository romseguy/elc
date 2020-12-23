import { Text } from "@chakra-ui/react";
import tw, { css } from "twin.macro";

// const styles = {
//   color: "red"
// }
//
// becomes:
const styles = css`
  ${tw`text-red-600`}
  font-weight: bold
`;
// = tailwind classes + SASS

export const ErrorMessageText = ({ children }) => {
  return <Text css={styles}>{children}</Text>;
};
