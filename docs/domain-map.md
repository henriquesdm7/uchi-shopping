# Domain Map (Quick Reference)

## Authentication
- UI: `app/pages/login.vue`
- API: `server/api/login.post.ts`, `server/api/logout.post.ts`
- Session middleware: `server/middleware/redirect-guests.ts`

## Markets CRUD
- UI: `app/pages/cadastros/mercados/**`
- API: `server/api/markets*.ts`, `server/api/markets/[id].*.ts`
- Service: `server/utils/services/market.ts`
- Schema: `shared/utils/market.schema.ts`

## Categories CRUD
- UI: `app/pages/cadastros/categorias/**`
- API: `server/api/categories*.ts`, `server/api/categories/[id].*.ts`
- Service: `server/utils/services/category.ts`
- Schema: `shared/utils/category.schema.ts`

## Purchases + Receipt Upload
- UI register: `app/pages/compras/registro.vue`
- UI history/detail: `app/pages/compras/historico.vue`, `app/pages/compras/[id].vue`
- API: `server/api/purchases.post.ts`, `server/api/purchases.get.ts`, `server/api/purchases/[id].get.ts`, `server/api/purchases/items/[itemId].put.ts`
- Service: `server/utils/services/purchase.ts`
- Schema: `shared/utils/shopping.schema.ts`

## AI Extraction + Usage Tracking
- Service: `server/utils/services/gemini.ts`
- Model constant: `GEMINI_MODEL` (`gemini-2.5-flash`)
- Usage persistence: `AiRequest` model

## Product Analytics (average + evolution)
- UI list/detail: `app/pages/cadastros/produtos/index.vue`, `app/pages/cadastros/produtos/[id].vue`
- Chart component: `app/components/PriceChart.vue`
- API: `server/api/products.get.ts`, `server/api/products/[id].get.ts`
- Service: `server/utils/services/product.ts`

