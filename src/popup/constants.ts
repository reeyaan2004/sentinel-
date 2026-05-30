
// During development before Railway is up, use:
export const API_BASE = 'http://127.0.0.1:8000/'

export const VECTOR_LABELS: Record<string, string> = {
  urgency_manipulation: 'Urgency',
  domain_spoofing: 'Domain',
  credential_harvesting: 'Creds',
  impersonation: 'Impersonation',
  emotional_manipulation: 'Emotional',
  url_anomalies: 'URLs',
  attack_patterns: 'Patterns',
  linguistic_tells: 'Linguistic',
}

export const SPONSOR_COLORS: Record<string, string> = {
  NordVPN: '#4687FF',
  NordProtect: '#00E5A0',
  Incogni: '#A855F7',
  NordPass: '#FFB347',
  Sentinel: '#00C8FF',
}

export const EXAMPLE_INPUTS = {
  phishing: `URGENT: Your TD Bank account has been compromised. We detected suspicious login activity from Romania at 3:42 AM. Your account will be suspended within 24 hours unless you verify your identity immediately.

Click here to verify: http://td-secure-verify.xyz/account/login?token=a8f3k2

This is your final notice. Failure to verify will result in permanent account suspension and a hold on all pending transactions.

— TD Bank Security Team`,

  job_scam: `Hi! I found your profile on LinkedIn and I'm reaching out about an exciting remote opportunity. We're hiring Work From Home assistants at $4,500/week, no experience required. 

To process your application we need your SIN number, date of birth, and a $150 processing fee via e-transfer to jobs@quickhire-ca.net. 

Interviews are this week only — positions fill fast!`,

  safe: `Hi Sarah, just a reminder that our team sync is moved to 3pm tomorrow instead of 2pm. We'll be covering the Q3 roadmap and the new onboarding flow. Let me know if you can't make it. — Mike`,
}