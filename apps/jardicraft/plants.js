export class NotificationSystem {
  constructor(state){ this.state=state; }
  push(title, body){
    const n={title, body, day:this.state.day, time:Date.now()};
    this.state.notifications.unshift(n); this.state.diary.unshift(`Dia ${this.state.day}: ${title}. ${body}`);
    if(this.state.notifications.length>40) this.state.notifications.pop();
  }
}
