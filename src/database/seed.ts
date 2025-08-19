import { hash } from "argon2";
import { db } from "./client.ts";
import { courses, enrollments, users } from "./schema.ts";
import { fakerPT_BR as faker } from "@faker-js/faker";

async function seed() {
  const userInsert = await db
    .insert(users)
    .values([
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await hash(faker.internet.password()),
        role: "student",
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await hash(faker.internet.password()),
        role: "student",
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await hash(faker.internet.password()),
        role: "student",
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await hash(faker.internet.password()),
        role: "student",
      },
    ])
    .returning();

  const coursesInsert = await db
    .insert(courses)
    .values([
      { title: faker.lorem.words(4), description: faker.lorem.words(4) },
      { title: faker.lorem.words(4), description: faker.lorem.words(4) },
      { title: faker.lorem.words(4), description: faker.lorem.words(4) },
    ])
    .returning();

  await db.insert(enrollments).values([
    { userId: userInsert[0].id, courseId: coursesInsert[0].id },
    { userId: userInsert[0].id, courseId: coursesInsert[1].id },
    { userId: userInsert[1].id, courseId: coursesInsert[2].id },
  ]);

  process.exit();
}

seed();
