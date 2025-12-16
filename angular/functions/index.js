/**
 * Importamos los disparadores: Created (Crear) y Updated (Actualizar)
 */
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

// Inicializamos admin una sola vez
admin.initializeApp();

// --- 1. Trigger al CREAR (Ya lo tenías) ---
exports.onCreatePlayer = onDocumentCreated("players/{playerId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const playerData = snapshot.data();

    const message = {
        notification: {
            title: "¡Nuevo Fichaje! ⚽",
            body: `${playerData.name} se ha unido al equipo como ${playerData.position}.`
        },
        topic: "updates"
    };

    try {
        await admin.messaging().send(message);
        console.log("Notificación de creación enviada.");
    } catch (error) {
        console.error("Error enviando notificación:", error);
    }
});

// --- 2. Trigger al ACTUALIZAR (Nuevo) ---
exports.onUpdatePlayer = onDocumentUpdated("players/{playerId}", async (event) => {
    // En Update, event.data es un objeto con 'before' y 'after'
    const change = event.data;

    const nuevoDato = change.after.data();
    const viejoDato = change.before.data();

    // Verificamos si cambió la posición (para no notificar por cualquier cosa)
    // Si la posición vieja es igual a la nueva, no hacemos nada.
    if (viejoDato.position === nuevoDato.position) {
        console.log("La posición no cambió, no se envía notificación.");
        return; 
    }

    const message = {
        notification: {
            title: "¡Cambio de Táctica! 🔄",
            body: `${nuevoDato.name} ahora juega de ${nuevoDato.position} (antes ${viejoDato.position}).`
        },
        topic: "updates"
    };

    try {
        await admin.messaging().send(message);
        console.log("Notificación de actualización enviada para:", nuevoDato.name);
    } catch (error) {
        console.error("Error enviando actualización:", error);
    }
});