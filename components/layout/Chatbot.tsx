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
}

interface QuickReply {
  id: string
  text: string
  action: string
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
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Quick reply options
  const quickReplies: QuickReply[] = [
    { id: '1', text: '💊 Medication Information', action: 'medication_info' },
    { id: '2', text: '📋 Prescription Upload', action: 'prescription_upload' },
    { id: '3', text: '🚚 Delivery & Shipping', action: 'delivery_info' },
    { id: '4', text: '💳 Payment Methods', action: 'payment_info' },
    { id: '5', text: '🕒 Store Hours & Contact', action: 'contact_info' },
    { id: '6', text: '🌡️ Emergency Services', action: 'emergency_info' }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setConversationContext(prev => [...prev, inputMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI processing with enhanced response generation
    setTimeout(() => {
      const botResponse = generateEnhancedBotResponse(inputMessage, conversationContext)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.response,
        sender: 'bot',
        timestamp: new Date(),
        type: botResponse.quickReplies ? 'quick_reply' : 'text'
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1200 + Math.random() * 800) // Random delay for natural feel
  }

  const handleQuickReply = (action: string) => {
    let response = ''
    
    switch (action) {
      case 'medication_info':
        response = "💊 **Medication Information**\n\nI can help you with:\n• Prescription medication details\n• Over-the-counter products\n• Dosage instructions\n• Side effects information\n• Drug interactions\n• Generic alternatives\n\nWhich medication are you interested in?"
        break
      case 'prescription_upload':
        response = "📋 **Prescription Upload**\n\nTo upload your prescription:\n1. Click 'Upload Prescription' on our website\n2. Take clear photos of your prescription\n3. Fill in patient details\n4. Our pharmacists will verify within 2-4 hours\n\nWe accept JPG, PNG, and PDF files. All prescriptions are verified by licensed pharmacists."
        break
      case 'delivery_info':
        response = "🚚 **Delivery Information**\n\n• **Standard Delivery**: 24-48 hours across Eswatini\n• **Express Delivery**: Same-day in major cities\n• **Free Shipping**: Orders over 50,000 SZL\n• **Regular Shipping**: 250 SZL for orders under 50,000 SZL\n• **Tracking**: Real-time order tracking available\n\nWe deliver to all regions in Eswatini!"
        break
      case 'payment_info':
        response = "💳 **Payment Methods**\n\nWe accept:\n• **MTN Mobile Money** (Recommended)\n• **Credit/Debit Cards** (Visa, MasterCard)\n• **Cash on Delivery**\n• **Bank Transfer**\n• **E-wallets**\n\nAll payments are secure and encrypted. MTN MoMo offers instant confirmation!"
        break
      case 'contact_info':
        response = "🕒 **Contact Information**\n\n**PharmaCare Headquarters**\n📍 Location: Manzini, Eswatini\n📞 Phone: +268 XX XXX XXXX\n📧 Email: support@pharmacare.org\n\n**Business Hours**\nMonday - Friday: 8:00 AM - 8:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM\n\n24/7 Online Support Available!"
        break
      case 'emergency_info':
        response = "🚨 **Emergency Services**\n\nFor medical emergencies:\n• **Call Emergency Services**: 933\n• **Poison Control**: +268 XX XXX XXXX\n• **Nearest Hospital**: Contact local emergency services\n\nFor urgent medication needs outside business hours, please visit your nearest hospital or emergency clinic."
        break
      default:
        response = "I'm here to help! What specific information are you looking for about our pharmacy services?"
    }

    const quickReplyMessage: Message = {
      id: Date.now().toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, quickReplyMessage])
  }

  const generateEnhancedBotResponse = (userMessage: string, context: string[]): { response: string; quickReplies?: boolean } => {
    const message = userMessage.toLowerCase()
    const lastUserMessage = context[context.length - 2] || ''

    // Enhanced medication responses
    if (message.includes('paracetamol') || message.includes('panado') || message.includes('pain') || message.includes('fever') || message.includes('headache')) {
      return {
        response: "💊 **Paracetamol Information**\n\n**Uses**: Pain relief, fever reduction\n**Dosage**: 500mg-1000mg every 4-6 hours\n**Max Daily**: 4000mg (8 tablets)\n**Price**: Starting from 25 SZL\n**Availability**: Over-the-counter\n\n**Safety Notes**:\n• Do not exceed recommended dosage\n• Consult doctor if pain persists beyond 3 days\n• Avoid alcohol while taking\n\nWould you like me to show you our pain relief products or do you have other questions?",
        quickReplies: true
      }
    }

    if (message.includes('amoxicillin') || message.includes('antibiotic') || message.includes('infection') || message.includes('bacterial')) {
      return {
        response: "💊 **Amoxicillin Information**\n\n**Type**: Prescription antibiotic\n**Uses**: Bacterial infections\n**Common Forms**: 250mg, 500mg capsules\n**Price Range**: 85-150 SZL\n**Requires**: Valid prescription\n\n**Important**:\n• Complete full course as prescribed\n• Take with or without food\n• Store at room temperature\n• Report any allergic reactions immediately\n\nYou can upload your prescription through our website for verification.",
        quickReplies: true
      }
    }

    if (message.includes('vitamin') || message.includes('supplement') || message.includes('immune') || message.includes('multivitamin')) {
      return {
        response: "🌿 **Vitamins & Supplements**\n\nWe offer a comprehensive range:\n• **Vitamin C** - Immune support (45 SZL)\n• **Multivitamins** - Daily nutrition (78 SZL)\n• **Vitamin D** - Bone health (55 SZL)\n• **Omega-3** - Heart health (120 SZL)\n• **Probiotics** - Gut health (95 SZL)\n\nAll supplements are third-party tested and available without prescription. Check our supplements category for full selection!",
        quickReplies: true
      }
    }

    // Enhanced delivery responses
    if (message.includes('delivery') || message.includes('shipping') || message.includes('deliver') || message.includes('ship') || message.includes('time')) {
      return {
        response: "🚚 **Delivery Services**\n\n**Standard Delivery**:\n• 24-48 hours across Eswatini\n• Free for orders over 50,000 SZL\n• 250 SZL for orders under 50,000 SZL\n\n**Express Delivery**:\n• Same-day in Manzini & Mbabane\n• Additional 150 SZL\n• Order before 2:00 PM\n\n**Features**:\n• Real-time tracking\n• SMS notifications\n• Secure packaging\n• Contactless delivery available\n\nWhere would you like your order delivered?",
        quickReplies: true
      }
    }

    // Enhanced prescription responses
    if (message.includes('prescription') || message.includes('upload') || message.includes('doctor') || message.includes('rx')) {
      return {
        response: "📋 **Prescription Services**\n\n**How to Upload**:\n1. Visit 'Upload Prescription' page\n2. Take clear photos/scan\n3. Fill patient information\n4. Submit for verification\n\n**Processing**:\n• Verification: 2-4 hours (business days)\n• Licensed pharmacist review\n• SMS confirmation upon approval\n\n**Accepted Formats**: JPG, PNG, PDF (max 5MB)\n\n**Requirements**: Doctor's signature, patient name, medication details, and date are required.",
        quickReplies: true
      }
    }

    // Context-aware responses
    if (lastUserMessage.includes('pain') && (message.includes('alternative') || message.includes('other') || message.includes('different'))) {
      return {
        response: "💊 **Alternative Pain Relief Options**\n\nBesides Paracetamol, we offer:\n• **Ibuprofen** - Anti-inflammatory (35 SZL)\n• **Aspirin** - Pain & inflammation (28 SZL)\n• **Diclofenac** - Stronger pain relief (45 SZL)\n• **Combination products** - Enhanced relief\n\nConsult with our pharmacists for the best option based on your specific needs. Some alternatives may require prescription.",
        quickReplies: true
      }
    }

    // Enhanced greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon')) {
      return {
        response: "👋 Hello! Welcome to PharmaCare Eswatini! I'm your AI assistant here to help with:\n\n💊 Medication information\n📋 Prescription services\n🚚 Delivery options\n💳 Payment methods\n🕒 Store information\n🌡️ Health advice\n\nHow can I assist you with your healthcare needs today?",
        quickReplies: true
      }
    }

    // Enhanced thank you responses
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
      return {
        response: "😊 You're very welcome! I'm glad I could help. Remember, our licensed pharmacists are always available if you need more detailed medical advice. Is there anything else about our pharmacy services I can assist you with today?",
        quickReplies: true
      }
    }

    // Default intelligent response
    const defaultResponses = [
      "I specialize in pharmacy and healthcare services. You can ask me about medications, prescription uploads, delivery options, payment methods, or store information. What specific area can I help you with?",
      "As your PharmaCare assistant, I'm here to provide accurate information about medications, healthcare products, and our services. What would you like to know more about?",
      "I can help you navigate our pharmacy services, find the right medications, understand prescription requirements, or assist with your orders. What do you need help with today?",
      "Whether it's medication information, delivery questions, or prescription services, I'm here to help! What specific information are you looking for?"
    ]

    return {
      response: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      quickReplies: true
    }
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

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl bg-gradient-to-r from-primary to-primary/80"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
        <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 text-xs bg-green-500 border-2 border-background">
          <Bot className="h-3 w-3" />
        </Badge>
      </Button>

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
              {messages[messages.length - 1]?.type === 'quick_reply' && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-muted-foreground font-medium">Quick options:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <Button
                        key={reply.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply(reply.action)}
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
                  onClick={handleSendMessage}
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