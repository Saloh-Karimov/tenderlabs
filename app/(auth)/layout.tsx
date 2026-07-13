export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 bg-primary" aria-hidden="true" />
          <span className="font-heading text-xl font-semibold tracking-[0.25em] uppercase">
            TenderLabs
          </span>
        </div>
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          Bluebeam → CavSoft conversion
        </p>
      </div>
      {children}
    </div>
  );
}
