// pages/_app.js
import Head from "next/head";
import { AuthProvider } from "context/AuthContext";
import Layout from "components/layout/Layout";
import "styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Belíssima Uniformes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
