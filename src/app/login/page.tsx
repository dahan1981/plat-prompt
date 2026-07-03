export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div>
          <p className="section-label">Acesso ao produto</p>
          <h1>Entrar no Banco de Ideias</h1>
          <p className="muted">
            Esta tela está preparada para receber a autenticação do Supabase na próxima etapa.
          </p>
        </div>

        <form className="auth-form">
          <label>
            Email
            <input type="email" placeholder="seuemail@exemplo.com" />
          </label>
          <label>
            Senha
            <input type="password" placeholder="Sua senha" />
          </label>
          <button type="button">Entrar</button>
        </form>
      </section>
    </main>
  );
}
