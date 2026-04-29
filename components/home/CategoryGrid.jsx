// components/home/CategoryGrid.jsx
import CategoryCard from "../ui/CategoryCard";
import { S } from "../../styles/theme";

const CATEGORIES = [
  {
    name: "Calças",
    img: "https://media.istockphoto.com/id/1221134337/pt/foto/front-views-black-trousers.jpg?b=1&s=612x612&w=0&k=20&c=syywxyifQDpCpPT-ZhW6TBgkWFciwVyiNr9kLvNSz5E=",
  },
  {
    name: "Camisas",
    img: "https://media.istockphoto.com/id/694412908/pt/foto/black-t-shirt-front-and-back-isolated-on-white-background-with-clipping-path.jpg?b=1&s=612x612&w=0&k=20&c=MTvI74ccVt8EKoBdP8nNHXjflb5bYFnbtlJNb9yIO3A=",
  },
  {
    name: "Blusas",
    img: "https://media.istockphoto.com/id/2177201906/pt/foto/black-mens-hooded-sweatshirt.jpg?b=1&s=612x612&w=0&k=20&c=NhCqZPNyoFQcSkqkfrrs1cBxhUIJbLBg8ViH0AJPQ20=",
  },
  {
    name: "Shorts",
    img: "https://media.istockphoto.com/id/973758234/pt/foto/black-mens-shorts.jpg?b=1&s=612x612&w=0&k=20&c=a5TOZ6cKUIOXigzwhMi6o59tRA4-iKWSF-KhaHOwbqI=",
  },
];

export default function CategoryGrid() {
  return (
    <section style={{ padding: "52px 40px 64px" }}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: S.gold,
          fontWeight: 400,
          marginBottom: 6,
        }}
      >
        Explore
      </p>
      <h2
        style={{
          fontFamily: S.serif,
          fontSize: 28,
          fontWeight: 700,
          color: S.dark,
        }}
      >
        +Categorias
      </h2>
      <p
        style={{
          fontSize: 14,
          color: S.muted,
          marginTop: 5,
          marginBottom: 30,
          fontWeight: 300,
        }}
      >
        A peça certa para cada necessidade.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
        }}
      >
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.name} cat={cat} />
        ))}
      </div>
    </section>
  );
}
