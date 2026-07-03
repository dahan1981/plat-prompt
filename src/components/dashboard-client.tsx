"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { IdeaCard, type IdeaRowVisual } from "@/components/ideas/idea-card";
import { bonusItems, checklistItems, contentIdeas, formats, niches, objectives } from "@/lib/data";
import type { BonusItem, ChecklistItem, ContentIdea } from "@/types/content";

type Section = "dashboard" | "ideias" | "bonus" | "prompts" | "roteiros" | "checklist" | "favoritos" | "admin";
type LibraryItem = ContentIdea | BonusItem;
type ChecklistStatus = ChecklistItem["status"];

type ChecklistState = Record<string, ChecklistStatus>;

type DashboardClientProps = {
  initialSection: Section;
};

const rowVisuals: IdeaRowVisual[] = [
  { icon: "video", tone: "terracotta" },
  { icon: "chat", tone: "taupe" },
  { icon: "gift", tone: "sand" },
  { icon: "edit", tone: "clay" },
  { icon: "clipboard", tone: "stone" },
  { icon: "bulb", tone: "cream" }
];

const promptTemplates = [
  {
    id: "prompt-contexto",
    title: "Criar contexto completo para IA",
    category: "Preparação",
    description: "Organiza nicho, público, oferta, objetivo e tom de voz antes de pedir ideias.",
    content: "Crie um contexto estratégico para minha marca com nicho, público-alvo, oferta principal, tom de voz e objetivo de conteúdo.",
    usageInstructions: "Use antes de pedir ideias para qualquer IA. Quanto mais específico o contexto, melhor a resposta."
  },
  {
    id: "prompt-ideias",
    title: "Gerar novas ideias de conteúdo",
    category: "Geração de ideias",
    description: "Pede ideias no mesmo padrão dos cards da plataforma.",
    content: "Gere ideias com título, objetivo, formato ideal, dica de execução, exemplo aplicado ao nicho, observação e CTA sugerido.",
    usageInstructions: "Combine com objetivo, formato, dificuldade e intenção do conteúdo."
  },
  {
    id: "prompt-roteiro",
    title: "Transformar ideia em roteiro",
    category: "Roteiro",
    description: "Converte uma ideia selecionada em roteiro prático para reels, stories ou carrossel.",
    content: "Transforme esta ideia em um roteiro com gancho, desenvolvimento, prova, CTA e sugestão de legenda.",
    usageInstructions: "Cole uma ideia da plataforma junto com este prompt."
  }
];

const storageKeys = {
  favorites: "plat-prompt:favorites",
  checklist: "plat-prompt:checklist",
  customChecklist: "plat-prompt:custom-checklist",
  period: "plat-prompt:period",
  objective: "plat-prompt:objective"
};

const defaultChecklistState = Object.fromEntries(checklistItems.map((item) => [item.id, item.status]));

export function DashboardClient({ initialSection }: DashboardClientProps) {
  const [activeSection] = useState<Section>(initialSection);
  const [query, setQuery] = useState("");
  const [objective, setObjective] = useState("todos");
  const [format, setFormat] = useState("todos");
  const [niche, setNiche] = useState("todos");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [checklistState, setChecklistState] = useState<ChecklistState>(defaultChecklistState);
  const [customChecklist, setCustomChecklist] = useState<ChecklistItem[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [period, setPeriod] = useState("2024-05");
  const [currentObjective, setCurrentObjective] = useState("Aumentar vendas com conteúdo");
  const [objectiveDraft, setObjectiveDraft] = useState("Aumentar vendas com conteúdo");
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [promptBrief, setPromptBrief] = useState({
    niche: "Marketing Digital",
    objective: "Aumentar vendas",
    tone: "claro, próximo e estratégico",
    format: "Reels"
  });
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setFavorites(readJson<string[]>(storageKeys.favorites, []));
      setChecklistState(readJson<ChecklistState>(storageKeys.checklist, defaultChecklistState));
      setCustomChecklist(readJson<ChecklistItem[]>(storageKeys.customChecklist, []));
      const storedObjective = readJson<string>(storageKeys.objective, "Aumentar vendas com conteúdo");
      setPeriod(readJson<string>(storageKeys.period, "2024-05"));
      setCurrentObjective(storedObjective);
      setObjectiveDraft(storedObjective);
      setStorageLoaded(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    writeJson(storageKeys.favorites, favorites);
  }, [favorites, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    writeJson(storageKeys.checklist, checklistState);
  }, [checklistState, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    writeJson(storageKeys.customChecklist, customChecklist);
  }, [customChecklist, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    writeJson(storageKeys.period, period);
  }, [period, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    writeJson(storageKeys.objective, currentObjective);
  }, [currentObjective, storageLoaded]);

  const filteredIdeas = useMemo(() => {
    return contentIdeas.filter((idea) => {
      const normalizedQuery = normalize(query);
      const matchesQuery =
        !normalizedQuery ||
        normalize([idea.title, idea.description, idea.objective, idea.idealFormat, idea.niche].join(" ")).includes(normalizedQuery);

      return (
        matchesQuery &&
        (objective === "todos" || idea.objective === objective) &&
        (format === "todos" || idea.idealFormat === format) &&
        (niche === "todos" || idea.niche === niche) &&
        (activeSection !== "favoritos" || favorites.includes(idea.id))
      );
    });
  }, [activeSection, favorites, format, niche, objective, query]);

  const allChecklist = useMemo(() => [...checklistItems, ...customChecklist], [customChecklist]);
  const checklistMetrics = useMemo(() => getChecklistMetrics(allChecklist, checklistState), [allChecklist, checklistState]);
  const usageMetrics = useMemo(() => getUsageMetrics(contentIdeas), []);

  function toggleFavorite(id: string) {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function updateChecklistStatus(id: string, status: ChecklistStatus) {
    setChecklistState((current) => ({ ...current, [id]: status }));
  }

  function toggleChecklistFromDashboard(id: string) {
    const item = allChecklist.find((checklistItem) => checklistItem.id === id);
    const currentStatus = checklistState[id] ?? item?.status ?? "nao_iniciado";
    updateChecklistStatus(id, currentStatus === "concluido" ? "nao_iniciado" : "concluido");
  }

  function saveObjective() {
    const cleanedObjective = objectiveDraft.trim();

    if (!cleanedObjective) {
      return;
    }

    setCurrentObjective(cleanedObjective);
    setObjectiveDraft(cleanedObjective);
    setIsEditingObjective(false);
  }

  function cancelObjectiveEdit() {
    setObjectiveDraft(currentObjective);
    setIsEditingObjective(false);
  }

  function addChecklistItem(title: string) {
    const cleanedTitle = title.trim();

    if (!cleanedTitle) {
      return;
    }

    const item: ChecklistItem = {
      id: `custom-${Date.now()}`,
      title: cleanedTitle,
      goal: "Aumentar vendas com conteúdo",
      objective: "Ação adicionada pelo usuário.",
      action: cleanedTitle,
      suggestedFrequency: "Personalizado",
      status: "nao_iniciado"
    };

    setCustomChecklist((current) => [...current, item]);
    setChecklistState((current) => ({ ...current, [item.id]: "nao_iniciado" }));
  }

  function removeChecklistItem(id: string) {
    setCustomChecklist((current) => current.filter((item) => item.id !== id));
    setChecklistState((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function generatePrompt() {
    const nextPrompt = `Atue como estrategista de conteúdo. Meu nicho é ${promptBrief.niche}. Meu objetivo é ${promptBrief.objective}. Quero criar um conteúdo no formato ${promptBrief.format}, com tom de voz ${promptBrief.tone}. Gere 5 ideias com: título, objetivo, formato ideal, dica de execução, exemplo aplicado ao nicho, observação importante e CTA sugerido.`;
    setGeneratedPrompt(nextPrompt);
  }

  return (
    <AppShell activeSection={activeSection}>
      <section className="workspace-heading">
        <h1>{getSectionTitle(activeSection)}</h1>
      </section>

      {activeSection === "dashboard" && (
        <DashboardView
          period={period}
          setPeriod={setPeriod}
          currentObjective={currentObjective}
          objectiveDraft={objectiveDraft}
          setObjectiveDraft={setObjectiveDraft}
          isEditingObjective={isEditingObjective}
          setIsEditingObjective={setIsEditingObjective}
          onSaveObjective={saveObjective}
          onCancelObjective={cancelObjectiveEdit}
          checklistMetrics={checklistMetrics}
          checklist={allChecklist}
          checklistState={checklistState}
          onChecklistToggle={toggleChecklistFromDashboard}
          usageMetrics={usageMetrics}
          favoritesCount={favorites.length}
          ideasCount={contentIdeas.length}
        />
      )}

      {(activeSection === "ideias" || activeSection === "favoritos") && (
        <IdeasWorkspace
          query={query}
          setQuery={setQuery}
          objective={objective}
          setObjective={setObjective}
          format={format}
          setFormat={setFormat}
          niche={niche}
          setNiche={setNiche}
          ideas={filteredIdeas}
          favorites={favorites}
          onOpen={setSelectedItem}
          onFavorite={toggleFavorite}
        />
      )}

      {activeSection === "bonus" && <ResourceWorkspace title="Bônus" items={bonusItems} onOpen={setSelectedItem} />}
      {activeSection === "prompts" && (
        <PromptsWorkspace
          items={promptTemplates}
          promptBrief={promptBrief}
          setPromptBrief={setPromptBrief}
          generatedPrompt={generatedPrompt}
          onGenerate={generatePrompt}
          onOpen={setSelectedItem}
        />
      )}
      {activeSection === "roteiros" && <ScriptsPlaceholder />}
      {activeSection === "checklist" && (
        <ChecklistWorkspace
          checklist={allChecklist}
          checklistState={checklistState}
          metrics={checklistMetrics}
          onStatusChange={updateChecklistStatus}
          onAdd={addChecklistItem}
          onRemove={removeChecklistItem}
        />
      )}
      {activeSection === "admin" && <AdminView />}

      {selectedItem && (
        <DetailDialog
          item={selectedItem}
          isFavorite={"idealFormat" in selectedItem && favorites.includes(selectedItem.id)}
          onClose={() => setSelectedItem(null)}
          onFavorite={"idealFormat" in selectedItem ? () => toggleFavorite(selectedItem.id) : undefined}
        />
      )}
    </AppShell>
  );
}

function DashboardView({
  period,
  setPeriod,
  currentObjective,
  objectiveDraft,
  setObjectiveDraft,
  isEditingObjective,
  setIsEditingObjective,
  onSaveObjective,
  onCancelObjective,
  checklistMetrics,
  checklist,
  checklistState,
  onChecklistToggle,
  usageMetrics,
  favoritesCount,
  ideasCount
}: {
  period: string;
  setPeriod: (period: string) => void;
  currentObjective: string;
  objectiveDraft: string;
  setObjectiveDraft: (objective: string) => void;
  isEditingObjective: boolean;
  setIsEditingObjective: (isEditing: boolean) => void;
  onSaveObjective: () => void;
  onCancelObjective: () => void;
  checklistMetrics: ReturnType<typeof getChecklistMetrics>;
  checklist: ChecklistItem[];
  checklistState: ChecklistState;
  onChecklistToggle: (id: string) => void;
  usageMetrics: ReturnType<typeof getUsageMetrics>;
  favoritesCount: number;
  ideasCount: number;
}) {
  return (
    <div className="dashboard-overview">
      <section className="metric-panel objective-panel">
        <header>
          <div className="objective-title">
            <span>Objetivo atual</span>
            {isEditingObjective ? (
              <input
                className="objective-edit-input"
                value={objectiveDraft}
                onChange={(event) => setObjectiveDraft(event.target.value)}
                aria-label="Editar objetivo atual"
                autoFocus
              />
            ) : (
              <div className="objective-heading-row">
                <h2>{currentObjective}</h2>
                <button className="objective-edit-button" type="button" onClick={() => setIsEditingObjective(true)} aria-label="Editar objetivo atual">
                  <PencilIcon />
                </button>
              </div>
            )}
          </div>
          <div className="objective-controls">
            <label className="period-picker">
              <span>Período</span>
              <input type="month" value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Período do objetivo atual" />
              <strong>{formatMonthLabel(period)}</strong>
            </label>
            {isEditingObjective ? (
              <div className="objective-actions" aria-label="Ações do objetivo atual">
                <button type="button" onClick={onSaveObjective}>
                  Salvar
                </button>
                <button type="button" onClick={onCancelObjective}>
                  Cancelar
                </button>
              </div>
            ) : null}
          </div>
        </header>
        <div className="objective-body">
          <div className="target-symbol">
            <TargetIcon />
          </div>
          <p>Use este objetivo para orientar ideias, prompts, roteiros e checklist da semana.</p>
        </div>
      </section>

      <section className="metric-panel checklist-panel">
        <header>
          <span>Progresso do checklist</span>
          <strong>{checklistMetrics.completed} de {checklistMetrics.total} concluídos</strong>
        </header>
        <div className="progress-summary">
          <strong>{checklistMetrics.percent}%</strong>
          <span>{checklistMetrics.open} pendentes</span>
        </div>
        <div className="progress-track">
          <span style={{ width: `${checklistMetrics.percent}%` }} />
        </div>
        <ul className="checklist-list compact">
          {checklist.slice(0, 5).map((item) => (
            <li className={checklistState[item.id] === "concluido" ? "done" : ""} key={item.id}>
              <button
                type="button"
                onClick={() => onChecklistToggle(item.id)}
                aria-label={checklistState[item.id] === "concluido" ? `Marcar ${item.title} como pendente` : `Marcar ${item.title} como concluído`}
              />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
        <a className="checklist-favorites-link" href="/favoritos">
          Ver favoritos relacionados
          <ChevronRightIcon />
        </a>
      </section>

      <section className="stat-strip">
        <article>
          <span>Ideias disponíveis</span>
          <strong>{ideasCount}</strong>
        </article>
        <a href="/favoritos">
          <span>Favoritas</span>
          <strong>{favoritesCount}</strong>
        </a>
        <article>
          <span>Checklist</span>
          <strong>{checklistMetrics.percent}%</strong>
        </article>
      </section>

      <UsagePanel title="Objetivos mais usados" data={usageMetrics.objectives} />
      <UsagePanel title="Formatos mais usados" data={usageMetrics.formats} />
      <UsagePanel title="Nichos mais usados" data={usageMetrics.niches} />
    </div>
  );
}

function IdeasWorkspace({
  query,
  setQuery,
  objective,
  setObjective,
  format,
  setFormat,
  niche,
  setNiche,
  ideas,
  favorites,
  onOpen,
  onFavorite
}: {
  query: string;
  setQuery: (query: string) => void;
  objective: string;
  setObjective: (objective: string) => void;
  format: string;
  setFormat: (format: string) => void;
  niche: string;
  setNiche: (niche: string) => void;
  ideas: ContentIdea[];
  favorites: string[];
  onOpen: (item: ContentIdea) => void;
  onFavorite: (id: string) => void;
}) {
  return (
    <>
      <SearchFilters
        query={query}
        setQuery={setQuery}
        objective={objective}
        setObjective={setObjective}
        format={format}
        setFormat={setFormat}
        niche={niche}
        setNiche={setNiche}
      />

      <section className="idea-table" aria-label="Lista de ideias">
        <header className="list-toolbar">
          <span>{ideas.length} ideias encontradas</span>
          <label>
            Ordenar por:
            <select aria-label="Ordenar ideias" defaultValue="recentes">
              <option value="recentes">Mais recentes</option>
              <option value="favoritas">Favoritas</option>
              <option value="objetivo">Objetivo</option>
            </select>
          </label>
        </header>

        <div className="idea-list">
          {ideas.map((idea, index) => {
            const visual = rowVisuals[index % rowVisuals.length];

            return (
              <IdeaCard
                key={idea.id}
                idea={idea}
                icon={visual.icon}
                tone={visual.tone}
                isFavorite={favorites.includes(idea.id)}
                onOpen={() => onOpen(idea)}
                onCopy={() => copyText(formatIdeaForCopy(idea))}
                onFavorite={() => onFavorite(idea.id)}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}

function SearchFilters({
  query,
  setQuery,
  objective,
  setObjective,
  format,
  setFormat,
  niche,
  setNiche
}: {
  query: string;
  setQuery: (query: string) => void;
  objective: string;
  setObjective: (objective: string) => void;
  format: string;
  setFormat: (format: string) => void;
  niche: string;
  setNiche: (niche: string) => void;
}) {
  return (
    <section className="top-search library-search" aria-label="Busca e filtros">
      <label className="search-control">
        <span className="sr-only">Buscar ideias</span>
        <SearchIcon />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ideias" />
      </label>

      <label className="select-control">
        <span className="sr-only">Objetivo</span>
        <select value={objective} onChange={(event) => setObjective(event.target.value)}>
          <option value="todos">Objetivo</option>
          {objectives.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="select-control">
        <span className="sr-only">Formato</span>
        <select value={format} onChange={(event) => setFormat(event.target.value)}>
          <option value="todos">Formato</option>
          {formats.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="select-control">
        <span className="sr-only">Nicho</span>
        <select value={niche} onChange={(event) => setNiche(event.target.value)}>
          <option value="todos">Nicho</option>
          {niches.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

function ResourceWorkspace({
  title,
  items,
  onOpen
}: {
  title: string;
  items: BonusItem[];
  onOpen: (item: BonusItem) => void;
}) {
  return (
    <section className="resource-library" aria-label={title}>
      {items.map((item) => (
        <button className="resource-tile" key={item.id} type="button" onClick={() => onOpen(item)}>
          <span>{item.category}</span>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <small>{item.usageInstructions}</small>
        </button>
      ))}
    </section>
  );
}

function PromptsWorkspace({
  items,
  promptBrief,
  setPromptBrief,
  generatedPrompt,
  onGenerate,
  onOpen
}: {
  items: BonusItem[];
  promptBrief: { niche: string; objective: string; tone: string; format: string };
  setPromptBrief: (brief: { niche: string; objective: string; tone: string; format: string }) => void;
  generatedPrompt: string;
  onGenerate: () => void;
  onOpen: (item: BonusItem) => void;
}) {
  return (
    <div className="prompt-layout">
      <section className="prompt-generator">
        <span>Gerador de prompt</span>
        <h2>Crie um prompt pronto para usar em IA</h2>
        <p>Preencha o contexto abaixo para gerar uma instrução mais clara e útil.</p>
        <div className="prompt-form">
          <label>
            Nicho
            <input value={promptBrief.niche} onChange={(event) => setPromptBrief({ ...promptBrief, niche: event.target.value })} />
          </label>
          <label>
            Objetivo
            <input value={promptBrief.objective} onChange={(event) => setPromptBrief({ ...promptBrief, objective: event.target.value })} />
          </label>
          <label>
            Tom de voz
            <input value={promptBrief.tone} onChange={(event) => setPromptBrief({ ...promptBrief, tone: event.target.value })} />
          </label>
          <label>
            Formato
            <input value={promptBrief.format} onChange={(event) => setPromptBrief({ ...promptBrief, format: event.target.value })} />
          </label>
        </div>
        <button type="button" onClick={onGenerate}>
          Gerar prompt
        </button>
        {generatedPrompt && (
          <div className="generated-prompt">
            <p>{generatedPrompt}</p>
            <button type="button" onClick={() => copyText(generatedPrompt)}>
              Copiar prompt gerado
            </button>
          </div>
        )}
      </section>
      <ResourceWorkspace title="Prompts prontos" items={items} onOpen={onOpen} />
    </div>
  );
}

function ScriptsPlaceholder() {
  return (
    <section className="empty-state">
      <span>Roteiros</span>
      <h2>Este ambiente será organizado quando o conteúdo final estiver disponível.</h2>
      <p>Por enquanto, a estrutura está preparada para receber roteiros clicáveis com objetivo, sequência, observações e botão de copiar.</p>
    </section>
  );
}

function ChecklistWorkspace({
  checklist,
  checklistState,
  metrics,
  onStatusChange,
  onAdd,
  onRemove
}: {
  checklist: ChecklistItem[];
  checklistState: ChecklistState;
  metrics: ReturnType<typeof getChecklistMetrics>;
  onStatusChange: (id: string, status: ChecklistStatus) => void;
  onAdd: (title: string) => void;
  onRemove: (id: string) => void;
}) {
  const [draft, setDraft] = useState("");

  return (
    <div className="checklist-workspace">
      <section className="checklist-summary">
        <div>
          <span>Progressão do checklist</span>
          <h2>{metrics.percent}% concluído</h2>
          <p>{metrics.completed} de {metrics.total} tarefas concluídas. Esta progressão também aparece no Dashboard.</p>
        </div>
        <div className="progress-track">
          <span style={{ width: `${metrics.percent}%` }} />
        </div>
      </section>

      <form
        className="checklist-add"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(draft);
          setDraft("");
        }}
      >
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Adicionar nova ação ao checklist" />
        <button type="submit">Adicionar</button>
      </form>

      <section className="checklist-editor" aria-label="Checklist editável">
        {checklist.map((item) => {
          const status = checklistState[item.id] ?? item.status;
          const isDone = status === "concluido";
          const isCustom = item.id.startsWith("custom-");

          return (
            <article className={isDone ? "checklist-task done" : "checklist-task"} key={item.id}>
              <button
                className="check-toggle"
                type="button"
                aria-label={isDone ? "Marcar como pendente" : "Marcar como concluído"}
                onClick={() => onStatusChange(item.id, isDone ? "nao_iniciado" : "concluido")}
              >
                {isDone ? "✓" : ""}
              </button>
              <div>
                <h2>{item.title}</h2>
                <p>{item.action}</p>
                <small>{item.suggestedFrequency}</small>
              </div>
              <button className="edit-task" type="button" onClick={() => onStatusChange(item.id, status === "em_andamento" ? "nao_iniciado" : "em_andamento")}>
                {status === "em_andamento" ? "Pausar" : "Em andamento"}
              </button>
              {isCustom && (
                <button className="remove-task" type="button" onClick={() => onRemove(item.id)}>
                  Remover
                </button>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

function UsagePanel({ title, data }: { title: string; data: Array<{ label: string; count: number; percent: number }> }) {
  return (
    <section className="metric-panel usage-panel">
      <h2>{title}</h2>
      <div className="usage-list">
        {data.map((item) => (
          <div className="usage-row" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.count}</strong>
            <div>
              <span style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DetailDialog({
  item,
  isFavorite,
  onClose,
  onFavorite
}: {
  item: LibraryItem;
  isFavorite: boolean;
  onClose: () => void;
  onFavorite?: () => void;
}) {
  const isIdea = "idealFormat" in item;
  const copyValue = isIdea ? formatIdeaForCopy(item) : `${item.title}\n${item.content}\nComo usar: ${item.usageInstructions}`;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="detail-dialog" role="dialog" aria-modal="true" aria-label={item.title} onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <span>{isIdea ? `${item.objective} / ${item.idealFormat}` : item.category}</span>
          <button type="button" onClick={onClose} aria-label="Fechar detalhes">
            ×
          </button>
        </header>
        <h2>{item.title}</h2>
        <p>{item.description}</p>

        {isIdea ? (
          <div className="detail-content">
            <section>
              <strong>Dica de execução</strong>
              <p>{item.executionTip}</p>
            </section>
            <section>
              <strong>Exemplos aplicados</strong>
              <ul>
                {item.nicheExamples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </section>
            <section>
              <strong>Ações recomendadas</strong>
              <ul>
                {item.recommendedActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <div className="detail-content">
            <section>
              <strong>Conteúdo</strong>
              <p>{item.content}</p>
            </section>
            <section>
              <strong>Como usar</strong>
              <p>{item.usageInstructions}</p>
            </section>
          </div>
        )}

        <footer>
          {onFavorite && (
            <button type="button" className="outline-button" onClick={onFavorite}>
              {isFavorite ? "Remover dos favoritos" : "Favoritar"}
            </button>
          )}
          <button type="button" onClick={() => copyText(copyValue)}>
            Copiar
          </button>
        </footer>
      </section>
    </div>
  );
}

function AdminView() {
  return (
    <section className="admin-board">
      <article>
        <h2>Liberação manual</h2>
        <p>Use esta área para liberar acesso por email enquanto a Kiwify ainda não estiver conectada.</p>
        <form className="inline-form">
          <input type="email" placeholder="email@comprador.com" />
          <button type="button">Liberar acesso</button>
        </form>
      </article>

      <article>
        <h2>Conteúdos</h2>
        <div className="admin-row">
          <span>Ideias cadastradas</span>
          <strong>{contentIdeas.length}</strong>
        </div>
        <div className="admin-row">
          <span>Bônus e prompts</span>
          <strong>{bonusItems.length}</strong>
        </div>
        <div className="admin-row">
          <span>Checklists</span>
          <strong>{checklistItems.length}</strong>
        </div>
      </article>
    </section>
  );
}

function getSectionTitle(section: Section) {
  const titles: Record<Section, string> = {
    dashboard: "Dashboard",
    ideias: "Ideias",
    bonus: "Bônus",
    prompts: "Prompts",
    roteiros: "Roteiros",
    checklist: "Checklist",
    favoritos: "Favoritos",
    admin: "Painel administrativo"
  };

  return titles[section];
}

function getChecklistMetrics(checklist: ChecklistItem[], state: ChecklistState) {
  const total = checklist.length || 1;
  const completed = checklist.filter((item) => (state[item.id] ?? item.status) === "concluido").length;
  const percent = Math.round((completed / total) * 100);

  return {
    total,
    completed,
    open: total - completed,
    percent
  };
}

function getUsageMetrics(ideas: ContentIdea[]) {
  return {
    objectives: countBy(ideas.map((idea) => idea.objective)),
    formats: countBy(ideas.map((idea) => idea.idealFormat)),
    niches: countBy(ideas.map((idea) => idea.niche))
  };
}

function countBy(values: string[]) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
  const max = Math.max(...Object.values(counts), 1);

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label, count, percent: Math.round((count / max) * 100) }));
}

function formatMonthLabel(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  if (!year || !month || Number.isNaN(date.getTime())) {
    return "Selecionar período";
  }

  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(date);

  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)}/${year}`;
}

function formatIdeaForCopy(idea: ContentIdea) {
  return `${idea.title}\nObjetivo: ${idea.objective}\nFormato: ${idea.idealFormat}\nNicho: ${idea.niche}\nDica: ${idea.executionTip}\nAções: ${idea.recommendedActions.join(", ")}`;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function copyText(value: string) {
  if (navigator.clipboard) {
    void navigator.clipboard.writeText(value);
  }
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 12 20 4" />
      <path d="M17 4h3v3" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}
