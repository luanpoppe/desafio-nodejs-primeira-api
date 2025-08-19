import { faker } from "@faker-js/faker";
import { db } from "../../database/client";
import { courses, users } from "../../database/schema";
import { hash } from "argon2";
import { randomUUID } from "node:crypto";

export async function makeUser() {
  const passwordBeforeHash = randomUUID();

  const result = await db
    .insert(users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(passwordBeforeHash),
    })
    .returning();

  return {
    user: result[0],
    passwordBeforeHash,
  };
}
