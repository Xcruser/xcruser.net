/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Führe das Script nur einmal aus (beim Server-Build)
    if (isServer) {
      require('./scripts/generate-search-index.js');
    }
    return config;
  },
};

module.exports = nextConfig;
