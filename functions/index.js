const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

// Esta función se dispara cada vez que se crea un documento en la colección "players"
exports.notifyNewPlayer = onDocumentCreated("players/{playerId}", async (event) => {
    const newPlayer = event.data.data(); // Datos del jugador recién creado
    const payload = {
        notification: {
            title: "¡Nuevo jugador fichado!",
            body: `${newPlayer.nombre} ${newPlayer.apellidos} se ha unido al equipo.`,
            icon: "https://tu-url-de-logo.png", // Usa una URL pública de tu logo
        }
    };

    try {
        // 1. Obtenemos todos los tokens guardados en la colección fcm_tokens
        const tokensSnapshot = await admin.firestore().collection("fcm_tokens").get();
        const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

        if (tokens.length > 0) {
            // 2. Enviamos la notificación a todos los tokens encontrados
            const response = await admin.messaging().sendEachForMulticast({
                tokens: tokens,
                notification: payload.notification,
            });
            console.log(`Notificaciones enviadas con éxito: ${response.successCount}`);
        } else {
            console.log("No hay tokens registrados para notificar.");
        }
    } catch (error) {
        console.error("Error enviando notificaciones:", error);
    }
});