import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import type { Cache } from 'cache-manager'

import { MessageProvider } from '@/module/message/provider'
import { UserRepository } from '@/module/user/repository/user.repository'

import { KeyAuthProvider } from './key.auth.provider'
import { PhoneAuthProvider } from './phone.auth.provider'
import { RenewAuthProvider } from './renew.auth.provider'
import { VerifyAuthProvider } from './verify.auth.provider'

@Injectable()
export class AuthProvider {
  readonly key: KeyAuthProvider
  readonly phone: PhoneAuthProvider
  readonly renew: RenewAuthProvider
  readonly verify: VerifyAuthProvider

  constructor(
    private readonly token: JwtService,
    @Inject(CACHE_MANAGER) private readonly store: Cache,
    private readonly config: ConfigService,
    private readonly message: MessageProvider,
    private readonly repository: UserRepository
  ) {
    this.key = new KeyAuthProvider(this.token, this.config, this.repository)
    this.phone = new PhoneAuthProvider(this.store, this.message, this.repository)
    this.renew = new RenewAuthProvider(this.token, this.config, this.repository)
    this.verify = new VerifyAuthProvider(this.token, this.store, this.config, this.repository)
  }
}
