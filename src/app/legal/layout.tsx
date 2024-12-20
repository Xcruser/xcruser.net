export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  )
}
