import fastify from "fastify";
import crypto from "node:crypto";
import { db } from "./src/database/client.ts";
import { courses } from "./src/database/schema.ts";
import { config } from "dotenv";
import { eq } from "drizzle-orm";

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

server.get("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  };
  const { id: courseId } = request.params as Params;

  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId));

  if (result.length > 0) {
    return reply.send({ course: result[0] });
  }

  return reply.status(404).send();
});

server.post("/courses", async (request, reply) => {
  type Body = {
    title: string;
  };
  const { title: courseTitle } = request.body as Body;

  if (!courseTitle) {
    return reply.status(400).send({ message: "Título obrigatório" });
  }

  const result = await db
    .insert(courses)
    .values({
      title: courseTitle,
    })
    .returning();

  return reply.status(201).send({ courseId: result[0].id });
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
