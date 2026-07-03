export type ContentStatus = "nao_iniciado" | "vou_usar" | "ja_usei";

export type ContentIdea = {
  id: string;
  title: string;
  description: string;
  objective: string;
  idealFormat: string;
  niche: string;
  difficulty: "facil" | "medio" | "avancado";
  intention: "atrair" | "engajar" | "vender" | "educar" | "autoridade" | "conexao" | "desejo";
  executionTip: string;
  nicheExamples: string[];
  observations: string;
  recommendedActions: string[];
};

export type BonusItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  usageInstructions: string;
};

export type ChecklistItem = {
  id: string;
  title: string;
  goal: string;
  objective: string;
  action: string;
  suggestedFrequency: string;
  status: "nao_iniciado" | "em_andamento" | "concluido";
};
