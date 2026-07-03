import type { BonusItem, ChecklistItem, ContentIdea } from "@/types/content";

export const contentIdeas: ContentIdea[] = [
  {
    id: "ideia-bastidores",
    title: "Bastidor que gera conexao",
    description: "Mostre uma parte real do processo para aproximar a audiencia da marca.",
    objective: "Gerar conexao",
    idealFormat: "Stories",
    niche: "Servicos criativos",
    difficulty: "facil",
    intention: "conexao",
    executionTip: "Grave um trecho simples do processo e explique o que normalmente o cliente nao ve.",
    nicheExamples: [
      "Designer: mostrar a organizacao de referencias antes de criar uma identidade visual.",
      "Consultora: mostrar como prepara uma reuniao estrategica com cliente."
    ],
    observations: "Funciona melhor quando o conteudo parece natural e nao excessivamente produzido.",
    recommendedActions: ["Publicar nos stories", "Salvar como destaque", "Adicionar uma pergunta no final"]
  },
  {
    id: "ideia-erro-comum",
    title: "Erro comum antes da compra",
    description: "Explique um erro que impede o cliente de chegar ao resultado que deseja.",
    objective: "Educar e vender",
    idealFormat: "Carrossel",
    niche: "Produtos digitais",
    difficulty: "medio",
    intention: "vender",
    executionTip: "Abra com uma frase direta e mostre o caminho correto em poucos passos.",
    nicheExamples: [
      "Mentora: explicar por que postar sem estrategia reduz conversao.",
      "Infoprodutora: mostrar por que copiar tendencias nao cria autoridade."
    ],
    observations: "Evite tom acusatorio. O conteudo deve orientar e conduzir para a solucao.",
    recommendedActions: ["Criar CTA para diagnostico", "Reaproveitar como roteiro curto", "Adicionar prova social"]
  },
  {
    id: "ideia-prova-transformacao",
    title: "Antes e depois de uma transformacao",
    description: "Mostre uma mudanca concreta gerada pelo produto, servico ou metodo.",
    objective: "Gerar desejo",
    idealFormat: "Post unico",
    niche: "Beleza e estetica",
    difficulty: "facil",
    intention: "desejo",
    executionTip: "Use uma comparacao clara e explique o que foi feito para chegar ao resultado.",
    nicheExamples: [
      "Estetica: evolucao de um tratamento com explicacao curta.",
      "Organizacao: antes e depois de um ambiente funcional."
    ],
    observations: "Quando envolver resultados reais, use apenas conteudos autorizados.",
    recommendedActions: ["Inserir CTA para agendamento", "Fixar nos destaques", "Transformar em depoimento"]
  },
  {
    id: "ideia-mito",
    title: "Mito que trava a audiencia",
    description: "Quebre uma crenca comum que impede a pessoa de agir.",
    objective: "Gerar autoridade",
    idealFormat: "Reels",
    niche: "Educacao",
    difficulty: "medio",
    intention: "autoridade",
    executionTip: "Comece com o mito, mostre a verdade e finalize com uma acao simples.",
    nicheExamples: [
      "Professora: explicar por que aprender nao depende apenas de motivacao.",
      "Mentora: mostrar que estrategia vem antes de frequencia."
    ],
    observations: "Quanto mais especifico o mito, maior a chance de gerar identificacao.",
    recommendedActions: ["Criar legenda complementar", "Responder comentarios", "Salvar como ideia recorrente"]
  }
];

export const bonusItems: BonusItem[] = [
  {
    id: "bonus-contexto-ia",
    title: "Prompt para criar contexto antes da IA",
    category: "Prompts de contexto",
    description: "Ajuda a pessoa a organizar nicho, publico, oferta e tom de voz antes de pedir ideias.",
    content:
      "Antes de gerar ideias, considere meu nicho, meu publico-alvo, minha oferta principal, meu tom de voz e o objetivo do conteudo.",
    usageInstructions: "Copie, complete com suas informacoes e use antes de pedir novas ideias em uma IA."
  },
  {
    id: "bonus-stories",
    title: "Roteiro rapido de stories para conexao",
    category: "Roteiros de stories",
    description: "Sequencia simples para criar proximidade sem parecer forca de venda.",
    content: "Story 1: bastidor. Story 2: aprendizado. Story 3: pergunta. Story 4: convite leve.",
    usageInstructions: "Adapte a sequencia para um acontecimento real do dia."
  },
  {
    id: "bonus-novas-ideias",
    title: "Prompt para gerar novas ideias",
    category: "Geracao de ideias",
    description: "Modelo para pedir novas ideias no mesmo formato dos cards da plataforma.",
    content:
      "Gere 5 ideias de conteudo com titulo, objetivo, formato ideal, dica de execucao, exemplo aplicado ao meu nicho e CTA sugerido.",
    usageInstructions: "Use depois de preencher contexto, objetivo e formato desejado."
  }
];

export const checklistItems: ChecklistItem[] = [
  {
    id: "check-conexao",
    title: "Conteudo de conexao",
    goal: "Gerar conexao com a audiencia",
    objective: "Fazer a audiencia se identificar com a marca.",
    action: "Postar um bastidor ou uma historia pessoal conectada ao posicionamento.",
    suggestedFrequency: "1 vez por semana",
    status: "em_andamento"
  },
  {
    id: "check-autoridade",
    title: "Conteudo de autoridade",
    goal: "Reforcar percepcao de especialista",
    objective: "Mostrar conhecimento de forma clara e aplicavel.",
    action: "Publicar uma explicacao curta sobre um erro, mito ou decisao estrategica.",
    suggestedFrequency: "2 vezes por semana",
    status: "nao_iniciado"
  },
  {
    id: "check-venda",
    title: "Conteudo de venda",
    goal: "Conduzir para uma oferta",
    objective: "Apresentar valor e proximo passo sem depender apenas de promocao.",
    action: "Criar um conteudo com dor, solucao, prova e CTA direto.",
    suggestedFrequency: "1 vez por semana",
    status: "nao_iniciado"
  }
];

export const objectives = Array.from(new Set(contentIdeas.map((idea) => idea.objective)));
export const formats = Array.from(new Set(contentIdeas.map((idea) => idea.idealFormat)));
export const niches = Array.from(new Set(contentIdeas.map((idea) => idea.niche)));
