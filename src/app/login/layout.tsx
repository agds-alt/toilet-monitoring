// app/login/layout.tsx
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body style={{ 
        margin: 0, 
        padding: 0,
        background: '#ffffff',
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  );
}