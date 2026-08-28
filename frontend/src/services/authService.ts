import { API_URL } from './api'

export type AuthUser = {
  id: string
  name: string
  email: string
  onboardingCompleted: boolean
}

type AuthResponse = {
  message: string
  token: string
  user: AuthUser
}

type RegisterData = {
  name: string
  email: string
  password: string
}

type LoginData = {
  email: string
  password: string
}

const handleResponse = async (
  response: Response,
) => {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Something went wrong',
    )
  }

  return data
}

export const registerUser = async (
  formData: RegisterData,
): Promise<AuthResponse> => {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    },
  )

  return handleResponse(response)
}

export const loginUser = async (
  formData: LoginData,
): Promise<AuthResponse> => {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    },
  )

  return handleResponse(response)
}