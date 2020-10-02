import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/core";
import tw, { css } from "twin.macro";

export default class Document extends NextDocument {
  static getInitialProps(ctx) {
    return NextDocument.getInitialProps(ctx);
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
        </Head>
        <body>
          <ColorModeScript /* initialColorMode="light" */ />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
