import { Module } from '@nestjs/common'

import { MessageProvider } from './provider'

@Module({
  exports: [MessageProvider],
  providers: [MessageProvider]
})
export class MessageModule {}
