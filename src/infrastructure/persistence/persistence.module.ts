import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  // potential candidates more - s3, other cloud drive, nosql, etc.
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PersistenceModule {}
