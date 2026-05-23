import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { PlaybooksScreen } from '@/screens/playbooks/playbooks-screen'

export const Route = createFileRoute('/playbooks')({
  ssr: false,
  component: PlaybooksRoute,
})

function PlaybooksRoute() {
  usePageTitle('Playbooks')
  return <PlaybooksScreen />
}
