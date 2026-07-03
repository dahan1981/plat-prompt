"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { IdeaCard } from "@/components/ideas/idea-card";
import { bonusItems, checklistItems, contentIdeas, formats, niches, objectives } from "@/lib/data";
import type { ContentStatus } from "@/types/content";

type Section = "dashboard" | "ideias" | "bonus" | "prompts" | "roteiros" | "checklist" | "favoritos" | "admin";

type DashboardClientProps = {
  initialSection: Section;
};

const rowVisuals = [
  { icon: "video", tone: "terracotta" },
  { icon: "chat", tone: "taupe" },
  { icon: "gift", tone: "sand" },
  { icon: "edit", tone: "clay" },
  { icon: "clipboard", tone: "stone" },
  { icon: "bulb", tone: "cream" }
] as const;

export function DashboardClient({ initialSection }: DashboardClientProps) {
  const [activeSection] = useState<Section>(initialSection);
  const [query, setQuery] = useState("");
  const [objective, setObjective] = useState("todos");
  const [format, setFormat] = useState("todos");
  const [niche, setNiche] = useState("todos");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, ContentStatus>>({});

  const filteredIdeas = useMemo(() => {
    return contentIdeas.filter((idea) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        !normalizedQuery ||
        [idea.title, idea.description, idea.objective, idea.idealFormat, idea.niche]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return (
        matchesQuery &&
        (objective === "todos" || idea.objective === objective) &&
        (format === "todos" || idea.idealFormat === format) &&
        (niche === "todos" || idea.niche === niche) &&
        (activeSection !== "favoritos" || favorites.includes(idea.id))
      );
    });
  }, [activeSection, favorites, format, niche, objective, query]);

  function toggleFavorite(id: string) {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function updateStatus(id: string, status: ContentStatus) {
    setProgress((current) => ({ ...current, [id]: status }));
  }

  async function copyIdea(id: string) {
    const idea = contentIdeas.find((item) => item.id === id);

    if (!idea || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(
      `${idea.title}\nObjetivo: ${idea.objective}\nFormato: ${idea.idealFormat}\nDica: ${idea.executionTip}`
    );
  }

  return (
    <AppShell activeSection={activeSection}>
      <section className="workspace-heading">
        <h1>{getSectionTitle(activeSection)}</h1>
      </section>

      {(activeSection === "dashboard" || activeSection === "ideias" || activeSection === "favoritos") && (
        <>
          <section className="top-search" aria-label="Busca e filtros">
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

            <button className="filter-button" type="button" aria-label="Filtros avançados">
              <SlidersIcon />
            </button>

            <button className="search-button" type="button">
              Buscar ideias
            </button>
          </section>

          <div className="dashboard-grid">
            <section className="idea-table" aria-label="Lista de ideias">
              <header className="list-toolbar">
                <span>128 ideias encontradas</span>
                <label>
                  Ordenar por:
                  <select aria-label="Ordenar ideias" defaultValue="recentes">
                    <option value="recentes">Mais recentes</option>
                    <option value="favoritas">Favoritas</option>
                    <option value="usadas">Já usadas</option>
                  </select>
                </label>
              </header>

              <div className="idea-list">
                {filteredIdeas.map((idea, index) => {
                  const visual = rowVisuals[index % rowVisuals.length];

                  return (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      icon={visual.icon}
                      tone={visual.tone}
                      isFavorite={favorites.includes(idea.id)}
                      status={progress[idea.id] ?? "nao_iniciado"}
                      onCopy={() => copyIdea(idea.id)}
                      onFavorite={() => toggleFavorite(idea.id)}
                      onStatusChange={(status) => updateStatus(idea.id, status)}
                    />
                  );
                })}
              </div>
            </section>

            <aside className="right-rail" aria-label="Objetivo e progresso">
              <section className="rail-card objective-card">
                <header>
                  <h2>Objetivo atual</h2>
                  <button type="button">Editar</button>
                </header>
                <div className="objective-content">
                  <div className="target-symbol">
                    <TargetIcon />
                  </div>
                  <div>
                    <strong>Aumentar vendas com conteúdo</strong>
                    <span>Período: Maio/2024</span>
                  </div>
                </div>
              </section>

              <section className="rail-card checklist-card">
                <h2>Progresso do checklist</h2>
                <div className="progress-summary">
                  <strong>60%</strong>
                  <span>3 de 5 concluídos</span>
                </div>
                <div className="progress-track">
                  <span />
                </div>
                <ul className="checklist-list">
                  {checklistItems.map((item) => (
                    <li className={item.status === "concluido" ? "done" : ""} key={item.id}>
                      <span />
                      {item.title}
                    </li>
                  ))}
                </ul>
                <a href="/checklist">
                  Ver checklist completo
                  <ChevronIcon />
                </a>
              </section>
            </aside>
          </div>
        </>
      )}

      {activeSection === "bonus" && <BonusGrid category="Todos os bônus" />}
      {activeSection === "prompts" && <BonusGrid category="Prompts" promptOnly />}
      {activeSection === "roteiros" && <BonusGrid category="Roteiros de stories" scriptsOnly />}
      {activeSection === "checklist" && <ChecklistView />}
      {activeSection === "admin" && <AdminView />}
    </AppShell>
  );
}

function BonusGrid({
  category,
  promptOnly,
  scriptsOnly
}: {
  category: string;
  promptOnly?: boolean;
  scriptsOnly?: boolean;
}) {
  const items = bonusItems.filter((item) => {
    if (promptOnly) return item.category.toLowerCase().includes("prompt") || item.category.toLowerCase().includes("geração");
    if (scriptsOnly) return item.category.toLowerCase().includes("roteiro");
    return true;
  });

  return (
    <section className="content-grid" aria-label={category}>
      {items.map((item) => (
        <article className="resource-card" key={item.id}>
          <span>{item.category}</span>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <div className="resource-content">{item.content}</div>
          <small>{item.usageInstructions}</small>
          <button type="button">Copiar</button>
        </article>
      ))}
    </section>
  );
}

function ChecklistView() {
  return (
    <section className="content-grid">
      {checklistItems.map((item) => (
        <article className="resource-card" key={item.id}>
          <span>{item.suggestedFrequency}</span>
          <h2>{item.goal}</h2>
          <p>{item.objective}</p>
          <div className="resource-content">{item.action}</div>
          <button type="button">{item.status === "concluido" ? "Concluído" : "Marcar como feito"}</button>
        </article>
      ))}
    </section>
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

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 7h16" />
      <path d="M4 17h16" />
      <path d="M8 4v6" />
      <path d="M16 14v6" />
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

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
