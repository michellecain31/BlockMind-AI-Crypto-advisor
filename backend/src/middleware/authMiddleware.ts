import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  userId?: string
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required',
    })
  }

  const token = authorizationHeader.split(' ')[1]

  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is missing')
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string
    }

    req.userId = decoded.userId

    next()
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
}

export default authMiddleware