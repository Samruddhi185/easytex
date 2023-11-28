/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_OPEN_AI_KEY: "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",
    }
    // async headers() {
    //     return [
    //       {
    //         source: "/api/:path*",
    //         headers: [
    //           { key: "Access-Control-Allow-Credentials", value: "true" },
    //           { key: "Access-Control-Allow-Origin", value: "*" }, //  You can also use '*' instead of the specific endpoint but I am not sure if it's best practice 
    //           { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
    //           { key: "Access-Control-Allow-Headers", value: "*" },
    //         ]
    //       }
    //     ]
    // },
    // async rewrites() {
    //     return [
    //       {
    //         source: '/api/:path*',
    //         destination: 'https://*/:path*',
    //       },
    //     ]
    //   },
}

module.exports = nextConfig
