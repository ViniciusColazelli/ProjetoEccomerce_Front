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
      // O painel abre no primeiro item do menu (lib/navegacao.js)
      { source: "/admin", destination: "/admin/produtos", permanent: false },
    ];
  },
};
