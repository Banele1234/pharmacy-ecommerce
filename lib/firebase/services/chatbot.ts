import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export type ChatRole = 'user' | 'bot'

export interface ChatMessageRecord {
  role: ChatRole
  text: string
  createdAt?: Timestamp | Date | string
  metadata?: Record<string, any>
}

const getSessionCollection = (sessionId: string) =>
  collection(db, 'chatbot_sessions', sessionId, 'messages')

export const saveChatMessage = async (
  sessionId: string,
  message: ChatMessageRecord,
): Promise<void> => {
  if (!sessionId) throw new Error('Session ID is required to save chat messages.')

  await addDoc(getSessionCollection(sessionId), {
    ...message,
    createdAt: serverTimestamp(),
  })
}

export const getRecentMessages = async (
  sessionId: string,
  max = 10,
): Promise<ChatMessageRecord[]> => {
  if (!sessionId) return []

  const historyQuery = query(
    getSessionCollection(sessionId),
    orderBy('createdAt', 'asc'),
    limit(max),
  )

  const snapshot = await getDocs(historyQuery)
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as ChatMessageRecord
    const createdAt = data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : data.createdAt ?? new Date().toISOString()

    return {
      ...data,
      createdAt,
    }
  })
}


