import { Module } from '@nestjs/common'

import { MailerModule } from '@nestjs-modules/mailer'

import { MailerConfigFactory } from './mailer.config.factory'
import { MailProvider } from './provider'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfigFactory
    })
  ],
  exports: [MailProvider],
  providers: [MailProvider]
})
export class MailModule {}
