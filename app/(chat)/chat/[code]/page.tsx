import NiraAgentChat from '@/components/NiraAgentChat'

export const metadata = {
  title: 'Chat with Nira',
  description: 'Book appointments, order products, or get beauty advice from Nira — right here in your browser.',
}

export default function ChatWithCodePage({ params, searchParams }: { params: { code: string }; searchParams: { q?: string } }) {
  const q = typeof searchParams.q === 'string' ? searchParams.q.slice(0, 500) : undefined
  return (
    <NiraAgentChat initialBotCode={params.code.toLowerCase()} initialMessage={q} />
  )
}
