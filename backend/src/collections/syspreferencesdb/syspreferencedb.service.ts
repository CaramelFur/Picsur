import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ESysPreferenceBackend } from '../../models/entities/syspreference.entity';

@Injectable()
export class SysPreferenceService {
  constructor(
    @InjectRepository(ESysPreferenceBackend)
    private usersRepository: Repository<ESysPreferenceBackend>,
  ) {}

  
}
