import "./styles.css";
import { ThemeProvider, ColorModeProvider, CSSReset } from "@chakra-ui/core";
import theme from "utils/theme";
import { Provider as AuthProvider } from "next-auth/client";
import { Helmet } from "react-helmet";
import { description } from "../package.json";
import { isServer } from "utils/isServer";
import { Provider as StateProvider } from "jotai";
import cookies from "next-cookies";

const App = ({ Component, pageProps, initialColorMode }) => {
  const { session } = pageProps;
  const config = (theme) => ({
    light: theme.light,
    dark: theme.dark,
  });

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider value={initialColorMode}>
        <CSSReset config={config} />
        <AuthProvider
          options={{
            clientMaxAge: 0,
            keepAlive: 0,
          }}
          session={session}
        >
          <Helmet defaultTitle={description} titleTemplate="%s" />

          {!isServer ? (
            <StateProvider>
              <Component {...pageProps} />
            </StateProvider>
          ) : (
            <Component {...pageProps} />
          )}
        </AuthProvider>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  const { isDarkMode = "false" } = cookies(ctx);
  return {
    pageProps,
    initialColorMode: isDarkMode === "true" ? "dark" : "light",
  };
};

export default App;
