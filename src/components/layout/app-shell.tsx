import Link from "next/link";

type AppShellProps = {
  activeSection: string;
  children: React.ReactNode;
};

type IconName = "grid" | "idea" | "gift" | "prompt" | "script" | "check" | "heart" | "lock" | "chevron";

const navItems: Array<{ href: string; label: string; key: string; icon: IconName }> = [
  { href: "/dashboard", label: "Dashboard", key: "dashboard", icon: "grid" },
  { href: "/ideias", label: "Ideias", key: "ideias", icon: "idea" },
  { href: "/bonus", label: "Bônus", key: "bonus", icon: "gift" },
  { href: "/prompts", label: "Prompts", key: "prompts", icon: "prompt" },
  { href: "/roteiros", label: "Roteiros", key: "roteiros", icon: "script" },
  { href: "/checklist", label: "Checklist", key: "checklist", icon: "check" },
  { href: "/favoritos", label: "Favoritos", key: "favoritos", icon: "heart" }
];

export function AppShell({ activeSection, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard" aria-label="Banco de Ideias">
          <Icon name="idea" />
          <strong>Banco de Ideias</strong>
        </Link>

        <nav className="nav-list" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link className={activeSection === item.key ? "active" : ""} href={item.href} key={item.key}>
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="admin-access" href="/admin">
          <span>
            <Icon name="lock" />
          </span>
          <span>
            <strong>Liberar acesso</strong>
            <small>Área administrativa</small>
          </span>
          <Icon name="chevron" />
        </Link>

        <div className="user-box">
          <div className="avatar">CM</div>
          <span>
            <strong>Camila Martins</strong>
            <small>Empreendedora</small>
          </span>
          <Icon name="chevron" />
        </div>
      </aside>

      <main className="workspace">{children}</main>
    </div>
  );
}

function Icon({ name }: { name: IconName }) {
  const icons: Record<IconName, React.ReactNode> = {
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1.2" />
        <rect x="14" y="4" width="6" height="6" rx="1.2" />
        <rect x="4" y="14" width="6" height="6" rx="1.2" />
        <rect x="14" y="14" width="6" height="6" rx="1.2" />
      </>
    ),
    idea: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M8.2 14.8a6.5 6.5 0 1 1 7.6 0c-.9.7-1.3 1.5-1.4 2.2H9.6c-.1-.7-.5-1.5-1.4-2.2Z" />
      </>
    ),
    gift: (
      <>
        <path d="M4 10h16v10H4z" />
        <path d="M4 10V7h16v3" />
        <path d="M12 7v13" />
        <path d="M12 7c-1.4-3-5-2.6-5 0 0 1.6 2.5 2 5 0Z" />
        <path d="M12 7c1.4-3 5-2.6 5 0 0 1.6-2.5 2-5 0Z" />
      </>
    ),
    prompt: (
      <>
        <rect x="4" y="5" width="16" height="13" rx="2" />
        <path d="M8 9h8" />
        <path d="M8 13h4" />
        <path d="M8 21l3-3" />
      </>
    ),
    script: (
      <>
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <path d="M9 7h6" />
        <path d="M9 11h6" />
        <path d="M9 15h4" />
      </>
    ),
    check: (
      <>
        <path d="M20 7 10.5 17 6 12.5" />
        <rect x="4" y="4" width="16" height="16" rx="2" />
      </>
    ),
    heart: <path d="M12 20.2s-7.1-4.4-9.4-8.7C.7 7.9 2.8 4 6.7 4c2 0 3.5 1 4.3 2.3C11.8 5 13.3 4 15.3 4c3.9 0 6 3.9 4.1 7.5C19.1 15.8 12 20.2 12 20.2Z" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <path d="M12 14v2" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />
  };

  return (
    <svg className="ui-icon" aria-hidden="true" viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
}
