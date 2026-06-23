/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false, // React Strict Mode is off

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
