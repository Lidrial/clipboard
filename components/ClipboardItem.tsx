import { View, Text, TouchableOpacity } from "react-native";

interface ClipboardItemProps {
    text: string
    onCopy: (text: string) => void;
    onDelete?: () => void;
    timestamp?: number;
}

export function ClipboardItem({ text, onCopy }: ClipboardItemProps) {
    const handlePress = () => {
        onCopy(text);
    }

    return (
        <View className='flex-row justify-between border-b border-gray-300 pt-4 pb-4'>
            <View className='justify-center pl-6 flex-1'>
                <TouchableOpacity onPress={handlePress}>
                    <Text>{text}</Text>
                </TouchableOpacity>
            </View>
            <View className='flex-row w-1/3 justify-evenly'>
                <View className='h-16 w-px -my-2 bg-gray-200'></View>
                {(() => {
                    const date = new Date();
                    const [day, month, year] = date.toLocaleDateString('fr-FR').split('/');
                    const time = date.toLocaleTimeString('fr-FR');
                    return (
                        <View className="items-center justify-center">
                            <Text className='text-center'>
                                {`${day}/${month}/${year}`}
                                {'\n'}
                                {time}
                            </Text>
                        </View>
                    );
                })()}
            </View>
        </View>
    );
}