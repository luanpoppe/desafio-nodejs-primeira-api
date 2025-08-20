import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app";
import { makeUser } from "../tests/factories/make-user";

test("login", async () => {
  await server.ready();

  const { passwordBeforeHash, user } = await makeUser();

  const response = await request(server.server)
    .post("/sessions")
    .set("Content-Type", "application/json")
    .send({
      email: user.email,
      password: passwordBeforeHash,
    });

  console.log(response.body);

  expect(response.status).toBe(200);
  // expect(response.body).toEqual({
  //   message: "Ok!",
  // });
});
