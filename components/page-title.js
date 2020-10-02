import { Box, Flex, Heading, IconButton, Spacer } from "@chakra-ui/core";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

export const PageTitle = ({ children }) => {
  return (
    <Heading size="lg" mb={5}>
      {children}
    </Heading>
  );
};

export const PageSubTitle = ({
  togglable = true,
  toggled,
  onToggle,
  onClick,
  children
}) => {
  return (
    <Flex alignItems="center" my={5} onClick={onClick} cursor="pointer">
      <Heading size="md">{children}</Heading>
      <Spacer />
      {togglable && onToggle && (
        <>
          {toggled ? (
            <IconButton
              colorScheme="blue"
              size="lg"
              icon={<ArrowUpIcon />}
              onClick={onToggle}
            />
          ) : (
            <IconButton
              colorScheme="blue"
              size="lg"
              icon={<ArrowDownIcon />}
              onClick={onToggle}
            />
          )}
        </>
      )}
    </Flex>
  );
};
