// components/layout/Layout.jsx
// Esqueleto global: popups + Navbar + conteúdo + Footer
import { usePopup } from "context/PopupContext";
import { S } from "styles/theme";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SearchPopup from "components/popups/SearchPopup";
import CartPopup from "components/popups/CartPopup";
import AuthPopup from "components/popups/AuthPopup";
import MenuPopup from "components/popups/MenuPopup";

export default function Layout({ children }) {
  const { close, isOpen } = usePopup();

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
      {isOpen("menu") && <MenuPopup onClose={close} />}

      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
