import { View, Text } from "react-native";

interface CopiedNotificationProps {
    isVisible: boolean;
}

export function CopiedNotification({ isVisible }: CopiedNotificationProps) {
    if (!isVisible) return null;

    return (
        <View className='absolute top-1/2 right-0 left-0 z-10 items-center justify-center'>
            <Text className='text-center text-white bg-green-600 p-4 rounded-lg shadow-lg'>
                ✅ Copied!
            </Text>
        </View>
    );
}