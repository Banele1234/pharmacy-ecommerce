import { NextResponse } from 'next/server'
import { getRecentMessages, saveChatMessage } from '@/lib/firebase/services/chatbot'
import { generateChatbotResponse } from '@/lib/chatbot/response-engine'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  try {
    const history = await getRecentMessages(sessionId, 20)
    return NextResponse.json({ sessionId, history })
  } catch (error) {
    console.error('❌ Chatbot history error', error)
    return NextResponse.json(
      { error: 'Failed to load chatbot history' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message: string = body?.message
    const incomingSessionId: string | undefined = body?.sessionId

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }

    const sessionId = incomingSessionId || crypto.randomUUID()

    await saveChatMessage(sessionId, {
      role: 'user',
      text: message,
    })

    const history = await getRecentMessages(sessionId, 10)
    const aiResponse = generateChatbotResponse(message, history)

    await saveChatMessage(sessionId, {
      role: 'bot',
      text: aiResponse.answer,
      metadata: { quickReplies: aiResponse.quickReplies },
    })

    return NextResponse.json({
      sessionId,
      response: aiResponse.answer,
      quickReplies: aiResponse.quickReplies ?? [],
    })
  } catch (error) {
    console.error('❌ Chatbot response error', error)
    return NextResponse.json(
      {
        error: 'The assistant is unavailable right now. Please try again shortly.',
      },
      { status: 500 },
    )
  }
}


