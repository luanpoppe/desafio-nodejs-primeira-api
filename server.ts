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
import { getCoursesRoute } from "./src/routes/get-courses.ts";
import { getCourseByIdRoute } from "./src/routes/get-course-by-id.ts";
import { createCourseRoute } from "./src/routes/create-course.ts";

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

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(getCoursesRoute);
server.register(getCourseByIdRoute);
server.register(createCourseRoute);

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
