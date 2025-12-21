const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyNewPlayer = onDocumentCreated("players/{playerId}", async (event) => {
    const newPlayer = event.data.data(); 
    const payload = {
        notification: {
            title: "¡Nuevo jugador fichado!",
            body: `${newPlayer.nombre} se ha unido al equipo.`,
        }
    };

    try {
        // Obtenemos los tokens de la colección que creamos en el servicio de Angular
        const tokensSnapshot = await admin.firestore().collection("fcm_tokens").get();
        const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

        if (tokens.length > 0) {
            await admin.messaging().sendEachForMulticast({
                tokens: tokens,
                notification: payload.notification,
            });
            console.log("Notificaciones enviadas");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});