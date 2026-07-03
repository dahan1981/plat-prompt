import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Banco de Ideias",
  description: "Plataforma para ideias de conteudo, prompts, bonus e checklists."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
