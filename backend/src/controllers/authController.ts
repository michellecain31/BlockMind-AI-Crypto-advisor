import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const createToken = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is missing')
  }

  return jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: '7d' },
  )
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existingUser = await User.findOne({
      email: normalizedEmail,
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    const token = createToken(user._id.toString())

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
      },
    })
  } catch (error) {
    console.error('Register error:', error)

    return res.status(500).json({
      message: 'Something went wrong while creating the account',
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: normalizedEmail,
    })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const token = createToken(user._id.toString())

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        preferences: user.preferences,
      },
    })
  } catch (error) {
    console.error('Login error:', error)

    return res.status(500).json({
      message: 'Something went wrong while logging in',
    })
  }
}
export const getCurrentUser = async (
    req: Request & { userId?: string },
    res: Response,
  ) => {
    try {
      const user = await User.findById(req.userId).select('-password')
  
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        })
      }
  
      return res.status(200).json({
        user,
      })
    } catch (error) {
      console.error('Get current user error:', error)
  
      return res.status(500).json({
        message: 'Something went wrong',
      })
    }
  }