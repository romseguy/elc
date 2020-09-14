import "./styles.css";
import { ThemeProvider, ColorModeProvider, CSSReset } from "@chakra-ui/core";
import theme from "utils/theme";
import { Provider } from "next-auth/client";
import { Helmet } from "react-helmet";
import { description } from "../package.json";
import { isServer } from "utils/isServer";
import { Provider as Jotai } from "jotai";

export default function App({ Component, pageProps }) {
  const config = (theme) => ({
    light: theme.light,
    dark: theme.dark,
  });

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider value="light">
        <CSSReset config={config} />
        <Provider
          options={{
            clientMaxAge: 0,
            keepAlive: 0,
          }}
          session={pageProps.session}
        >
          <Helmet defaultTitle={description} titleTemplate="%s" />

          {!isServer ? (
            <Jotai>
              <Component {...pageProps} />
            </Jotai>
          ) : (
            <Component {...pageProps} />
          )}
        </Provider>
      </ColorModeProvider>
    </ThemeProvider>
  );
}
