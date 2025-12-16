import { Component, OnInit, inject } from '@angular/core'; // <--- Importar OnInit e inject
import { RouterOutlet, RouterLink } from '@angular/router';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging'; // <--- Importar mensajería
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // Si usas YouTubePlayerModule agrégalo aquí también
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private messaging = inject(Messaging);
  private toastr = inject(ToastrService);

  ngOnInit() {
    this.requestPermission();
    this.listenForMessages();
  }

  requestPermission() {
    getToken(this.messaging, { vapidKey: 'BBFjtwxmc2Onk-Lky7UxvjCQRUNACEtWTc1IpbxMc5rsYoCXWn03sxs_ftg-qD1XhRIXFa8IwbAR9DU92ukRDMQ' }) // Opcional por ahora si solo probamos en local
      .then((currentToken) => {
        if (currentToken) {
          console.log("Token recibido para Angular:", currentToken);
          // NOTA IMPORTANTE: En Web no se puede hacer 'subscribeToTopic' desde el cliente.
          // Para probar el TOPIC 'updates', confiaremos en la App Móvil primero.
        } else {
          console.log('No se obtuvo token');
        }
      }).catch((err) => {
        console.log('Error al pedir token: ', err);
      });
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Mensaje recibido en foreground:', payload);
      this.toastr.success(payload.notification?.body, payload.notification?.title);
    });
  }
}