import { Module } from '@nestjs/common';
import { SamplesService } from './samples.service';

@Module({
  providers: [SamplesService]
})
export class SamplesModule {}
