# Estrutura do Projeto `uchi-shopping`

Este documento detalha a arquitetura de pastas e arquivos estruturais do projeto, que é uma aplicação full-stack construída com **Nuxt 4** (Vue para UI e Nitro para a API server-side).

## Visão Geral dos Diretórios

A aplicação utiliza as diretrizes de diretório do Nuxt 4, separando claramente o código do lado do cliente (frontend) e do lado do servidor (backend).

### 📁 `app/`
Contém todo o código da interface do usuário (Frontend).
- **`assets/`**: Arquivos estáticos não compilados, como folhas de estilo globais (`css/main.css`).
- **`components/`**: Componentes Vue reutilizáveis (utilizando o `@nuxt/ui`).
  - *Importante:* Ao criar novas páginas de funcionalidades e módulos (`pages/`), você deve OBRIGATORIAMENTE expô-las no menu de navegação que reside em `app/components/layout/AuthMenu.vue`.
- **`layouts/`**: Layouts da aplicação (ex: layouts específicos para rotas autenticadas ou para visitantes).
- **`pages/`**: Rotas da aplicação (ex: `login.vue`, `usuarios/`, `cadastros/`, `compras/`). Cada arquivo `.vue` aqui se torna uma URL na aplicação.
- **`app.config.ts`**: Configurações da aplicação Vue (tema UI, etc).
- **`app.vue`**: Ponto de entrada do frontend Vue.

### 📁 `server/`
Contém todo o código backend que roda no Nitro (servidor do Nuxt).
- **`api/`**: Endpoints da API REST. Arquivos aqui são mapeados automaticamente para rotas `/api/*` (ex: `login.post.ts` -> `POST /api/login`).
- **`middleware/`**: Middlewares executados do lado do servidor antes de as rotas da API ou requisições de página serem resolvidas (ex: proteção de rotas globais).
- **`utils/`**: Utilitários do servidor e a camada de serviços.
  - **`services/`**: Camada de lógica de negócios. Em vez de colocar lógica complexa diretamente nos handlers da API, ela é extraída para cá (ex: verificação de email duplicado, chamadas complexas ao banco).
  - **`prisma.ts`**: Instância singleton do Prisma Client.
- **`generated/`**: Código gerado automaticamente para o lado do servidor, geralmente abriga o Prisma Client customizado para este projeto.

### 📁 `shared/`
Contém código compartilhado entre o frontend (`app/`) e o backend (`server/`).
- **`utils/`**: Utilitários compartilhados, primariamente os schemas de validação Zod (ex: `auth.schema.ts`, `user.schema.ts`).
- **`types/`**: Tipagens TypeScript comuns a ambos os lados.

### 📁 `prisma/`
Gerenciamento de banco de dados.
- **`schema.prisma`**: Definição do schema do banco de dados (modelos e provider MySQL).
- **`migrations/`**: Histórico de migrações SQL geradas pelo Prisma.

### ⚙️ Arquivos de Configuração da Raiz
- **`nuxt.config.ts`**: Configuração global do Nuxt, registrando módulos (`@nuxt/ui`, `@nuxt/eslint`, `nuxt-auth-utils`), configuração de runtime e CSS global.
- **`package.json`**: Dependências do projeto e scripts de automação.
- **`compose.yml`**: Configuração do Docker Compose para levantar os serviços auxiliares em desenvolvimento (como o banco de dados MySQL).
- **`.env`** e **`.env.example`**: Variáveis de ambiente secretas (ex: `DATABASE_URL`, `NUXT_SESSION_PASSWORD`).
- **`AGENTS.md`** / **`RULES.md`** / **`STRUCTURE.md`**: Documentação de arquitetura e regras para desenvolvedores e agentes de IA (este conjunto de arquivos).
