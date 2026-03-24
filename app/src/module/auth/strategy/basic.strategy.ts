import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { Strategy } from 'passport-local'

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'Basic') {
  constructor(private readonly config: ConfigService) {
    super({
      usernameField: 'user',
      passwordField: 'pass'
    })
  }

  validate(user: string, pass: string): boolean {
    if (user === this.config.getOrThrow<string>('USER')) {
      if (pass === this.config.getOrThrow<string>('PASS')) {
        return true
      }
    }

    return false
  }
}
