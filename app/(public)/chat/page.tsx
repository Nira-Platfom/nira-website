import WebChat from '@/components/WebChat'

export const metadata = {
  title: 'Chat with Nira',
  description: 'Book appointments, order products, or get beauty advice from Nira — right here in your browser.',
}

export default function ChatPage({
  searchParams,
}: {
  searchParams: { intent?: string }
}) {
  return (
    <div className="pt-16">
      <WebChat initialIntent={searchParams.intent === 'quiz' ? 'quiz' : undefined} />
    </div>
  )
}
