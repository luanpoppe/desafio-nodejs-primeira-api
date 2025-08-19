import fastify from "fastify";
import { config } from "dotenv";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { getCoursesRoute } from "./routes/get-courses.ts";
import { getCourseByIdRoute } from "./routes/get-course-by-id.ts";
import { createCourseRoute } from "./routes/create-course.ts";
import scalarAPIReference from "@scalar/fastify-api-reference";

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

if (process.env.NODE_ENV === "development") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Desafio NodeJS",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(fastifySwaggerUi, {
    routePrefix: "/swagger",
  });

  server.register(scalarAPIReference, {
    routePrefix: "/docs",
  });
}

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(getCoursesRoute);
server.register(getCourseByIdRoute);
server.register(createCourseRoute);

export { server };
