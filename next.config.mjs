/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@react-pdf/renderer"],
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "plus.unsplash.com" },
      { hostname: "img.freepik.com" },
      { hostname: "images.prismic.io" },
      { hostname: "cdn.pixabay.com" },
      { hostname: "media.istockphoto.com" },
      { hostname: "res.cloudinary.com" },
    ],
    unoptimized: true, // This will allow any hostname
  },
  webpack: (config) => {
    config.devtool = "source-map";
    return config;
  },
};

export default nextConfig;
