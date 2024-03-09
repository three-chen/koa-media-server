import argon2 from 'argon2'

import { JWT_SECRET } from '@/constants'
import { User } from '@/entity/User'
import jwt from 'jsonwebtoken'
import AuthR from '../data/auth/authR'

export default class AuthService {
  public static async verifyPassword(loginPassword: string, userPassword: string): Promise<Boolean> {
    console.log('loginPassword', loginPassword, 'userPassword', userPassword)

    return await argon2.verify(userPassword, loginPassword)
  }

  public static jwtSign(user: User): string {
    const auth: AuthR = { id: user.id, role: user.role }
    return jwt.sign(auth, JWT_SECRET, { expiresIn: '7d' })
  }

  public static getUserPermission(user: User) {
    const auth: AuthR = { id: user.id, role: user.role }
    return auth
  }
}
