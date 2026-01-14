import { ChoreFrequency } from './types'

export interface ChoreTemplate {
  title: string
  description: string
  frequency: ChoreFrequency
  category: 'cleaning' | 'kitchen' | 'outdoor' | 'laundry' | 'pets' | 'organization' | 'other'
}

export const CHORE_TEMPLATES: ChoreTemplate[] = [
  // Daily chores
  { title: 'Make bed', description: 'Make your bed in the morning', frequency: 'daily', category: 'cleaning' },
  { title: 'Wash dishes', description: 'Wash dishes or load dishwasher', frequency: 'daily', category: 'kitchen' },
  { title: 'Wipe kitchen counters', description: 'Clean and sanitize kitchen counters', frequency: 'daily', category: 'kitchen' },
  { title: 'Take out trash', description: 'Empty trash cans and take bags to bin', frequency: 'daily', category: 'cleaning' },
  { title: 'Feed pets', description: 'Feed and water the pets', frequency: 'daily', category: 'pets' },
  { title: 'Tidy living room', description: 'Put away items and straighten cushions', frequency: 'daily', category: 'cleaning' },
  { title: 'Check mail', description: 'Get mail from mailbox', frequency: 'daily', category: 'other' },
  
  // Weekly chores
  { title: 'Vacuum floors', description: 'Vacuum all carpets and rugs', frequency: 'weekly', category: 'cleaning' },
  { title: 'Mop floors', description: 'Mop hard floors throughout the house', frequency: 'weekly', category: 'cleaning' },
  { title: 'Clean bathrooms', description: 'Clean toilets, sinks, and mirrors', frequency: 'weekly', category: 'cleaning' },
  { title: 'Do laundry', description: 'Wash, dry, and fold clothes', frequency: 'weekly', category: 'laundry' },
  { title: 'Change bed sheets', description: 'Strip and replace bed linens', frequency: 'weekly', category: 'laundry' },
  { title: 'Take out recycling', description: 'Sort and take out recyclables', frequency: 'weekly', category: 'cleaning' },
  { title: 'Water plants', description: 'Water indoor and outdoor plants', frequency: 'weekly', category: 'outdoor' },
  { title: 'Wipe down appliances', description: 'Clean microwave, fridge handles, etc.', frequency: 'weekly', category: 'kitchen' },
  { title: 'Dust surfaces', description: 'Dust furniture and shelves', frequency: 'weekly', category: 'cleaning' },
  { title: 'Clean mirrors', description: 'Clean all mirrors in the house', frequency: 'weekly', category: 'cleaning' },
  { title: 'Organize toys', description: 'Put toys back in their places', frequency: 'weekly', category: 'organization' },
  { title: 'Walk the dog', description: 'Take dog for a long walk', frequency: 'weekly', category: 'pets' },
  
  // Bi-weekly chores
  { title: 'Mow the lawn', description: 'Cut grass and edge walkways', frequency: 'biweekly', category: 'outdoor' },
  { title: 'Clean car interior', description: 'Vacuum and wipe down car inside', frequency: 'biweekly', category: 'other' },
  { title: 'Deep clean kitchen', description: 'Clean oven, fridge interior, etc.', frequency: 'biweekly', category: 'kitchen' },
  { title: 'Wash windows', description: 'Clean interior window glass', frequency: 'biweekly', category: 'cleaning' },
  { title: 'Organize pantry', description: 'Check expiration dates, reorganize', frequency: 'biweekly', category: 'kitchen' },
  { title: 'Clean pet area', description: 'Deep clean pet beds and litter boxes', frequency: 'biweekly', category: 'pets' },
  { title: 'Declutter closets', description: 'Organize and donate unused items', frequency: 'biweekly', category: 'organization' },
  
  // Monthly chores
  { title: 'Deep clean fridge', description: 'Empty and thoroughly clean refrigerator', frequency: 'monthly', category: 'kitchen' },
  { title: 'Clean gutters', description: 'Clear leaves and debris from gutters', frequency: 'monthly', category: 'outdoor' },
  { title: 'Wash curtains', description: 'Launder or dry clean window treatments', frequency: 'monthly', category: 'laundry' },
  { title: 'Clean ceiling fans', description: 'Dust and wipe fan blades', frequency: 'monthly', category: 'cleaning' },
  { title: 'Test smoke detectors', description: 'Test all smoke and CO detectors', frequency: 'monthly', category: 'other' },
  { title: 'Clean garage', description: 'Sweep and organize garage', frequency: 'monthly', category: 'outdoor' },
  { title: 'Wash throw rugs', description: 'Launder small rugs and mats', frequency: 'monthly', category: 'laundry' },
  { title: 'Clean under furniture', description: 'Move furniture and clean underneath', frequency: 'monthly', category: 'cleaning' },
  { title: 'Organize paperwork', description: 'File documents and shred old papers', frequency: 'monthly', category: 'organization' },
  { title: 'Pet grooming', description: 'Bathe and groom pets', frequency: 'monthly', category: 'pets' },
]

export const TEMPLATE_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'cleaning', label: '🧹 Cleaning' },
  { value: 'kitchen', label: '🍽️ Kitchen' },
  { value: 'laundry', label: '👕 Laundry' },
  { value: 'outdoor', label: '🌳 Outdoor' },
  { value: 'pets', label: '🐾 Pets' },
  { value: 'organization', label: '📦 Organization' },
  { value: 'other', label: '📋 Other' },
] as const

export function getTemplatesByCategory(category: string): ChoreTemplate[] {
  if (category === 'all') return CHORE_TEMPLATES
  return CHORE_TEMPLATES.filter((t) => t.category === category)
}

export function getTemplatesByFrequency(frequency: ChoreFrequency): ChoreTemplate[] {
  return CHORE_TEMPLATES.filter((t) => t.frequency === frequency)
}
