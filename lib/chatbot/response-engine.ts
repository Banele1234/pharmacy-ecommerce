import { fallbackKnowledge, searchKnowledgeBase, KnowledgeEntry } from './knowledge-base'

export interface ChatHistoryMessage {
  role: 'user' | 'bot'
  text: string
  createdAt?: string
  metadata?: Record<string, any>
}

export interface ChatbotResponse {
  answer: string
  quickReplies?: Array<{ id: string; text: string; prompt: string }>
}

const defaultQuickReplies: ChatbotResponse['quickReplies'] = [
  { id: 'qr-med', text: 'Medication info', prompt: 'Tell me about pain relief medications.' },
  { id: 'qr-delivery', text: 'Delivery options', prompt: 'What delivery options do you have?' },
  { id: 'qr-prescription', text: 'Upload prescription', prompt: 'How do I upload a prescription?' },
  { id: 'qr-payment', text: 'Payment methods', prompt: 'Which payment methods do you accept?' },
]

const buildKnowledgeResponse = (matches: KnowledgeEntry[], query: string): ChatbotResponse => {
  if (!matches.length) {
    const fallback =
      fallbackKnowledge[Math.floor(Math.random() * fallbackKnowledge.length)]

    return {
      answer: `I couldn't find an exact match, but here's something helpful:\n\n${fallback.answer}`,
      quickReplies: defaultQuickReplies,
    }
  }

  if (matches.length === 1) {
    return {
      answer: matches[0].answer,
      quickReplies:
        matches[0].followUps?.map((item, index) => ({
          id: `${matches[0].id}-follow-${index}`,
          text: item,
          prompt: item,
        })) ?? defaultQuickReplies,
    }
  }

  const combined = matches
    .map((match, index) => `${index + 1}. ${match.title}\n${match.answer}`)
    .join('\n\n')

  return {
    answer: combined,
    quickReplies: matches
      .flatMap((match) => match.followUps ?? [])
      .slice(0, 4)
      .map((item, index) => ({
        id: `multi-follow-${index}`,
        text: item,
        prompt: item,
      })),
  }
}

const buildContextAwareResponse = (
  message: string,
  recentMessages: ChatHistoryMessage[],
): ChatbotResponse | null => {
  const lower = message.toLowerCase()

  if (/(hello|hi|hey|sawubona|good (morning|afternoon|evening))/.test(lower)) {
    return {
      answer:
        '👋 Sawubona! I am the PharmaCare assistant for Eswatini. I can help with medications, prescriptions, delivery timelines, branch information, and payment options. What should we explore today?',
      quickReplies: defaultQuickReplies,
    }
  }

  if (/(thank|ngiyabonga|appreciate)/.test(lower)) {
    return {
      answer:
        '😊 Ngiyabonga! I am happy to help. Let me know if you want updates about your prescription, deliveries, or medication guidance.',
      quickReplies: defaultQuickReplies,
    }
  }

  const lastTopic = recentMessages
    .slice()
    .reverse()
    .find((msg) => msg.role === 'user')

  if (lastTopic?.text?.toLowerCase().includes('pain') && lower.includes('alternative')) {
    return {
      answer:
        'Besides Paracetamol, these pain relief options are popular in Eswatini:\n• Ibuprofen – Anti-inflammatory (E35)\n• Diclofenac – Strong pain relief (E45, prescription)\n• Naproxen – Longer relief (E50)\nPlease let me know if you need pharmacist guidance.',
      quickReplies: [
        { id: 'qr-paracetamol', text: 'Paracetamol dosage', prompt: 'Paracetamol dosage guidance' },
        { id: 'qr-ibuprofen', text: 'Ibuprofen info', prompt: 'Tell me about ibuprofen' },
      ],
    }
  }

  if (lower.includes('where') && lower.includes('branch')) {
    return {
      answer:
        '🏥 We currently operate in Manzini (main branch) and Mbabane (satellite). Pick-up points are available at Ezulwini, Nhlangano, and Siteki through partner clinics. Need directions to a branch?',
      quickReplies: [
        { id: 'qr-manzini', text: 'Manzini directions', prompt: 'Give me directions to the Manzini branch.' },
        { id: 'qr-mbabane', text: 'Mbabane directions', prompt: 'Where is the Mbabane branch located?' },
      ],
    }
  }

  if (lower.includes('hours') || lower.includes('open')) {
    return {
      answer:
        '🕒 Operating hours:\n• Weekdays: 08:00 – 20:00\n• Saturday: 09:00 – 18:00\n• Sunday: 10:00 – 16:00\nOnline orders & emergency support run 24/7.',
      quickReplies: defaultQuickReplies,
    }
  }

  return null
}

export const generateChatbotResponse = (
  message: string,
  recentMessages: ChatHistoryMessage[],
): ChatbotResponse => {
  const contextResponse = buildContextAwareResponse(message, recentMessages)
  if (contextResponse) return contextResponse

  const knowledgeMatches = searchKnowledgeBase(message, 2)
  return buildKnowledgeResponse(knowledgeMatches, message)
}


