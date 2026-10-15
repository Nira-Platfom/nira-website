import NiraAgentChat from '@/components/NiraAgentChat'

export const metadata = {
  title: 'Chat with Nira — your AI beauty agent',
  description: 'Find salons, spas and beauty products in Dar es Salaam. Nira compares options, books appointments and places orders for you — in Swahili or English.',
}

export default function ChatPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = typeof searchParams.q === 'string' ? searchParams.q.slice(0, 500) : undefined
  return (
    <NiraAgentChat initialMessage={q} />
  )
}
