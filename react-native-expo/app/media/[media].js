import { useLocalSearchParams } from "expo-router";
import { Media } from "../../components/Media";
import { ScrollView } from "react-native";

export default function MediaPage() {
    const { media } = useLocalSearchParams();

    return (
        <ScrollView style={{ flex: 1 }}>
            <Media youtubeId={media} />
        </ScrollView>
    );
}
