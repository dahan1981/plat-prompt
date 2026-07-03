insert into public.products (slug, name, description)
values ('banco-de-ideias', 'Banco de Ideias', 'Banco de ideias de conteudo, prompts, bonus e checklists.')
on conflict (slug) do nothing;

insert into public.categories (name, description)
values
  ('Conteudo estrategico', 'Ideias para atrair, engajar, educar e vender.'),
  ('Bonus', 'Materiais complementares do produto.'),
  ('Checklist', 'Metas e acoes recorrentes.')
on conflict (name) do nothing;

insert into public.formats (name)
values ('Stories'), ('Carrossel'), ('Reels'), ('Post unico')
on conflict (name) do nothing;

insert into public.objectives (name, description)
values
  ('Gerar conexao', 'Aproximar audiencia e marca.'),
  ('Educar e vender', 'Ensinar enquanto conduz para uma oferta.'),
  ('Gerar autoridade', 'Reforcar percepcao de especialista.'),
  ('Gerar desejo', 'Mostrar transformacao e valor percebido.')
on conflict (name) do nothing;

insert into public.bonuses (title, category, description, content, usage_instructions)
values
  (
    'Prompt para criar contexto antes da IA',
    'Prompts de contexto',
    'Organiza nicho, publico, oferta e tom de voz antes de pedir ideias.',
    'Antes de gerar ideias, considere meu nicho, meu publico-alvo, minha oferta principal, meu tom de voz e o objetivo do conteudo.',
    'Copie, complete com suas informacoes e use antes de pedir novas ideias em uma IA.'
  )
on conflict do nothing;
