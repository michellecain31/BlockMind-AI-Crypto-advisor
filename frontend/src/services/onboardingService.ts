import { API_URL } from './api'

export type OnboardingData = {
  assets: string[]
  investorStyle: string
  contentPreferences: string[]
}

export const saveOnboardingPreferences = async (
  data: OnboardingData,
) => {
  const token = localStorage.getItem('blockmind_token')

  if (!token) {
    throw new Error('You must be logged in')
  }

  const response = await fetch(`${API_URL}/onboarding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to save onboarding preferences',
    )
  }

  return result
}