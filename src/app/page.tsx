// Removendo a importação relativa do './globals.css' para evitar o erro de compilação.
// A aplicação dependerá agora dos estilos Tailwind aplicados diretamente no <body> e no page.tsx.

// Definição de Metadados (opcional, mas bom ter)
export const metadata = {
  title: 'Secret Admirer App',
  description: 'Send anonymous flirty messages',
};

// Componente RootLayout: OBRIGATÓRIO no Next.js App Router
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Aplicando um fundo preto robusto e cor de texto branca diretamente no body. */}
      {/* Isso garante que nosso page.tsx seja o conteúdo principal, sem layouts externos o encobrindo. */}
      <body className="bg-black text-white min-h-screen">
        {/* 'children' é onde o seu page.tsx é renderizado. */}
        {children}
      </body>
    </html>
  );
}