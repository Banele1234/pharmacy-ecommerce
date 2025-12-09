export type KnowledgeCategory =
  | 'medication'
  | 'delivery'
  | 'payment'
  | 'contact'
  | 'emergency'
  | 'eswatini'
  | 'location'
  | 'service'
  | 'general'

export interface KnowledgeEntry {
  id: string
  title: string
  category: KnowledgeCategory
  tags: string[]
  answer: string
  followUps?: string[]
}

const knowledgeBase: KnowledgeEntry[] = [
  {
    id: 'med-paracetamol',
    title: 'Paracetamol',
    category: 'medication',
    tags: ['paracetamol', 'panado', 'pain', 'fever', 'headache'],
    answer: [
      '💊 **Paracetamol (Panado)**',
      '• Uses: Pain relief, fever reduction',
      '• Adult dosage: 500mg-1000mg every 4-6 hours (max 4000mg/day)',
      '• Price: From E25 • Availability: Over-the-counter',
      '• Safety: Avoid alcohol, do not exceed recommended dose, consult a doctor if symptoms persist beyond 3 days.',
    ].join('\n'),
    followUps: ['Show me pain relief options', 'Can I combine it with ibuprofen?'],
  },
  {
    id: 'med-amoxicillin',
    title: 'Amoxicillin',
    category: 'medication',
    tags: ['amoxicillin', 'antibiotic', 'infection', 'bacteria'],
    answer: [
      '💊 **Amoxicillin**',
      '• Type: Prescription antibiotic (250mg & 500mg)',
      '• Uses: Bacterial infections (respiratory, skin, ENT)',
      '• Price: E85-E150 • Requires a valid prescription',
      '• Safety: Finish full course, report allergic reactions, store at room temperature.',
    ].join('\n'),
    followUps: ['How do I upload a prescription?', 'What infections does it treat?'],
  },
  {
    id: 'med-vitamins',
    title: 'Vitamins & Supplements',
    category: 'medication',
    tags: ['vitamin', 'supplement', 'immune', 'multivitamin', 'omega'],
    answer: [
      '🌿 **Vitamins & Supplements**',
      '• Vitamin C (E45) – Immune support',
      '• Multivitamins (E78) – Daily nutrition',
      '• Vitamin D (E55) – Bone health',
      '• Omega-3 (E120) – Heart health',
      '• Probiotics (E95) – Gut health',
      'All third-party tested and available without prescription.',
    ].join('\n'),
    followUps: ['Any immune support bundles?', 'Do you have kid-friendly vitamins?'],
  },
  {
    id: 'delivery-standard',
    title: 'Standard Delivery',
    category: 'delivery',
    tags: ['delivery', 'shipping', 'tracking', 'standard', 'time'],
    answer: [
      '🚚 **Standard Delivery (Eswatini)**',
      '• Coverage: Nationwide',
      '• Timeline: 24-48 hours',
      '• Cost: Free above E500, otherwise E80',
      '• Tracking & SMS updates included',
      '• Packaging: Tamper-proof & temperature-safe',
    ].join('\n'),
    followUps: ['Do you offer express delivery?', 'Where is my order now?'],
  },
  {
    id: 'delivery-express',
    title: 'Express Delivery',
    category: 'delivery',
    tags: ['express', 'same-day', 'manzini', 'mbabane'],
    answer: [
      '⚡ **Express Delivery**',
      '• Cities: Manzini & Mbabane',
      '• Timeline: Same-day if ordered before 14:00',
      '• Cost: E150 flat fee',
      '• Includes real-time courier tracking & contactless option',
    ].join('\n'),
    followUps: ['Do you deliver to Siteki?', 'Can I pick up in-store?'],
  },
  {
    id: 'payment-methods',
    title: 'Payment Methods',
    category: 'payment',
    tags: ['payment', 'methods', 'momo', 'card', 'cash'],
    answer: [
      '💳 **Payment Options**',
      '• MTN MoMo (instant confirmation)',
      '• Visa / MasterCard',
      '• Bank transfer & EFT',
      '• Cash on delivery',
      'All payments are encrypted. MTN MoMo is the fastest choice.',
    ].join('\n'),
    followUps: ['How do I pay with MoMo?', 'Do you offer payment plans?'],
  },
  {
    id: 'contact-eswatini',
    title: 'Contact & Hours',
    category: 'contact',
    tags: ['contact', 'hours', 'phone', 'email', 'store'],
    answer: [
      '🕒 **PharmaCare Eswatini Contact**',
      '• Location: Manzini CBD, opposite Bhunu Mall',
      '• Phone: +268 2404 1234',
      '• WhatsApp: +268 7800 1234',
      '• Email: support@pharmacare.org',
      '• Hours: Mon-Fri 08:00-20:00 • Sat 09:00-18:00 • Sun 10:00-16:00',
    ].join('\n'),
    followUps: ['Do you have a Mbabane branch?', 'How do I reach the pharmacist?'],
  },
  {
    id: 'emergency-services',
    title: 'Emergency',
    category: 'emergency',
    tags: ['emergency', 'ambulance', 'hospital', 'urgent'],
    answer: [
      '🚨 **Emergency Contacts (Eswatini)**',
      '• National Emergency: 933',
      '• Mbabane Government Hospital: +268 2408 5111',
      '• Good Shepherd Hospital (Siteki): +268 2343 7700',
      'For urgent care outside hours, visit your nearest hospital or emergency clinic.',
    ].join('\n'),
    followUps: ['Do you have after-hours service?', 'Can I speak to a pharmacist now?'],
  },
  {
    id: 'eswatini-cities',
    title: 'Eswatini Cities & Coverage',
    category: 'eswatini',
    tags: ['eswatini', 'manzini', 'mbabane', 'siteki', 'ezulwini'],
    answer: [
      '🗺️ **Service Coverage in Eswatini**',
      'We support deliveries and prescriptions in: Manzini, Mbabane, Ezulwini, Nhlangano, Siteki, Piggs Peak, and most rural clinics.',
      'For remote areas, we partner with SwaziPost pick-up points.',
    ].join('\n'),
    followUps: ['Do you have local pickup points?', 'How long to reach rural areas?'],
  },
  {
    id: 'prescription-upload',
    title: 'Prescription Upload',
    category: 'service',
    tags: ['prescription', 'upload', 'doctor', 'rx', 'scan'],
    answer: [
      '📋 **Prescription Upload Guide**',
      '1. Tap “Upload Prescription”',
      '2. Add clear photos (JPG/PNG/PDF, max 5MB)',
      '3. Provide patient & doctor details',
      '4. Pharmacists verify in 2-4 hours and notify via SMS/Email',
      'We only dispense once a licensed pharmacist approves the request.',
    ].join('\n'),
    followUps: ['Can I upload multiple prescriptions?', 'How will I know it’s approved?'],
  },
]

export const searchKnowledgeBase = (query: string, limit = 2): KnowledgeEntry[] => {
  if (!query) return []

  const normalized = query.toLowerCase()

  const scored = knowledgeBase
    .map((entry) => {
      const tagMatches = entry.tags.reduce(
        (score, tag) => (normalized.includes(tag) ? score + 2 : score),
        0,
      )
      const titleMatch = normalized.includes(entry.title.toLowerCase()) ? 1.5 : 0
      const categoryMatch = normalized.includes(entry.category) ? 1 : 0

      const totalScore = tagMatches + titleMatch + categoryMatch

      return { entry, score: totalScore }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry)

  return scored
}

export const fallbackKnowledge = knowledgeBase


