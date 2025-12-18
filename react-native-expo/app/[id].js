import { useLocalSearchParams } from "expo-router";
import { Detail } from "../components/Detail";
import { ScrollView } from "react-native";

export default function DetailPage() {
    const { id } = useLocalSearchParams();

    return (
        <ScrollView style={{ flex: 1 }}>
            <Detail id={id} />
        </ScrollView>
    );
}
