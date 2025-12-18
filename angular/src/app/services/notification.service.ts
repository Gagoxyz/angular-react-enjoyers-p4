// src/app/services/notification.service.ts
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '../environments/environment';
import { Injectable, EnvironmentInjector, runInInjectionContext } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private messaging: Messaging,
    private injector: EnvironmentInjector
  ) {}

  requestPermission() {
    // Solicitamos permiso al navegador
    runInInjectionContext(this.injector, () => {
    getToken(this.messaging, { vapidKey: 'BBFjtwxmc2Onk-Lky7UxvjCQRUNACEtWTc1IpbxMc5rsYoCXWn03sxs_ftg-qD1XhRIXFa8IwbAR9DU92ukRDMQ' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('FCM Token generado:', currentToken);
          // TODO: Guardar este token en Firestore para enviarle notificaciones a este usuario
        } else {
          console.warn('No se pudo obtener el token. Revisa los permisos.');
        }
      })
      .catch((err) => console.error('Error al obtener token:', err));
  }
  );
  }


  listenForMessages() {
    // Escuchar mensajes cuando la app está abierta (primer plano)
    onMessage(this.messaging, (payload) => {
      console.log('Mensaje recibido en primer plano:', payload);
      alert(`${payload.notification?.title}: ${payload.notification?.body}`);
    });
  }
}