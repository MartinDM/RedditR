/** @type {import('next').NextConfig} */

const hostnames = [
  'preview.redd.it',
  'external-i.redd.it',
  '*.redd.it',
  '*.*.redditmedia.com',
  'preview.redd.it',
  'external-preview',
  'styles.redditmedia.com',
  'picsum.photos',
]

const nextConfig = {
  images: {
    remotePatterns: hostnames.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
  },
}

module.exports = nextConfig
