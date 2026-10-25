import React from "react";

export const metadata = {
  title: "ADN Lector // Curaduría Algorítmica",
  description: "Descubre tu vector literario en 3 minutos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        {/* Cargamos Tailwind y las fuentes editoriales directamente para evitar errores de configuración */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .font-editorial { font-family: 'Cormorant Garamond', serif; }
          .font-mono-tech { font-family: 'JetBrains Mono', monospace; }
          body { background-color: #0B0B0C; color: #EAE6DF; margin: 0; }
        `}</style>
      </head>
      <body className="bg-[#0B0B0C] text-[#EAE6DF] antialiased selection:bg-[#9E2A2B] selection:text-white">
        {children}
      </body>
    </html>
  );
}
