/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.API_URL || "http://localhost:5000"}/:path*`,
      },
    ];
  },
};
