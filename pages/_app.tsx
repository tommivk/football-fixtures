import { AppProps } from "next/app";
import Layout from "../components/Layout";
import NextNProgress from "nextjs-progressbar";

import "../static/styles.css";

export default function MyApp({ Component, pageProps }: AppProps<{}>) {
  return (
    <Layout>
      <Component {...pageProps} />
      <NextNProgress
        color="#29D"
        startPosition={0.3}
        stopDelayMs={300}
        height={1}
        showOnShallow={true}
        options={{ showSpinner: false, easing: "ease" }}
      />
    </Layout>
  );
}
