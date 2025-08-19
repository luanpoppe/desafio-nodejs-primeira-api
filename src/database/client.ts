import { drizzle } from "drizzle-orm/node-postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("Erro na conexão com o banco de dados");
}

export const db = drizzle(process.env.DATABASE_URL);
