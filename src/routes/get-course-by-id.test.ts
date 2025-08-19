import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app";
import { makeCourse } from "../tests/factories/make-course";

test("Get course by id", async () => {
  await server.ready();

  const course = await makeCourse();

  const response = await request(server.server).get(`/courses/${course.id}`);

  console.log(response.body);

  expect(response.status).toBe(200);
  expect(response.body.course).toEqual({
    id: expect.any(String),
    title: expect.any(String),
    description: null,
  });
});
