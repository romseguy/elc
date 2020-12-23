import "theme/styles.css";
import { description } from "package.json";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { Provider as AuthProvider } from "next-auth/client";
import { useStaticRendering } from "mobx-react-lite";
import { initializeStore, Provider as StateProvider } from "tree";
import { GlobalStyles } from "twin.macro";
import { isServer } from "utils/isServer";
import { useSession } from "utils/useAuth";
import { Box, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { Chakra, Confirm, Header } from "components";

useStaticRendering(isServer());

const Root = ({ Component, ...pageProps }) => {
  const [_, isLoading] = useSession();

  if (isLoading) {
    return (
      <Flex
        flexGrow="1"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <VStack spacing={5}>
          <Box>
            <Header />
          </Box>
          <Box>
            <Text>
              Merci de patienter pendant le chargement de l'application...
            </Text>
          </Box>
          <Box>
            <Spinner />
          </Box>
        </VStack>
      </Flex>
    );
  }

  return (
    <>
      <Confirm />
      <Component {...pageProps} />
    </>
  );
};

const App = ({ Component, pageProps, cookies }) => {
  const { snapshot, session } = pageProps;
  const store = initializeStore(snapshot);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link ref="icon" href="/favicon.ico" />
        <title>{description}</title>
        {/*npm install -g mobx-devtools*/}
        {/* <script src="//localhost:8098"></script> */}
      </Head>

      <GlobalStyles />

      <AuthProvider
        options={{
          clientMaxAge: 0,
          keepAlive: 0
        }}
        session={session}
      >
        <StateProvider value={store}>
          <Chakra cookies={cookies}>
            <Root Component={Component} {...pageProps} />
          </Chakra>
        </StateProvider>
      </AuthProvider>
    </>
  );
};

App.getInitialProps = async ({ Component, ctx }) => {
  const session = await getSession(ctx);
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    cookies: ctx.req.headers.cookie ?? "",
    pageProps: {
      ...pageProps,
      session
    }
  };
};

export default App;
