import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MainAuthGuard extends AuthGuard(['jwt', 'guest']) {}
