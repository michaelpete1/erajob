// src/utils/serviceMapping.ts

export const AGENT_SERVICE_MAPPING: Record<string, string> = {
  'Graphic Design': 'Other',
  'Digital Marketing': 'Digital Marketing',
  'Video & Animation': 'Other',
  'Music & Audio': 'Other',
  'Program & Tech': 'Web Development',
  'Product Photography': 'Other',
  'Build AI Service': 'Other',
  'Data': 'Other',
  'Sales Associate': 'Other',
  'Customer Sales Associate': 'Other',
  'Administrators': 'Other',
  'Customer Service Rep': 'Other',
  'Bookkeeper': 'Other',
  'Editor': 'Content Writing',
  'Credit Repair Disputer': 'Other',
  'Executive Assistant': 'Other',
}

export const VALID_SERVICE_ENUMS = [
  'Web Development',
  'Digital Marketing',
  'Content Writing',
  'Other',
] as const

export type ServiceEnum = typeof VALID_SERVICE_ENUMS[number]

export function mapAgentServiceTitlesToEnums(titles: string[]): ServiceEnum[] {
  const mapped = titles.map(t => AGENT_SERVICE_MAPPING[t] || 'Other')
  // de-duplicate and constrain to known enums
  const unique = Array.from(new Set(mapped)) as string[]
  return unique.filter((v): v is ServiceEnum => (VALID_SERVICE_ENUMS as readonly string[]).includes(v))
}
