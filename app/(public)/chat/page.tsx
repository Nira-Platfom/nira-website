import WebChat from '@/components/WebChat'

export const metadata = {
  title: 'Chat with Nira',
  description: 'Book appointments, order products, or get beauty advice from Nira — right here in your browser.',
}

export default function ChatPage() {
  return (
    <div className="pt-16">
      <WebChat />
    </div>
  )
}
