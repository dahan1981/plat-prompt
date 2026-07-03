import type { BonusItem, ChecklistItem, ContentIdea } from "@/types/content";

export const contentIdeas: ContentIdea[] = [
  {
    id: "ideia-vender-todos-os-dias",
    title: "3 erros que te impedem de vender todos os dias",
    description: "Conteúdo direto para gerar identificação e autoridade.",
    objective: "Vendas",
    idealFormat: "Reels",
    niche: "Marketing Digital",
    difficulty: "medio",
    intention: "vender",
    executionTip: "Abra com os erros mais comuns e mostre o ajuste que aproxima a audiência da compra.",
    nicheExamples: ["Mentora: explicar por que postar sem estratégia reduz conversão.", "Infoprodutora: mostrar por que copiar tendências não cria autoridade."],
    observations: "Funciona melhor com linguagem direta e CTA simples.",
    recommendedActions: ["Publicar como reels", "Transformar em carrossel", "Adicionar CTA para conversa"]
  },
  {
    id: "ideia-conecta-e-vende",
    title: "Como criar conteúdo que conecta e vende",
    description: "Passo a passo para criar conteúdos que geram conexão.",
    objective: "Engajamento",
    idealFormat: "Carrossel",
    niche: "Marketing Digital",
    difficulty: "facil",
    intention: "conexao",
    executionTip: "Mostre um caminho simples: contexto, identificação, valor e convite.",
    nicheExamples: ["Consultora: apresentar uma sequência de conteúdo para a semana.", "Designer: mostrar como conecta bastidor com oferta."],
    observations: "Evite excesso de texto nos slides.",
    recommendedActions: ["Criar CTA para salvar", "Reaproveitar nos stories", "Responder dúvidas nos comentários"]
  },
  {
    id: "bonus-calendario-conteudo",
    title: "Bônus: Calendário de Conteúdo Pronto",
    description: "Calendário editável com ideias para 30 dias de conteúdo.",
    objective: "Organização",
    idealFormat: "Planilha",
    niche: "Marketing Digital",
    difficulty: "facil",
    intention: "educar",
    executionTip: "Use o calendário como ponto de partida e adapte os temas ao objetivo do mês.",
    nicheExamples: ["Social media: organizar pautas por intenção.", "Infoprodutora: separar conteúdos de venda e conexão."],
    observations: "Ideal para quem precisa de constância.",
    recommendedActions: ["Copiar calendário", "Adaptar para o nicho", "Revisar semanalmente"]
  },
  {
    id: "roteiro-story-bastidores",
    title: "Roteiro de Story: Dia de Bastidores",
    description: "Roteiro pronto para mostrar bastidores e gerar aproximação.",
    objective: "Conexão",
    idealFormat: "Stories",
    niche: "Moda",
    difficulty: "facil",
    intention: "conexao",
    executionTip: "Mostre uma ação real do dia e conecte com uma pergunta simples.",
    nicheExamples: ["Moda: mostrar preparação de peças antes de um lançamento.", "Beleza: mostrar organização do atendimento."],
    observations: "Quanto mais natural, melhor.",
    recommendedActions: ["Postar em 4 stories", "Adicionar enquete", "Salvar como destaque"]
  },
  {
    id: "checklist-planejamento",
    title: "Checklist: Planejamento de Conteúdo",
    description: "Checklist prático para planejar sua semana de conteúdos.",
    objective: "Organização",
    idealFormat: "Checklist",
    niche: "Geral",
    difficulty: "facil",
    intention: "educar",
    executionTip: "Defina objetivo, pauta, formato, CTA e prazo antes de produzir.",
    nicheExamples: ["Mentora: organizar conteúdos de autoridade.", "Loja: planejar conteúdos de produto e prova social."],
    observations: "Ajuda a reduzir decisões repetidas.",
    recommendedActions: ["Revisar toda segunda", "Marcar concluídos", "Ajustar pelos resultados"]
  },
  {
    id: "ideia-reels-atrair",
    title: "10 ideias de Reels para atrair seguidores",
    description: "Ideias rápidas para aumentar seu alcance e atrair seguidores.",
    objective: "Alcance",
    idealFormat: "Reels",
    niche: "Beleza",
    difficulty: "medio",
    intention: "atrair",
    executionTip: "Escolha uma ideia por dia e mantenha gancho, ritmo e CTA claros.",
    nicheExamples: ["Estética: mitos sobre cuidados diários.", "Maquiadora: transformação rápida com dica prática."],
    observations: "Use formatos curtos e fáceis de repetir.",
    recommendedActions: ["Gravar em lote", "Testar ganchos", "Analisar retenção"]
  }
];

export const bonusItems: BonusItem[] = [
  {
    id: "bonus-contexto-ia",
    title: "Prompt para criar contexto antes da IA",
    category: "Prompts de contexto",
    description: "Ajuda a pessoa a organizar nicho, público, oferta e tom de voz antes de pedir ideias.",
    content:
      "Antes de gerar ideias, considere meu nicho, meu público-alvo, minha oferta principal, meu tom de voz e o objetivo do conteúdo.",
    usageInstructions: "Copie, complete com suas informações e use antes de pedir novas ideias em uma IA."
  },
  {
    id: "bonus-stories",
    title: "Roteiro rápido de stories para conexão",
    category: "Roteiros de stories",
    description: "Sequência simples para criar proximidade sem parecer força de venda.",
    content: "Story 1: bastidor. Story 2: aprendizado. Story 3: pergunta. Story 4: convite leve.",
    usageInstructions: "Adapte a sequência para um acontecimento real do dia."
  },
  {
    id: "bonus-novas-ideias",
    title: "Prompt para gerar novas ideias",
    category: "Geração de ideias",
    description: "Modelo para pedir novas ideias no mesmo formato dos cards da plataforma.",
    content:
      "Gere 5 ideias de conteúdo com título, objetivo, formato ideal, dica de execução, exemplo aplicado ao meu nicho e CTA sugerido.",
    usageInstructions: "Use depois de preencher contexto, objetivo e formato desejado."
  }
];

export const checklistItems: ChecklistItem[] = [
  {
    id: "check-publico",
    title: "Definir público-alvo",
    goal: "Aumentar vendas com conteúdo",
    objective: "Clarear para quem o conteúdo está sendo criado.",
    action: "Descrever público, dores e desejo principal antes de planejar os posts.",
    suggestedFrequency: "Início do mês",
    status: "concluido"
  },
  {
    id: "check-dores",
    title: "Mapear dores e desejos",
    goal: "Aumentar vendas com conteúdo",
    objective: "Conectar conteúdo com necessidade real da audiência.",
    action: "Listar dúvidas, objeções e desejos que aparecem em conversas com clientes.",
    suggestedFrequency: "1 vez por mês",
    status: "concluido"
  },
  {
    id: "check-plano",
    title: "Criar plano de conteúdo",
    goal: "Aumentar vendas com conteúdo",
    objective: "Organizar temas por objetivo e formato.",
    action: "Distribuir conteúdos de alcance, conexão, autoridade e venda.",
    suggestedFrequency: "Semanal",
    status: "concluido"
  },
  {
    id: "check-produzir",
    title: "Produzir conteúdos",
    goal: "Aumentar vendas com conteúdo",
    objective: "Transformar planejamento em posts publicados.",
    action: "Produzir e agendar os conteúdos da semana.",
    suggestedFrequency: "Semanal",
    status: "em_andamento"
  },
  {
    id: "check-analisar",
    title: "Analisar resultados",
    goal: "Aumentar vendas com conteúdo",
    objective: "Entender quais ideias geram alcance, conexão e venda.",
    action: "Revisar métricas e selecionar aprendizados para a próxima semana.",
    suggestedFrequency: "Semanal",
    status: "nao_iniciado"
  }
];

export const objectives = Array.from(new Set(contentIdeas.map((idea) => idea.objective)));
export const formats = Array.from(new Set(contentIdeas.map((idea) => idea.idealFormat)));
export const niches = Array.from(new Set(contentIdeas.map((idea) => idea.niche)));
