/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.API_URL || "http://localhost:5136"}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      // O painel abre na lista de pedidos
      { source: "/admin", destination: "/admin/pedidos", permanent: false },
    ];
  },
};
