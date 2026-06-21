import ChatInterface from '@/components/ChatInterface';

export default function WidgetPage() {
  return (
    <div className="absolute inset-0 bg-transparent font-sans overflow-hidden">
      <ChatInterface isEmbedded={true} />
    </div>
  );
}
