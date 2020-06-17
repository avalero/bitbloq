import App from "next/app";
import acceptLanguageParser from "accept-language-parser";
import { TranslateProvider } from "@bitbloq/ui";

import redirect from "../lib/redirect";
import { ServiceWorkerProvider } from "../lib/useServiceWorker";
import {
  minChromeVersion,
  supportedLanguages,
  defaultLanguage
} from "../config";
import { getChromeVersion } from "../util";
import FlagsModal from "../components/FlagsModal";
import messages from "../messages";

interface IBitbloqAppProps {
  language: string;
}

class BitbloqApp extends App<IBitbloqAppProps> {
  public static async getInitialProps(ctx) {
    const { req, pathname } = ctx.ctx;
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const acceptLanguage = req
      ? req.headers["accept-language"]
      : navigator.language;

    const language =
      acceptLanguageParser.pick(supportedLanguages, acceptLanguage, {
        loose: true
      }) || defaultLanguage;

    if (pathname !== "/browser-warning") {
      const chromeVersion = getChromeVersion(userAgent);
      if (chromeVersion < minChromeVersion) {
        redirect(ctx.ctx, "/browser-warning");
      }
    }

    const appProps = await App.getInitialProps(ctx);

    return {
      ...appProps,
      userAgent,
      language
    };
  }

  public render() {
    const { Component, pageProps, language } = this.props;

    return (
      <ServiceWorkerProvider>
        <TranslateProvider messages={messages[language]}>
          <Component {...pageProps} />
          <FlagsModal />
        </TranslateProvider>
      </ServiceWorkerProvider>
    );
  }
}

export default BitbloqApp;
