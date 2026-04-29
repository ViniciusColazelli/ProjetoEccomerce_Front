// pages/index.js
// A página só monta os blocos — sem lógica inline
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import CategoryGrid from "../components/home/CategoryGrid";
import SearchPopup from "../components/popups/SearchPopup";
import AuthPopup from "../components/popups/AuthPopup";
import CartPopup from "../components/popups/CartPopup";
import { usePopup } from "../hooks/usePopup";
import { S } from "../styles/theme";

export default function Home() {
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
      {/* Pop-ups */}
      {isOpen("search") && <SearchPopup onClose={close} />}
      {isOpen("auth") && <AuthPopup onClose={close} />}
      {isOpen("cart") && <CartPopup onClose={close} />}

      {/* Layout */}
      <Navbar
        onSearch={() => toggle("search")}
        onAuth={() => toggle("auth")}
        onCart={() => toggle("cart")}
      />
      <Hero />
      <CategoryGrid />
      <Footer />
    </div>
  );
}
