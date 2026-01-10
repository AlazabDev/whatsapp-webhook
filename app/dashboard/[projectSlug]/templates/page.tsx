import { Suspense } from "react"
import TemplatesPageContent from "./templates-content"

interface PageProps {
  params: Promise<{ projectSlug: string }>
}

export default function TemplatesPage({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      <TemplatesPageContent params={params} />
    </Suspense>
  )
}
