export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-muted-foreground mb-8">
          This is a simple test page to verify the application is working.
        </p>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Theme Test</h2>
            <p>The theme toggle should work in the navbar.</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Styling Test</h2>
            <p>This shows the muted background styling.</p>
          </div>
        </div>
      </div>
    </div>
  )
}