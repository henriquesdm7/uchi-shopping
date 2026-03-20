# Master Guide para Agentes IA - `uchi-shopping`

Ao iniciar qualquer interação para desenvolvimento ou modificação deste projeto, **leia os documentos estruturais listados abaixo antes de tomar ou sugerir ações**. Compreender nossa arquitetura evita inconsistências na base de código.

## Documentação Essencial (Obrigatória a Leitura)

O projeto `uchi-shopping` é dividido e regulado com base em dois pilares fundamentais de documentação:

1. **[Estrutura de Pastas e Arquivos (STRUCTURE.md)](./STRUCTURE.md)**
   Descreve em detalhes a função de cada camada arquitetural na aplicação (App Nuxt, Server API, Shared, Prisma) e ilustra exatamente onde colocar novos componentes, schemas de validação e services lógicos.

2. **[Regras de Desenvolvimento e Negócios (RULES.md)](./RULES.md)**
   Estabelece os padrões determinantes sobre como o código deve ser escrito. Inclui mandamentos críticos de segurança (bcrypt validado em DB), roteamento (proteção via midleware Nitro), UI (pt-BR e framework NuxtUI), e ciclo de validação de dados (Zod em requisições server-side com `readValidatedBody`).

---

## Destaques Rápidos da Arquitetura
- **Stack Principal**: Nuxt 4 (Vue 3 UI + Nitro Server API em pacote único).
- **Interface e Língua**: UI desenvolvida com Vue 3, `@nuxt/ui` e TailwindCSS. O idioma predominante em páginas, mensagens e alertas deve ser obrigatoriamente **Português do Brasil (pt-BR)**.
- **Banco de Dados**: MySQL gerido pelo ORM do Prisma (usando schemas definidos em `prisma/schema.prisma`).
- **Data Flow**: Dados fluem da base do usuário (UI em `app/pages`) -> endpoints validados por Zod (`server/api/`) -> isolamento de regra de negócio nos serviços do Node (`server/utils/services/`) -> gravação segura no MySql via Prisma.

> Ao implementar novos recursos (ex: telas, endpoints, modelos DB), crie as modificações pensando nestas quatro vertentes de integração.
