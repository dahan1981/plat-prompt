# Plataforma Banco de Ideias

Plataforma web minimalista para entregar um banco de ideias de conteúdo, bônus, prompts, roteiros e checklists para clientes que compraram o produto.

## Objetivo

Criar uma experiência mais organizada, profissional e escalável do que Trello, planilhas ou PDFs. O MVP nasce com dados locais para validar a interface e depois será conectado ao Supabase, Kiwify e Vercel.

## Stack inicial

- Next.js
- React
- TypeScript
- CSS nativo
- Supabase planejado para autenticação, banco e permissão de acesso

## Padroes do projeto

- Interface em português.
- README em português.
- Comentários no código em português, apenas quando forem realmente necessários.
- Visual minimalista com tons amarronzados, off-white e acentos discretos.
- Componentes simples, reutilizaveis e preparados para crescer.

## Rodando localmente

```bash
npm install
npm run dev
```

Depois acesse `http://localhost:3000`.

## Estrutura

```txt
src/
  app/              Rotas da aplicação
  components/       Componentes reutilizáveis
  lib/              Dados locais e regras auxiliares
  types/            Tipos compartilhados
supabase/
  migrations/       Modelo inicial do banco
  seed/             Dados iniciais de exemplo
```

## Proximas integracoes

1. Criar projeto no Supabase.
2. Rodar a migration em `supabase/migrations`.
3. Conectar autenticacao e permissoes.
4. Substituir dados locais por consultas reais.
5. Publicar na Vercel.
6. Integrar webhook da Kiwify para liberação automática de acesso.
