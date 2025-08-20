import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { z } from "zod";
import { checkRequestJwt } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      preHandler: [checkRequestJwt, checkUserRole("manager")],
      schema: {
        body: z.object({
          title: z
            .string()
            .min(5, "Título precisa ter pelo menos 5 caracteres"),
        }),
        response: {
          201: z
            .object({
              courseId: z.uuid(),
            })
            .describe("Curso criado com sucesso!"),
        },
        tags: ["courses"],
        summary: "Create a course",
        description:
          "Recebe um título e, opcionalmente, uma descrição, e cria um curso no banco de dados",
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
};
