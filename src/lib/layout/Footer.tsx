import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center">
      <Text fontSize="sm">
        {new Date().getFullYear()} -{" "}
        <Link
          href="https://indianboy.com.br/"
          isExternal
          rel="noopener noreferrer"
        >
          Indian Boy 🇧🇷
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
