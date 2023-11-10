import { RelayEnvironmentProvider } from "react-relay";
import { initRelayEnvironment } from "../RelayEnvironment";
import { RecordSource } from "relay-runtime";
import { useMemo, useEffect } from "react";
import { RelayPageProps } from "../relay-types";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps,
}: AppProps<RelayPageProps>) {
  const environment = useMemo(initRelayEnvironment, []);

  useEffect(() => {
    const store = environment.getStore();

    // Hydrate the store.
    store.publish(new RecordSource(pageProps.initialRecords));

    // Notify any existing subscribers.
    store.notify();
  }, [environment, pageProps.initialRecords]);

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Component {...pageProps} />
    </RelayEnvironmentProvider>
  );
}
