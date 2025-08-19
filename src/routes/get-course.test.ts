import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app";
import { makeCourse } from "../tests/factories/make-course";
import { randomUUID } from "node:crypto";

test("Get course by id", async () => {
  await server.ready();

  const fakeTitle = randomUUID();

  const course = await makeCourse(fakeTitle);

  const response = await request(server.server).get(
    `/courses?search=${fakeTitle}`
  );

  console.log(response.body);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    total: 1,
    courses: [
      {
        id: expect.any(String),
        title: fakeTitle,
        enrollments: 0,
      },
    ],
  });
});
