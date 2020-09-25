import "./styles.css";
import { description } from "package.json";
import Head from "next/head";
import { initializeStore, Provider as StateProvider } from "tree";
import { Provider as AuthProvider } from "next-auth/client";
import { ChakraProvider, useColorMode } from "@chakra-ui/core";
import customTheme from "utils/theme";

const Root = ({ Component, ...pageProps }) => {
  return <Component {...pageProps} />;
};

const App = ({ Component, pageProps }) => {
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

      <AuthProvider
        options={{
          clientMaxAge: 0,
          keepAlive: 0,
        }}
        session={session}
      >
        <StateProvider value={store}>
          <ChakraProvider resetCSS theme={customTheme}>
            <Root Component={Component} {...pageProps} />
          </ChakraProvider>
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

export default App;
