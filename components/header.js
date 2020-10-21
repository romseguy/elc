import { description } from "package.json";
import { Box, Flex, Heading, useColorModeValue } from "@chakra-ui/core";
import { Link } from "components";

export const Header = (props) => {
  return (
    <>
      <Flex as="header" justifyContent="center" alignItems="center" {...props}>
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
