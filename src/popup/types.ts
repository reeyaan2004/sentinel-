export type Verdict = 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS'

export type Vectors = {
  urgency_manipulation: number
  domain_spoofing: number
  credential_harvesting: number
  impersonation: number
  emotional_manipulation: number
  url_anomalies: number
  attack_patterns: number
  linguistic_tells: number
}

export type ScanResult = {
  scan_id: string
  score: number
  verdict: Verdict
  vectors: Vectors
  red_flags: string[]
  summary: string
  eli5: string
  action_plan: string[]
}

export type Action = {
  sponsor: string
  text: string
  status: 'running' | 'done'
}

export type Tab = 'home' | 'results' | 'monitor'