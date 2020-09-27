import "theme/styles.css";
import { description } from "package.json";
import Head from "next/head";
import { initializeStore, Provider as StateProvider } from "tree";
import { Provider as AuthProvider } from "next-auth/client";
import {
  ChakraProvider,
  ColorModeProvider,
  ThemeProvider,
  useColorMode,
} from "@chakra-ui/core";
import customTheme from "theme";
import { Chakra } from "components/chakra";
import { isServer } from "utils/isServer";
import { GlobalStyles } from "twin.macro";

const Root = ({ Component, ...pageProps }) => {
  return <Component {...pageProps} />;
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
          keepAlive: 0,
        }}
        session={session}
      >
        <StateProvider value={store}>
          {/* <Chakra cookies={cookies}> */}
          <ChakraProvider resetCSS theme={customTheme}>
            {/* <ThemeProvider theme={customTheme}> */}
            {/* <ColorModeProvider> */}
            <Root Component={Component} {...pageProps} />
            {/* </ColorModeProvider> */}
            {/* </ThemeProvider> */}
          </ChakraProvider>
          {/* </Chakra> */}
        </StateProvider>
      </AuthProvider>
    </>
  );
};

// App.getInitialProps = async ({ Component, ctx }) => {
//   let pageProps = {};
//   if (Component.getInitialProps) {
//     pageProps = await Component.getInitialProps(ctx);
//   }
//   return {
//     pageProps,
//   };
// };

// export function getServerSideProps({ req }) {
//   return {
//     props: {
//       // first time users will not have any cookies and you may not return
//       // undefined here, hence ?? is necessary
//       cookies: req.headers.cookie ?? "",
//     },
//   };
// }

export default App;
