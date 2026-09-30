// components/layout/Layout.jsx
// Esqueleto global: popups + Navbar + conteúdo + Footer
import { usePopup } from "../../hooks/usePopup";
import { S } from "../../styles/theme";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SearchPopup from "../popups/SearchPopup";
import CartPopup from "../popups/CartPopup";
import AuthPopup from "../popups/AuthPopup";

export default function Layout({ children }) {
  const { toggle, close, isOpen } = usePopup();

  return (
    <div
      style={{
        fontFamily: S.sans,
        background: S.pageBg,
        minHeight: "100vh",
        color: S.dark,
      }}
    >
      {isOpen("search") && <SearchPopup onClose={close} />}
      {isOpen("auth") && <AuthPopup onClose={close} />}
      {isOpen("cart") && <CartPopup onClose={close} />}

      <Navbar
        onSearch={() => toggle("search")}
        onAuth={() => toggle("auth")}
        onCart={() => toggle("cart")}
      />
      {children}
      <Footer />
    </div>
  );
}
