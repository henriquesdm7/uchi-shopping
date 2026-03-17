import {PasswordLoginSchema} from "#shared/utils/auth.schema";
import {compareSync} from "bcrypt-ts";

export default defineEventHandler(async event => {
  console.log("Erro de validação");

  const validated = await readValidatedBody(event, body => PasswordLoginSchema.safeParse(body));

  console.log("Erro de validação");

  if (!validated.success) {
    returnError();
  }

    console.log("Buscando user");
  const user = await prisma.user.findUnique({
    where: {
      email: validated.data.email,
    }
  });
    console.log("Achou user: ", user);

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
