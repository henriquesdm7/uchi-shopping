# Regras e Convenções (RULES) para `uchi-shopping`

Este arquivo documenta os padrões de design, regras de negócios e convenções técnicas que devem ser estritamente seguidos durante o desenvolvimento deste projeto.

## 1. Stack Tecnológica
- **Framework**: Nuxt 4
- **UI & Estilização**: Vue 3, `@nuxt/ui`, TailwindCSS
- **Backend**: Nuxt Nitro (`server/`)
- **Banco de Dados**: MySQL 8.0 gerenciado via Prisma ORM
- **Validação**: Zod (utilizado tanto no cliente quanto no servidor)
- **Autenticação**: `nuxt-auth-utils` (sessão no servidor criptografada)
- **Criptografia**: `bcrypt-ts` (para senhas)

## 2. Padrões de Frontend (Vue / Nuxt)
- O idioma da interface com o usuário (UI) da aplicação é **Português do Brasil (pt-BR)**. Todas as strings visíveis para o usuário devem estar neste idioma.
- **Layouts**: O layout de uma página deve ser explicitado através do meta da página: `definePageMeta({ layout: 'auth' | 'guest' })`.
- Construir a UI privilegiando os componentes nativos do `@nuxt/ui`.
- **Comunicação com API**: As chamadas ao backend devem consumir endpoints definidos em `server/api/`, preferencialmente usando hooks composables do Nuxt (`useFetch` ou `$fetch`).

## 3. Padrões de Backend (Nitro / API)
- **Lógica de Roteamento**: As regras de proteção global de rotas ficam limitadas ao middleware do servidor (`server/middleware/`), não devem ser feitas através de guards no lado do cliente nas pages.
- **Fluxo de Dados & Validação**:
  - Toda entrada via POST/PUT DEVE ser validada usando os schemas Zod localizados em `shared/utils/` (ex: importados como `#shared/utils/user.schema`).
  - Nos endpoints da API, utilize o utilitário embutido `readValidatedBody` junto ao schema Zod correspondente (ex: `await readValidatedBody(event, body => Schema.safeParse(body))`). Retorne `createError` em caso de falha na validação.
- **Camada de Serviço**: A lógica de regra de negócios (ex: verificação de duplicidade de registros, geração de dados complexos) e interações mais pesadas com o Prisma **não** devem ficar nos manipuladores (handlers) de API, mas sim abstraídas nos arquivos dentro de `server/utils/services/`.

## 4. Nuxt Auth (Sessões)
- Trabalhe diretamente com o `nuxt-auth-utils`.
- O processo de login manipula a sessão com `setUserSession`, leitura é feia com `useUserSession` ou middlewares pertinentes, e manipulação de término com `clearUserSession`.
- Senhas NUNCA devem ser enviadas ou expostas em logs/DB de forma limpa. Use sempre `hashSync` e `compareSync` do `bcrypt-ts` antes de gravar no DB ou verificar o login.

## 5. Prisma e Banco de Dados
- O cliente singleton do Prisma deve ser importado usando `server/utils/prisma.ts`. Este projeto usa adaptadores como `@prisma/adapter-mariadb` e variáveis de ambiente flexíveis.
- **NUNCA modifique arquivos de migração** gerados automaticamente, nem edite diretamente o código fonte do cliente gerado na pasta `server/generated/prisma/`.
- **Modificações de Schema**: Sempre atualize o `prisma/schema.prisma`. Após modificações neste arquivo, execute `npx prisma generate` para re-gerar a tipagem do client e `npx prisma migrate dev` para propagar as alterações para o banco de desenvolvimento.
- Variáveis relativas ao banco devem respeitar as diretrizes de instalação do `.env.example` e do docker compose.

## 6. Fluxos Contínuos
- Scripts disponíveis descritos no `package.json`:
  - Instalação e atualização: `npm install`
  - Iniciar Dev: `npm run dev`
  - Build para Produção: `npm run build` e `npm run preview`
  - Serviços de background (MySQL locale): `docker compose up -d`
