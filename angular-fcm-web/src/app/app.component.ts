import { Component, inject, OnInit } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Angular FCM Test</h1>
    <button (click)="requestPermissionAndGetToken()">
      Activar notificaciones
    </button>
  `,
  styles: [`
    button {
      padding: 10px 20px;
      cursor: pointer;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
    }
    button:hover {
      background: #0056b3;
    }
  `]
})
export class AppComponent implements OnInit {

  private messaging = inject(Messaging);

  ngOnInit() {
    this.registerServiceWorker();
    this.listenMessages();
  }

  /**
   * Registro explícito del Service Worker
   */
  private registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log('✅ Service Worker registrado:', registration);
        })
        .catch(error => {
          console.error('❌ Error registrando Service Worker:', error);
        });
    }
  }

  /**
   * Se ejecuta DIRECTAMENTE desde el click del usuario
   * (requisito obligatorio para Chrome / Edge)
   */
  public async requestPermissionAndGetToken() {
    try {
      console.log('🔔 Solicitando permiso de notificaciones...');

      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.warn('❌ Permiso de notificación denegado');
        return;
      }

      const VAPID_KEY =
        'BBFjtwxmc2Onk-Lky7UxvjCQRUNACEtWTc1IpbxMc5rsYoCXWnO3sxs_ftg-qD1XhRIXFa8IwbAR9DU92ukRDMQ';

      // Esperar a que el Service Worker esté activo
      const registration = await navigator.serviceWorker.ready;

      const token = await getToken(this.messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (!token) {
        console.warn('⚠️ No se pudo obtener el token FCM');
        return;
      }

      console.log('✅ FCM Web Token:', token);

      await this.subscribeToTopic(token);

    } catch (error) {
      console.error('🔥 Error en el flujo de notificaciones:', error);
      alert('Error al activar notificaciones. Revisa la consola.');
    }
  }

  /**
   * Llamada a Cloud Function para suscribir el token al topic
   */
  private async subscribeToTopic(token: string) {
    console.log('📡 Suscribiendo al topic "players"...');

    try {
      const response = await fetch(
        'https://us-central1-angular-react-enjoyers-p2.cloudfunctions.net/subscribeToPlayers',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error('⚠️ Error en Cloud Function:', text);
        return;
      }

      console.log('🚀 Suscripción al topic completada');
      alert('¡Notificaciones activadas con éxito!');

    } catch (error) {
      console.error('❌ Error conectando con la Cloud Function:', error);
    }
  }

  /**
   * Mensajes recibidos con la app en primer plano
   */
  private listenMessages() {
    onMessage(this.messaging, payload => {
      console.log('📩 Mensaje recibido en foreground:', payload);
      alert(
        `${payload.notification?.title}\n${payload.notification?.body}`
      );
    });
  }
}