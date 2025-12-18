import { Component, OnInit } from '@angular/core';
// AÑADE ESTA IMPORTACIÓN:
import { RouterModule } from '@angular/router'; 
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true, // Asegúrate de que sea standalone
  imports: [RouterModule], // AÑADE RouterModule AQUÍ
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    // Es importante que el servicio esté creado antes de llamar a estos métodos
    this.notificationService.requestPermission();
    this.notificationService.listenForMessages();
  }
}