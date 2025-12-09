
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const getPlayers = async () => {
    try {
        const documentData = await getDocs(collection(db, "players"));

        const players = [];
        documentData.forEach(doc => {
            players.push({id: doc.id, ...doc.data() });
        });

        return players;
    } catch (error) {
        console.error("Error al obtener los jugadores: ", error);
        return [];
    }
};
