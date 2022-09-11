import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return { "msg": "Nest Js says hello from the backend ahahahhah !" };
  }
}

