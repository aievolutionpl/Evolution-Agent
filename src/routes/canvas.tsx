import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { CanvasScreen } from '@/screens/canvas/canvas-screen'

export const Route = createFileRoute('/canvas')({
  ssr: false,
  component: CanvasRoute,
})

function CanvasRoute() {
  usePageTitle('Canvas')
  return <CanvasScreen />
}
