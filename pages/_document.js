import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/core";

export default class Document extends NextDocument {
  static getInitialProps(ctx) {
    return NextDocument.getInitialProps(ctx);
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript /* initialColorMode="light" */ />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
