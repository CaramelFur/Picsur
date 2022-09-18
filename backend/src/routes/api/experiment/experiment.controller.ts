import { WebSocketGateway } from '@nestjs/websockets';


@WebSocketGateway({
  namespace: 'experiment',
})
export class ExperimentController {
  constructor() {
    console.log('ExperimentController created');
  }

  // @SubscribeMessage('test')
  // async testRoute(@MessageBody() data: any): Promise<WsResponse> {
  //   console.log('testRoute', data);
  //   return Promise.resolve({
  //     event: 'test',
  //     data: Buffer.from('Hello'),
  //   })
  // }
}
