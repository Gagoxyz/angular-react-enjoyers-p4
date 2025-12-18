
const { setGlobalOptions } = require("firebase-functions");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

const { onRequest } = require("firebase-functions/v2/https");

// Inicializar Admin
admin.initializeApp();

// Control de contenedores
setGlobalOptions({ maxInstances: 10 });

const cors = require("cors")({ origin: true });

/* --- Nuevo jugador --- */
exports.onPlayerCreated = onDocumentCreated("players/{playerId}", async (event) => {
    const player = event.data.data();
    logger.info("Nuevo jugador creado", player);

    await admin.messaging().send({
        notification: {
            title: "🆕 Nuevo jugador",
            body: `Se ha añadido ${player.nombre} ${player.apellidos}`
        },
        topic: "players"
    });
});

/* --- Jugador modificado --- */
exports.onPlayerUpdated = onDocumentUpdated("players/{playerId}", async (event) => {
    const after = event.data.after.data();
    logger.info("Jugador actualizado", after);

    await admin.messaging().send({
        notification: {
            title: "✏ Jugador actualizado",
            body: `Se ha actualizado ${after.nombre} ${after.apellidos}`
        },
        topic: "players"
    });
});

/* --- Suscribir angular-messaging a "players" */
exports.subscribeToPlayers = onRequest((req, res) => {
    cors(req, res, async () => {
        const { token } = req.body;

        if (!token) {
            res.status(400).send("Token requerido");
            return;
        }

        try {
            await admin.messaging().subscribeToTopic(token, "players");
            res.status(200).send("Suscrito al topic players");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al suscribir");
        }
    });
});

exports.unsubscribeFromPlayers = onRequest((req, res) => {
    cors(req, res, async () => {
        const { token } = req.body;

        if (!token) {
            res.status(400).send("Token requerido");
            return;
        }

        try {
            await admin.messaging().unsubscribeFromTopic(token, "players");
            res.status(200).send("Desuscrito del topic players");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al desuscribir");
        }
    });
});