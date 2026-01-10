import { Suspense } from "react"
import MessagesPageContent from "./messages-content"

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesPageContent />
    </Suspense>
  )
}
