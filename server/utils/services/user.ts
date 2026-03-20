import type {UserCreateInput} from "#server/generated/prisma/models/User";
import {hashSync} from "bcrypt-ts";

export async function createUser(input: UserCreateInput) {
  const existing = await prisma.user.findUnique({
    where: {
      email: input.email,
    }
  })

  if (existing) {
    throw createError({
      status: 409,
      message: 'Email já cadastrado',
    })
  }

  return prisma.user.create({
    data: {
      ...input,
      password: hashSync(input.password, 12),
    },
    omit: {
      password: true,
    }
  });
}
