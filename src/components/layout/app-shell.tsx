import Link from "next/link";
import { mockUser } from "@/lib/access";

type AppShellProps = {
  activeSection: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", key: "dashboard" },
  { href: "/ideias", label: "Ideias", key: "ideias" },
  { href: "/bonus", label: "Bônus", key: "bonus" },
  { href: "/prompts", label: "Prompts", key: "prompts" },
  { href: "/roteiros", label: "Roteiros", key: "roteiros" },
  { href: "/checklist", label: "Checklist", key: "checklist" },
  { href: "/favoritos", label: "Favoritos", key: "favoritos" },
  { href: "/admin", label: "Admin", key: "admin" }
];

export function AppShell({ activeSection, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard" aria-label="Banco de Ideias">
          <span>BI</span>
          <strong>Banco de Ideias</strong>
        </Link>

        <nav className="nav-list" aria-label="Navegacao principal">
          {navItems.map((item) => (
            <Link className={activeSection === item.key ? "active" : ""} href={item.href} key={item.key}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="user-box">
          <span>{mockUser.name}</span>
          <small>{mockUser.email}</small>
        </div>
      </aside>

      <main className="workspace">{children}</main>
    </div>
  );
}
