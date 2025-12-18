import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notifications } from './services/notifications';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('angular-messaging');
  constructor(private notifications: Notifications) { }

  ngOnInit() {
    this.notifications.listenMessages();
  }

  enableNotifications() {
    this.notifications.requestPermissionAndToken();
  }

  disableNotifications() {
    this.notifications.disableNotifications();
  }
}
