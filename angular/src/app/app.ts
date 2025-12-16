import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { Messaging, onMessage, getToken } from '@angular/fire/messaging';
import { ToastrService } from 'ngx-toastr';
import { environment } from './environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, YouTubePlayerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('equipo-basket');
  private messaging = inject(Messaging);
  private toastr = inject(ToastrService);

  ngOnInit() {
    this.requestPermission();
    this.listenForMessages();
  }

  requestPermission() {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Permiso concedido.');
        // Aquí podrías obtener el token si quisieras guardarlo en BD
      }
    });
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Mensaje recibido:', payload);
      this.toastr.success(payload.notification?.body, payload.notification?.title);
    });
  }
}