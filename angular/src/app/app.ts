import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NotificationService } from './services/notification.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    YouTubePlayerModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private notificationService = inject(NotificationService);
  protected readonly title = signal('equipo-basket');

  ngOnInit() {
    // Solicitamos permiso y empezamos a escuchar mensajes
    this.notificationService.requestPermission();
    this.notificationService.listenForMessages();
  }
}