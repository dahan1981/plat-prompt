import type { ContentIdea, ContentStatus } from "@/types/content";

type IdeaCardProps = {
  idea: ContentIdea;
  isFavorite: boolean;
  status: ContentStatus;
  icon: "video" | "chat" | "gift" | "edit" | "clipboard" | "bulb";
  tone: "terracotta" | "taupe" | "sand" | "clay" | "stone" | "cream";
  onFavorite: () => void;
  onCopy: () => void;
  onStatusChange: (status: ContentStatus) => void;
};

export function IdeaCard({ idea, isFavorite, status, icon, tone, onCopy, onFavorite, onStatusChange }: IdeaCardProps) {
  return (
    <article className="idea-row">
      <div className={`idea-symbol ${tone}`}>
        <RowIcon name={icon} />
      </div>

      <div className="idea-copy">
        <h2>{idea.title}</h2>
        <p>{idea.description}</p>
        <div className="idea-tags">
          <span>Objetivo: {idea.objective}</span>
          <span>Formato: {idea.idealFormat}</span>
          <span>Nicho: {idea.niche}</span>
        </div>
      </div>

      <button
        className={isFavorite ? "favorite-button active" : "favorite-button"}
        onClick={onFavorite}
        title={isFavorite ? "Remover dos favoritos" : "Favoritar ideia"}
        type="button"
        aria-label={isFavorite ? "Remover dos favoritos" : "Favoritar ideia"}
      >
        <RowIcon name="heart" />
      </button>

      <div className="row-actions">
        <button className={status === "vou_usar" ? "soft-button active" : "soft-button"} onClick={() => onStatusChange("vou_usar")} type="button">
          Vou usar
        </button>
        <button className="outline-button" onClick={onCopy} type="button">
          Copiar
        </button>
      </div>
    </article>
  );
}

function RowIcon({ name }: { name: IdeaCardProps["icon"] | "heart" }) {
  const icons: Record<IdeaCardProps["icon"] | "heart", React.ReactNode> = {
    video: (
      <>
        <rect x="5" y="6" width="14" height="12" rx="2" />
        <path d="m11 10 4 2-4 2v-4Z" />
        <path d="M8 4v4" />
        <path d="M16 4v4" />
      </>
    ),
    chat: (
      <>
        <rect x="5" y="5" width="14" height="13" rx="2" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
        <path d="m9 21 3-3" />
      </>
    ),
    gift: (
      <>
        <path d="M5 10h14v10H5z" />
        <path d="M5 10V7h14v3" />
        <path d="M12 7v13" />
        <path d="M12 7c-1.2-2.5-4.5-2.2-4.5 0 0 1.4 2.2 1.8 4.5 0Z" />
        <path d="M12 7c1.2-2.5 4.5-2.2 4.5 0 0 1.4-2.2 1.8-4.5 0Z" />
      </>
    ),
    edit: (
      <>
        <path d="M5 19h4l10-10-4-4L5 15v4Z" />
        <path d="m13 7 4 4" />
      </>
    ),
    clipboard: (
      <>
        <rect x="6" y="5" width="12" height="16" rx="2" />
        <path d="M9 5a3 3 0 0 1 6 0" />
        <path d="M9 11h6" />
        <path d="M9 15h6" />
      </>
    ),
    bulb: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M8.2 14.8a6.5 6.5 0 1 1 7.6 0c-.9.7-1.3 1.5-1.4 2.2H9.6c-.1-.7-.5-1.5-1.4-2.2Z" />
      </>
    ),
    heart: <path d="M12 20.2s-7.1-4.4-9.4-8.7C.7 7.9 2.8 4 6.7 4c2 0 3.5 1 4.3 2.3C11.8 5 13.3 4 15.3 4c3.9 0 6 3.9 4.1 7.5C19.1 15.8 12 20.2 12 20.2Z" />
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
}
