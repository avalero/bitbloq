import Document, { Html, Head, Main, NextScript } from "next/document";
import { Global, css } from "@emotion/core";
import { baseStyles } from "@bitbloq/ui";
import favicon from "../images/favicon.png";
import { getBrowserEnv } from "../lib/env";

export default class BitbloqDocument extends Document {
  public render() {
    return (
      <Html>
        <Global styles={baseStyles} />
        <Head>
          <meta httpEquiv="origin-trial" content={process.env.ORIGIN_TRIALS} />
          <link rel="icon" type="image/png" href={favicon} />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__BITBLOQ_ENV__ = ${JSON.stringify(
                getBrowserEnv()
              )};`
            }}
          />
        </body>
      </Html>
    );
  }
}
