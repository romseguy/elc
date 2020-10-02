import { description } from "package.json";
import { Box, Flex, Heading, useColorModeValue } from "@chakra-ui/core";
import { Link } from "./link";
import tw, { css } from "twin.macro";

export const Header = (props) => {
  const bg = useColorModeValue("gray.400", "gray.700");
  const styles = css`
    ${useColorModeValue(
      tw`h-24 bg-gradient-to-b from-white via-white to-orange-600`,
      tw`h-24 bg-gradient-to-b from-orange-600 via-white to-white`
    )}
  `;

  return (
    <>
      <Flex
        as="header"
        justifyContent="center"
        alignItems="center"
        {...props}
        // css={styles}
      >
        <Heading as="h1" fontFamily="DancingScript">
          <Link href="/">{description}</Link>
        </Heading>
      </Flex>
      <style jsx>{`
        @font-face {
          font-family: "DancingScript";
          src: url("/fonts/DancingScript-Regular.ttf");
          src: url("/fonts/DancingScript-Bold.ttf");
          src: url("/fonts/DancingScript-SemiBold.ttf");
        }
      `}</style>
    </>
  );
};
