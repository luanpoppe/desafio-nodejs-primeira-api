import fastify from "fastify";
import { db } from "./src/database/client.ts";
import { courses } from "./src/database/schema.ts";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";

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
}).withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.get("/courses", async (request, reply) => {
  const result = await db.select().from(courses);

  reply.send({ courses: result });
});

server.get(
  "/courses/:id",
  {
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
    },
  },
  async (request, reply) => {
    const { id: courseId } = request.params;

    const result = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));

    if (result.length > 0) {
      return reply.send({ course: result[0] });
    }

    return reply.status(404).send();
  }
);

server.post(
  "/courses",
  {
    schema: {
      body: z.object({
        title: z.string().min(5, "Título precisa ter pelo menos 5 caracteres"),
      }),
    },
  },
  async (request, reply) => {
    const { title: courseTitle } = request.body;

    const result = await db
      .insert(courses)
      .values({
        title: courseTitle,
      })
      .returning();

    return reply.status(201).send({ courseId: result[0].id });
  }
);

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
