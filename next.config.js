/** @type {import('next').NextConfig} */

const hostnames = ['preview.redd.it', 'i.redd.it', '*.*.redditmedia.com'];

const nextConfig = {
  images: {
    remotePatterns: hostnames.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
  },
};

module.exports = nextConfig;
