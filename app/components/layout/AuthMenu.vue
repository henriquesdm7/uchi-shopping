<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Compras',
      icon: 'i-lucide-shopping-cart',
      children: [
        {
          label: 'Registro',
          description: 'Registre as compras para acompanhar um histórico detalhado e análises de gastos.',
          icon: 'i-lucide-list-check',
          to: '/compras/registro'
        },
        {
          label: 'Histórico',
          description: 'Visualize e gerencie seu histórico de compras.',
          icon: 'i-lucide-history',
          to: '/compras/historico'
        },
        {
          label: 'Mapa',
          description: 'Visualize suas compras em um mapa para identificar padrões de gastos por localização.',
          icon: 'i-lucide-map-pin'
        },
        {
          label: 'Relatório',
          description: 'Gere relatórios com base em filtros personalizados para obter insights detalhados sobre o consumo.',
          icon: 'i-lucide-chart-bar'
        },
        {
          label: 'Orçamento',
          description: 'Defina orçamentos para diferentes categorias e acompanhe seu progresso para manter suas finanças sob controle.',
          icon: 'i-lucide-pie-chart'
        }
      ]
    },
    {
      label: 'Cadastros',
      icon: 'i-lucide-database',
      children: [
        {
          label: 'Categorias',
          description: 'Organize suas compras em categorias personalizadas para facilitar a visualização e análise.',
          icon: 'i-lucide-tag',
          to: '/cadastros/categorias'
        },
        {
          label: 'Mercados',
          description: 'Mantenha um cadastro atualizado dos mercados onde costuma fazer compras para facilitar o registro.',
          icon: 'i-lucide-store',
          to: '/cadastros/mercados'
        },
      ]
    }
  ],
  [
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/henriquesdm7/uchi-shopping',
      target: '_blank'
    },
  ]
])
</script>

<template>
  <UNavigationMenu
    highlight
    highlight-color="primary"
    orientation="horizontal"
    :items="items"
    class="data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48"
  />
</template>
