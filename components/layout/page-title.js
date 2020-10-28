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
  button,
  togglable = true,
  toggled,
  onToggle,
  onClick,
  children,
  ...props
}) => {
  return (
    <Flex alignItems="center" onClick={onClick} cursor="pointer" {...props}>
      {togglable && onToggle && (
        <>
          {toggled ? (
            <IconButton
              colorScheme="blue"
              size="lg"
              icon={<ArrowUpIcon />}
              onClick={onToggle}
              mr={2}
            />
          ) : (
            <IconButton
              colorScheme="blue"
              size="lg"
              icon={<ArrowDownIcon />}
              onClick={onToggle}
              mr={2}
            />
          )}
        </>
      )}
      <Heading size="md">{children}</Heading>
      {button}
      {/* <Spacer />
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
      )} */}
    </Flex>
  );
};
