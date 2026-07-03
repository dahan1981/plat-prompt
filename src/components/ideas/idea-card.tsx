import type { ContentIdea, ContentStatus } from "@/types/content";

type IdeaCardProps = {
  idea: ContentIdea;
  isFavorite: boolean;
  status: ContentStatus;
  onFavorite: () => void;
  onCopy: () => void;
  onStatusChange: (status: ContentStatus) => void;
};

export function IdeaCard({ idea, isFavorite, status, onCopy, onFavorite, onStatusChange }: IdeaCardProps) {
  return (
    <article className="idea-card">
      <header>
        <div>
          <span className="card-meta">
            {idea.objective} / {idea.idealFormat}
          </span>
          <h2>{idea.title}</h2>
        </div>
        <button
          className={isFavorite ? "icon-button active" : "icon-button"}
          onClick={onFavorite}
          title={isFavorite ? "Remover dos favoritos" : "Favoritar ideia"}
          type="button"
          aria-label={isFavorite ? "Remover dos favoritos" : "Favoritar ideia"}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 20.2s-7.1-4.4-9.4-8.7C.7 7.9 2.8 4 6.7 4c2 0 3.5 1 4.3 2.3C11.8 5 13.3 4 15.3 4c3.9 0 6 3.9 4.1 7.5C19.1 15.8 12 20.2 12 20.2Z" />
          </svg>
        </button>
      </header>

      <p>{idea.description}</p>

      <div className="idea-tags">
        <span>{idea.niche}</span>
        <span>{idea.difficulty}</span>
        <span>{idea.intention}</span>
      </div>

      <div className="idea-section">
        <strong>Dica de execução</strong>
        <p>{idea.executionTip}</p>
      </div>

      <div className="idea-section">
        <strong>Exemplos aplicados</strong>
        <ul>
          {idea.nicheExamples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </div>

      <footer>
        <button className={status === "vou_usar" ? "active" : ""} onClick={() => onStatusChange("vou_usar")} type="button">
          Vou usar
        </button>
        <button className={status === "ja_usei" ? "active" : ""} onClick={() => onStatusChange("ja_usei")} type="button">
          Já usei
        </button>
        <button onClick={onCopy} type="button">
          Copiar
        </button>
      </footer>
    </article>
  );
}
