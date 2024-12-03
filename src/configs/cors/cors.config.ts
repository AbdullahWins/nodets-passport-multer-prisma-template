//src/configs/cors/cors.config.ts
export const corsConfig = {
  //   origin: ["https://example.com", "https://another-domain.com"],
  origin: "*",
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
