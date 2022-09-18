import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EIngressFileBackend } from '../../database/entities/ingress-file.entity';
import { IngressFileDbService } from './ingress-file-db.service';

@Module({
  imports: [TypeOrmModule.forFeature([EIngressFileBackend])],
  providers: [IngressFileDbService],
  exports: [IngressFileDbService],
})
export class IngressFileDbModule {}
