import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";
import { asc, ilike } from "drizzle-orm";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Get all courses",
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(["id", "title"]).optional().default("id"),
          page: z.coerce.number().optional().default(1),
          limit: z.coerce.number().optional().default(2),
        }),
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, orderBy, page, limit } = request.query;
      const where = search ? ilike(courses.title, `%${search}%`) : undefined;

      const [result, total] = await Promise.all([
        db
          .select()
          .from(courses)
          .orderBy(asc(courses[orderBy]))
          .limit(limit)
          .offset((page - 1) * limit)
          .where(where),
        db.$count(courses, where),
      ]);

      reply.send({ courses: result, total });
    }
  );
};
