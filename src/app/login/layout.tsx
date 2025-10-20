// src/app/login/layout.tsx
// REMOVE <html> and <body> tags!

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Just wrap children, NO <html> or <body>!
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {children}
    </div>
  );
}