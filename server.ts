import fastify from "fastify";
import crypto from "node:crypto";
import { db } from "./src/database/client.ts";
import { courses } from "./src/database/schema.ts";
import { config } from "dotenv";

config();

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

server.get("/courses", async (request, reply) => {
  const result = await db.select().from(courses);

  reply.send({ courses: result });
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
