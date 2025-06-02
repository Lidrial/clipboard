import { FlatList, View } from "react-native";
import { ClipboardItem } from "./ClipboardItem";

interface ClipboardListProps {
    data: string[];
    onCopy: (text: string) => void;
    onDelete?: (index: number) => void;
}

export function ClipBoardList({ data, onCopy, onDelete }: ClipboardListProps) {
    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={data}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item, index }) => (
                    <ClipboardItem
                        text={item}
                        onCopy={onCopy}
                        onDelete={onDelete ? () => onDelete(index) : undefined}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
}