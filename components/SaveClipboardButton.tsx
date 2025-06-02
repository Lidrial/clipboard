import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SaveClipboardButtonProps {
    onPress: () => void;
    itemCount?: number;
    maxItems?: number;
}

export function SaveClipboardButton({ onPress, itemCount, maxItems }: SaveClipboardButtonProps) {
    return (
        <LinearGradient colors={['#3b82f6', '#1d4ed8']} className="p-4">
            <TouchableOpacity onPress={onPress} className="py-4 px-6 bg-white rounded-lg shadow-sm">
                <Text className="text-center font-bold text-lg text-blue-500">
                    💾 Save Current Clipboard
                </Text>

                {itemCount !== undefined && maxItems !== undefined && (
                    <Text className="text-center text-sm text-gray-600 mt-2">
                        {itemCount} / {maxItems} items saved
                    </Text>
                )}
            </TouchableOpacity>
        </LinearGradient>
    )
}