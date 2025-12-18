import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage
} from "firebase/messaging";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class Notifications {
  private messaging;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
  }

  async requestPermissionAndToken() {
    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.log("Permiso de notificaciones denegado");
        return;
      }

      const token = await getToken(this.messaging, {
        vapidKey: environment.vapidKey
      });

      console.log("FCM Web Token:", token);

      // 🔔 Enviamos el token al backend para suscribirlo al topic
      await fetch(
        "https://us-central1-angular-react-enjoyers-p2.cloudfunctions.net/subscribeToPlayers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        }
      );

    } catch (err) {
      console.error("Error con FCM web", err);
    }
  }

  listenMessages() {
    onMessage(this.messaging, (payload) => {
      console.log("Mensaje recibido en foreground", payload);

      alert(
        `${payload.notification?.title}\n${payload.notification?.body}`
      );
    });
  }

  async disableNotifications() {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: environment.vapidKey
      });

      await fetch(
        "https://us-central1-angular-react-enjoyers-p2.cloudfunctions.net/unsubscribeFromPlayers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        }
      );

      console.log("Notificaciones desactivadas (topic players)");

    } catch (err) {
      console.error("Error al desactivar notificaciones", err);
    }
  }
}
