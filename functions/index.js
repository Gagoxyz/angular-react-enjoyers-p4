const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

// --- 1. NOTIFICAR NUEVO JUGADOR ---
exports.notifyNewPlayer = onDocumentCreated("players/{playerId}", async (event) => {
    const newPlayer = event.data.data(); 
    
    // A) Configuración para Angular (Tokens)
    const payloadTokens = {
        notification: {
            title: "¡Nuevo jugador fichado!",
            body: `${newPlayer.nombre} se ha unido al equipo.`,
        }
    };

    // B) Configuración para React Native (Topic)
    const messageTopic = {
        notification: {
            title: "¡Nuevo jugador fichado!",
            body: `${newPlayer.nombre} se ha unido al equipo.`,
        },
        android: { notification: { channelId: "default", priority: "high", sound: "default" } },
        topic: "players" // <--- Esto activará tu APK de React Native
    };

    try {
        // 1. Enviar a Angular (Tokens)
        const tokensSnapshot = await admin.firestore().collection("fcm_tokens").get();
        const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

        if (tokens.length > 0) {
            await admin.messaging().sendEachForMulticast({
                tokens: tokens,
                notification: payloadTokens.notification,
            });
            console.log("✅ Angular: Notificación enviada a tokens.");
        }

        // 2. Enviar a React Native (Topic)
        await admin.messaging().send(messageTopic);
        console.log("✅ React Native: Notificación enviada al tópico 'players'.");

    } catch (error) {
        console.error("❌ Error enviando notificaciones:", error);
    }
});

// --- 2. NOTIFICAR JUGADOR ACTUALIZADO ---
exports.notifyPlayerUpdated = onDocumentUpdated("players/{playerId}", async (event) => {
    const after = event.data.after.data();
    
    // A) Configuración para Angular (Tokens)
    const payloadTokens = {
        notification: {
            title: "¡Jugador actualizado!",
            body: `${after.nombre} ha actualizado sus datos.`,
        }
    };

    // B) Configuración para React Native (Topic)
    const messageTopic = {
        notification: {
            title: "¡Jugador actualizado!",
            body: `${after.nombre} ha actualizado sus datos.`,
        },
        android: { notification: { channelId: "default", priority: "high", sound: "default" } },
        topic: "players"
    };

    try {
        // 1. Enviar a Angular (Tokens)
        const tokensSnapshot = await admin.firestore().collection("fcm_tokens").get();
        const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

        if (tokens.length > 0) {
            await admin.messaging().sendEachForMulticast({
                tokens: tokens,
                notification: payloadTokens.notification,
            });
            console.log("✅ Angular: Update enviado a tokens.");
        }

        // 2. Enviar a React Native (Topic)
        await admin.messaging().send(messageTopic);
        console.log("✅ React Native: Update enviado al tópico 'players'.");

    } catch (error) {
        console.error("❌ Error enviando notificaciones de actualización:", error);
    }
});