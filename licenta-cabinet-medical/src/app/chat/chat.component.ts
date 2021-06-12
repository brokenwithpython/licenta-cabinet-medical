import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent{

  // form: FormGroup;


  // constructor(private webSocketService: WebsocketService) { }

  // ngOnInit(): void {
  //   this.webSocketService.listen('test event').subscribe(data => {
  //     console.log(data);
  //   })
  //   this.webSocketService.listen('chat message').subscribe(data => {
  //     console.log(data);
  //   })

  //   this.form = new FormGroup({
  //     message: new FormControl(null, {validators: [Validators.required]})
  //   });

  // }


  // sendMessage() {
  //   this.webSocketService.emit("chat message", this.form.get('message').value);
  // }



}
