import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // getHello(): any {
  //   return { "msg": "Nest Js says hello from the backend ahahahhah !" };
  // }
  googleLogin(req){
    if (!req.user){
      return 'No user from Google'
    }
    return {
      message: 'User Info from Google',
      user: req.user
    }
  }
}

