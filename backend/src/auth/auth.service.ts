import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    // For testing purposes: allow any student mail to login and auto-register them
    if (email.toLowerCase() !== 'admin@ug.edu.gh') {
      if (!user) {
        return this.usersService.create({
          email,
          password: pass || 'default_password',
          name: email.split('@')[0],
          role: 'STUDENT' as any,
          studentId: Math.floor(10000000 + Math.random() * 90000000).toString(),
        });
      }
      // If student exists, bypass password check for easy testing
      const { password, ...result } = user;
      return result;
    }

    // Admin still requires proper password validation
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload
    };
  }
}
