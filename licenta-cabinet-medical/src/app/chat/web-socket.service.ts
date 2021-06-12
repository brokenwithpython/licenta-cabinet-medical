// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import * as io from 'socket.io-client';
// import { environment } from 'src/environments/environment';



// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService {
//   socket: any;

//   constructor() {
//     this.socket = io.io(environment.socketIoUrl);
//    }



//   listen(eventName: string) {
//     return new Observable(subscriber => {
//       this.socket.on(eventName, data => {
//         subscriber.next(data);
//       });
//     });
//   }

//   emit(eventName: string, data: any) {
//     this.socket.emit(eventName, data);
//   }

//   broadCastEmit(eventName: string, data:any) {
//     this.socket.broadcast.emit("Hello!");
//   }

// }
