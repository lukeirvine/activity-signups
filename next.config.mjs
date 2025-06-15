/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  eslint: {
    dirs: [
      'app',
      'components',
      'helpers',
      'hooks',
      'types',
      'public',
    ]
  },
  output: 'standalone',
};

export default nextConfig;
