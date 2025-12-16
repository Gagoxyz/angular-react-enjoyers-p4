// src/app/services/notification.service.ts
import { Injectable, inject } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messaging = inject(Messaging);
  private toastr = inject(ToastrService);

  constructor() { }

  async requestPermission() {
    console.log('Pidiendo permiso para notificaciones...');
    try {
      // 1. Pedir permiso al navegador
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Permiso concedido.');
        
        // 2. Obtener el token único del dispositivo
        // REEMPLAZA "TU_VAPID_KEY" CON LA CLAVE LARGA DE FIREBASE CONSOLE
        const token = await getToken(this.messaging, { 
          vapidKey: 'BBFjtwxmc2Onk-Lky7UxvjCQRUNACEtWTc1IpbxMc5rsYoCXWn03sxs_ftg-qD1XhRIXFa8IwbAR9DU92ukRDMQ' 
        });

        console.log('🔥 TOKEN DE NOTIFICACIONES:', token);
        console.log('(Copia este token para probar en Firebase Console)');
        
        // Aquí podrías guardar el token en Firestore asociado al usuario
      } else {
        console.warn('❌ Permiso denegado por el usuario');
        this.toastr.warning('No recibirás avisos de partidos', 'Notificaciones bloqueadas');
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
    }
  }

  listen() {
    // Escuchar mensajes cuando la web está abierta (Primer plano)
    onMessage(this.messaging, (payload) => {
      console.log('Mensaje recibido en primer plano:', payload);
      this.toastr.info(payload.notification?.body, payload.notification?.title);
    });
  }
}