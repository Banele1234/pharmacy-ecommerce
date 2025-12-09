// components/layout/Chatbot.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Clock,
  Shield,
  Truck,
  Pill,
  Heart,
  FileText,
  CreditCard,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'quick_reply'
  quickReplies?: QuickReply[]
}

interface QuickReply {
  id: string
  text: string
  prompt: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hello! I'm your PharmaCare AI Assistant. I'm here to help you with medication information, prescription uploads, delivery questions, and anything else about our pharmacy services. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Quick reply options
  const quickReplies: QuickReply[] = [
    { id: 'qr-1', text: '💊 Medication Info', prompt: 'Tell me about pain relief medications.' },
    { id: 'qr-2', text: '📋 Prescription Upload', prompt: 'How do I upload my prescription?' },
    { id: 'qr-3', text: '🚚 Delivery & Shipping', prompt: 'What delivery options do you have in Eswatini?' },
    { id: 'qr-4', text: '💳 Payment Methods', prompt: 'Which payment methods do you accept?' },
    { id: 'qr-5', text: '🕒 Store Hours & Contact', prompt: 'What are your store hours and contact details?' },
    { id: 'qr-6', text: '🌡️ Emergency Services', prompt: 'Who do I call in a medical emergency in Eswatini?' }
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return

    const existingSession = sessionStorage.getItem('pharmacare_chat_session')
    if (existingSession) {
      setSessionId(existingSession)
      return
    }

    const newSessionId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `session-${Date.now()}`
    sessionStorage.setItem('pharmacare_chat_session', newSessionId)
    setSessionId(newSessionId)
  }, [])

  useEffect(() => {
    const loadHistory = async (activeSessionId: string) => {
      try {
        setIsHistoryLoading(true)
        const response = await fetch(`/api/chatbot?sessionId=${activeSessionId}`)
        if (!response.ok) {
          throw new Error('Failed to load history')
        }
        const data = await response.json()
        const formattedMessages: Message[] = (data.history || []).map(
          (entry: any, index: number) => ({
            id: `${entry.role}-${index}-${entry.createdAt}`,
            text: entry.text,
            sender: entry.role,
            timestamp: new Date(entry.createdAt || Date.now()),
            type: entry?.metadata?.quickReplies?.length ? 'quick_reply' : 'text',
            quickReplies: entry?.metadata?.quickReplies,
          }),
        )

        if (formattedMessages.length) {
          setMessages(formattedMessages)
        }
      } catch (error) {
        console.error('Failed to hydrate chatbot history', error)
      } finally {
        setIsHistoryLoading(false)
      }
    }

    if (sessionId) {
      loadHistory(sessionId)
    }
  }, [sessionId])

  const handleSendMessage = async (overrideMessage?: string) => {
    if (isLoading) return

    const content = (overrideMessage ?? inputMessage).trim()
    if (!content) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, sessionId })
      })

      if (!response.ok) {
        throw new Error('Assistant unavailable')
      }

      const data = await response.json()

      if (!sessionId && data.sessionId) {
        sessionStorage.setItem('pharmacare_chat_session', data.sessionId)
        setSessionId(data.sessionId)
      }

      const quickReplyPayload: QuickReply[] = (data.quickReplies || [])
        .map((reply: any, index: number) => ({
          id: reply.id ?? `server-qr-${index}`,
          text: reply.text ?? reply.label ?? 'Learn more',
          prompt: reply.prompt ?? reply.text ?? ''
        }))
        .filter((reply: QuickReply) => reply.prompt)

      const assistantText =
        data.response ||
        'I am still learning about that question. Could you rephrase or contact our pharmacists directly at +268 2404 1234?'

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: assistantText,
        sender: 'bot',
        timestamp: new Date(),
        type: quickReplyPayload.length ? 'quick_reply' : 'text',
        quickReplies: quickReplyPayload.length ? quickReplyPayload : undefined
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chatbot error', error)
      const fallbackMessage: Message = {
        id: `${Date.now()}-error`,
        text: '😔 I could not reach the assistant right now. Please try again shortly or contact our pharmacists at +268 2404 1234.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  const lastMessage = messages[messages.length - 1]
  const shouldShowQuickReplies = lastMessage?.sender === 'bot'
  const activeQuickReplies =
    shouldShowQuickReplies && lastMessage?.quickReplies?.length
      ? lastMessage.quickReplies
      : shouldShowQuickReplies
        ? quickReplies
        : []

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-4 right-4 z-40 flex w-[calc(100%-2rem)] max-w-xs flex-col items-stretch gap-2 sm:max-w-sm sm:items-end">
        <div className="rounded-2xl border border-primary/20 bg-background/95 px-4 py-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-primary font-semibold">PharmaCare AI</p>
              <p className="text-sm font-semibold text-foreground">Ask our assistant anything</p>
              <p className="text-[11px] text-muted-foreground">Medication • Delivery • Prescriptions</p>
            </div>
          </div>
        </div>
        <Button
          aria-label="Open PharmaCare AI Assistant"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary via-primary/80 to-secondary px-4 py-3 text-primary-foreground shadow-2xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-3xl"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/30 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-80" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-foreground/20">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">Chatbot</p>
              <p className="text-sm font-semibold leading-tight">Open AI assistant</p>
            </div>
          </div>
          <Badge className="relative bg-emerald-500 text-white border border-background px-2 text-[11px]">
            Live
          </Badge>
        </Button>
      </div>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-end sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Window */}
          <Card className="relative w-full max-w-md h-[600px] shadow-2xl border-2 animate-in slide-in-from-right duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    PharmaCare Assistant
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Typically replies in seconds
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-4 h-[calc(100%-120px)] flex flex-col">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
                {isHistoryLoading && (
                  <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
                    Restoring your previous conversation...
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted border'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {formatMessage(message.text)}
                      </p>
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border shadow-md">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl bg-muted border px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        PharmaCare Assistant is typing...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Buttons */}
              {activeQuickReplies.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-muted-foreground font-medium">Quick options:</p>
                  <div className="flex flex-wrap gap-2">
                    {activeQuickReplies.map((reply) => (
                      <Button
                        key={reply.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply(reply.prompt)}
                        className="text-xs h-8 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all"
                      >
                        {reply.text}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about medications, delivery, prescriptions..."
                  className="flex-1 border-primary/20 focus:border-primary/40"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 transition-all"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Security Notice */}
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Secure & confidential. For emergencies, contact healthcare professionals.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e0;
        }
      `}</style>
    </>
  )
}