/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        // TODO: Handle when file miss match or no existing file
        // formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: process.env.NEXT_PUBLIC_PROTOCOL,
                hostname: process.env.NEXT_PUBLIC_HOST_NAME,
                pathname: '**',
            },
        ],
    },
}

module.exports = nextConfig
