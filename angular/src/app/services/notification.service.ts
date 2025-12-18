import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Inyectamos las dependencias necesarias
  private messaging: Messaging = inject(Messaging);
  private firestore: Firestore = inject(Firestore);
  private injector: EnvironmentInjector = inject(EnvironmentInjector);

  constructor() { }

  /**
   * Solicita permisos al usuario y obtiene el token de Firebase
   */
  requestPermission() {
    // Ejecutamos en el contexto de inyección para evitar errores de zona en Angular
    runInInjectionContext(this.injector, () => {
      getToken(this.messaging, { 
        vapidKey: 'BBFjtwxmc2Onk-Lky7UxvjCQRUNACEtWTc1IpbxMc5rsYoCXWn03sxs_ftg-qD1XhRIXFa8IwbAR9DU92ukRDMQ' 
      })
      .then((currentToken) => {
        if (currentToken) {
          console.log('FCM Token obtenido:', currentToken);
          this.saveTokenToFirestore(currentToken);
        } else {
          console.warn('No se pudo obtener el token. Asegúrate de dar permisos en el navegador.');
        }
      })
      .catch((err) => {
        console.error('Error al obtener el token de notificación:', err);
      });
    });
  }

  /**
   * Guarda el token en la colección 'fcm_tokens' de Firestore si no existe ya
   */
  private async saveTokenToFirestore(token: string) {
    try {
      const tokensCollection = collection(this.firestore, 'fcm_tokens');
      
      // Verificamos si el token ya está registrado para no duplicar datos
      const q = query(tokensCollection, where('token', '==', token));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(tokensCollection, {
          token: token,
          platform: 'web',
          createdAt: new Date()
        });
        console.log('Token registrado en la base de datos para futuras notificaciones.');
      } else {
        console.log('El token ya está registrado en el sistema.');
      }
    } catch (error) {
      console.error('Error al guardar el token en Firestore:', error);
    }
  }

  /**
   * Escucha mensajes cuando la aplicación está en primer plano
   */
  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Notificación recibida en primer plano:', payload);
      // Aquí podrías usar Toastr para mostrar una alerta visual elegante
      alert(`${payload.notification?.title}: ${payload.notification?.body}`);
    });
  }
}