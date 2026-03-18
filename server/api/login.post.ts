import {PasswordLoginSchema} from "#shared/utils/auth.schema";
import {compareSync} from "bcrypt-ts";

export default defineEventHandler(async event => {
  const validated = await readValidatedBody(event, body => PasswordLoginSchema.safeParse(body));

  if (!validated.success) {
    returnError();
  }

  const user = await prisma.user.findUnique({
    where: {
      email: validated.data.email,
    }
  });

  if (!user || !compareSync(validated.data.password, user.password)) {
    returnError();
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },

  })

  return {
    id: user.id,
    email: user.email,
  }
})

function returnError(): never {
  throw createError({
    status: 401,
    message: 'Usuário ou senha incorretos',
  })
}
