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

export function DashboardClient({ initialSection }: DashboardClientProps) {
  const [activeSection] = useState<Section>(initialSection);
  const [query, setQuery] = useState("");
  const [objective, setObjective] = useState("todos");
  const [format, setFormat] = useState("todos");
  const [niche, setNiche] = useState("todos");
  const [favorites, setFavorites] = useState<string[]>(["ideia-bastidores"]);
  const [progress, setProgress] = useState<Record<string, ContentStatus>>({
    "ideia-bastidores": "vou_usar",
    "ideia-prova-transformacao": "ja_usei"
  });

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
      <section className="workspace-header">
        <div>
          <p className="section-label">Banco de Ideias</p>
          <h1>{getSectionTitle(activeSection)}</h1>
          <p className="muted">{getSectionDescription(activeSection)}</p>
        </div>
        <a className="primary-action" href="/admin">
          Liberar acesso
        </a>
      </section>

      {(activeSection === "dashboard" || activeSection === "ideias" || activeSection === "favoritos") && (
        <>
          <section className="filters" aria-label="Filtros de ideias">
            <label className="search-field">
              Buscar ideias
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex: bastidor, venda, autoridade" />
            </label>
            <label>
              Objetivo
              <select value={objective} onChange={(event) => setObjective(event.target.value)}>
                <option value="todos">Todos</option>
                {objectives.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Formato
              <select value={format} onChange={(event) => setFormat(event.target.value)}>
                <option value="todos">Todos</option>
                {formats.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nicho
              <select value={niche} onChange={(event) => setNiche(event.target.value)}>
                <option value="todos">Todos</option>
                {niches.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <div className="main-grid">
            <section className="idea-list" aria-label="Lista de ideias">
              {filteredIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  isFavorite={favorites.includes(idea.id)}
                  status={progress[idea.id] ?? "nao_iniciado"}
                  onCopy={() => copyIdea(idea.id)}
                  onFavorite={() => toggleFavorite(idea.id)}
                  onStatusChange={(status) => updateStatus(idea.id, status)}
                />
              ))}
            </section>

            <aside className="side-panel" aria-label="Resumo de progresso">
              <h2>Progresso</h2>
              <div className="progress-item">
                <span>Favoritas</span>
                <strong>{favorites.length}</strong>
              </div>
              <div className="progress-item">
                <span>Vou usar</span>
                <strong>{Object.values(progress).filter((item) => item === "vou_usar").length}</strong>
              </div>
              <div className="progress-item">
                <span>Ja usei</span>
                <strong>{Object.values(progress).filter((item) => item === "ja_usei").length}</strong>
              </div>

              <h3>Checklist da semana</h3>
              <ul className="compact-list">
                {checklistItems.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    <span>{item.title}</span>
                    <small>{item.suggestedFrequency}</small>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </>
      )}

      {activeSection === "bonus" && <BonusGrid category="Todos os bonus" />}
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
    if (promptOnly) return item.category.toLowerCase().includes("prompt") || item.category.toLowerCase().includes("geracao");
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
          <button type="button">{item.status === "concluido" ? "Concluido" : "Marcar como feito"}</button>
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
        <h2>Conteudos</h2>
        <div className="admin-row">
          <span>Ideias cadastradas</span>
          <strong>{contentIdeas.length}</strong>
        </div>
        <div className="admin-row">
          <span>Bonus e prompts</span>
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
    dashboard: "Sua área de conteúdo",
    ideias: "Ideias prontas",
    bonus: "Bônus",
    prompts: "Prompts",
    roteiros: "Roteiros de stories",
    checklist: "Checklist de metas",
    favoritos: "Favoritos",
    admin: "Painel administrativo"
  };

  return titles[section];
}

function getSectionDescription(section: Section) {
  const descriptions: Record<Section, string> = {
    dashboard: "Encontre, filtre, salve e acompanhe ideias de conteúdo em poucos cliques.",
    ideias: "Explore cards completos com objetivo, formato, exemplos, dica e ações recomendadas.",
    bonus: "Materiais complementares organizados para acelerar a criação de conteúdo.",
    prompts: "Prompts para criar contexto, gerar ideias e usar IA com mais clareza.",
    roteiros: "Sequências simples para stories com foco em conexão, autoridade e venda.",
    checklist: "Metas práticas para manter consistência sem perder estratégia.",
    favoritos: "Tudo que você salvou para consultar ou aplicar depois.",
    admin: "Gerencie conteúdos e libere acesso manualmente por email."
  };

  return descriptions[section];
}
