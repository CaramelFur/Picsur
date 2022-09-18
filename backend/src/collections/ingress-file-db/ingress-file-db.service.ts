import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EIngressFileBackend } from '../../database/entities/ingress-file.entity';

@Injectable()
export class IngressFileDbService {
  private readonly logger = new Logger(IngressFileDbService.name);

  constructor(
    @InjectRepository(EIngressFileBackend)
    private readonly ingressFileRepo: Repository<EIngressFileBackend>,
  ) {}
}
