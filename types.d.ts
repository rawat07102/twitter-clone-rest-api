declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string
      NODE_ENV: "development" | "production"
      PORT: string
      SECRET_KEY: string
    }
  }
}

export {}
