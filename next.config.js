/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        OPEN_AI_KEY: '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',
    },
    async headers() {
        return [
          {
            source: "/api/:path*",
            headers: [
              { key: "Access-Control-Allow-Credentials", value: "true" },
              { key: "Access-Control-Allow-Origin", value: "*" }, //  You can also use '*' instead of the specific endpoint but I am not sure if it's best practice 
              { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
              { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
          }
        ]
    }
}

module.exports = nextConfig
