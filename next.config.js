/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true, // Comment to fix nextjs send double request
    images: {
        // TODO: Handle when file miss match or no existing file
        // formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.com',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '**',
            },
        ],
    },
}

module.exports = nextConfig
