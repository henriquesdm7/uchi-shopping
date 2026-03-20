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
- **Integração IA**: `@google/generative-ai` (Google Gemini) para processamento de rotinas automatizadas

## 2. Padrões de Frontend (Vue / Nuxt)
- O idioma da interface com o usuário (UI) da aplicação é **Português do Brasil (pt-BR)**. Todas as strings visíveis para o usuário devem estar neste idioma.
- **Layouts**: O layout de uma página deve ser explicitado através do meta da página: `definePageMeta({ layout: 'auth' | 'guest' })`.
- Construir a UI privilegiando os componentes nativos do `@nuxt/ui`.
- **Comunicação com API**: As chamadas ao backend devem consumir endpoints definidos em `server/api/`, preferencialmente usando hooks composables do Nuxt (`useFetch` ou `$fetch`).
- **Navegação (AuthMenu)**: SEMPRE que criar uma nova funcionalidade base ou um novo módulo de UI (nova página de rota principal), é OBRIGATÓRIO adicionar o atalho/rota correspondente no componente `app/components/layout/AuthMenu.vue`. Isso garante que o usuário consiga navegar para a nova funcionalidade.

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

## 6. Typecheck e Qualidade de Código (MANDATÓRIO)
- **SEMPRE** cheque e corrija os problemas de type-check apontados pelo TypeScript ao criar ou modificar partes do código (seja log, validação em terminal ou problemas gerados apontados pela IDE). Não ignore erros de tipagem sob nenhuma circunstância.
- Se o script `npm run typecheck` reportar falhas de TypeScript em seus arquivos gerados, revise e arrume seus models, `refs`, retornos de API e casts.

## 7. Fluxos Contínuos
- Scripts disponíveis descritos no `package.json`:
  - Instalação e atualização: `npm install`
  - Iniciar Dev: `npm run dev`
  - Build para Produção: `npm run build` e `npm run preview`
  - Serviços de background (MySQL locale): `docker compose up -d`

## 8. Regras de Negócio e Funcionalidades Específicas
- **Processamento de Notas Fiscais via IA**: A aplicação possui a capacidade de processar imagens de recibos e notas fiscais com IA (Google Gemini: `gemini-2.5-flash`). Toda a integração de IA **deve ser feita obrigatoriamente** invocando os métodos do serviço central localizados em `server/utils/services/gemini.ts`. Este serviço extrai dados consistentes do recibo, devolvendo JSON com `marketName`, `date`, `total`, agregando dinamicamente `items`.
- **Unificação de Produtos**: Eventualmente podem haver registros de produtos duplicados devido a erros de inserção via IA ou pelo usuário final. Ao realizar a unificação explícita de produtos repetidos para um produto base (através da página ou rota administrativa correspondente), é exigido restritamente que todo o histórico — incluindo ligações com `PurchaseItem` e `ShoppingListItem` — seja transferido proativamente para o ID do produto "base" antes que o(s) ID(s) do(s) produto(s) obsoleto(s) seja(m) deletado(s). Nenhuma compra ou lista relacionada deve ser perdida nesse processo.
