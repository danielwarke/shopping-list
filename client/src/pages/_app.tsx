import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SnackbarContextProvider from "@/contexts/SnackbarContext";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Shopping List</title>
        <meta name="description" content="A smart shopping list application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <style jsx global>{`
          body {
            margin: 0;
          }
        `}</style>
        <QueryClientProvider client={queryClient}>
          <SnackbarContextProvider>
            <Component {...pageProps} />
          </SnackbarContextProvider>
        </QueryClientProvider>
      </main>
    </>
  );
}
