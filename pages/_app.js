// pages/_app.js
import { AuthProvider } from "../context/AuthContext";
import Layout from "../components/layout/Layout";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
