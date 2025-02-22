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
  webpack: (config, options) => {
    if (!options.dev) {
      config.devtool = options.isServer ? false : 'source-map'
    }
    return config
  },
};

export default nextConfig;
