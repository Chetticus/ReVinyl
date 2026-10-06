import { AskAiScreen } from '@/components/ask-ai/AskAiScreen';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hỏi AI | Vinyl Heritage',
  description:
    'Trợ lý AI hỗ trợ học tập chuyên đề, thử thách và khám phá di sản vinyl Việt Nam.',
};

export default function AskAiPage() {
  return <AskAiScreen />;
}
