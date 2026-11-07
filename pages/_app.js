// pages/_app.js
import Head from "next/head";
import { AuthProvider } from "context/AuthContext";
import { PopupProvider } from "context/PopupContext";
import { CartProvider } from "context/CartContext";
import Layout from "components/layout/Layout";
import "styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <PopupProvider>
          <Head>
            <title>Belíssima Uniformes</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PopupProvider>
      </CartProvider>
    </AuthProvider>
  );
}
