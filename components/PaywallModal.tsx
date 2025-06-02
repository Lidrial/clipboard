import { View, Text, TouchableOpacity, Modal } from "react-native";

interface PaywallModalProps {
    isVisible: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

export function PaywallModal({ isVisible, onClose, onUpgrade }: PaywallModalProps) {
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/70 justify-center items-center">

                <View className="bg-white m-6 rounded-xl p-6 shadow-lg">
                    {/* Header */}
                    <Text className="text-center text-4xl mb-2">📚</Text>
                    <Text className="text-2xl font-bold text-gray-500 text-center">
                        Storage Full !
                    </Text>
                    <Text className="text-gray-600 text-center mt-2">
                        Upgrade to save unlimited items
                    </Text>

                    {/* Simple feature list */}
                    <View className="mb-6">
                        <Text className='text-gray-700 text-center'>✅ Unlimited clipboard items</Text>
                        <Text className='text-gray-700 text-center'>✅ Advanced search & organization</Text>
                        <Text className='text-gray-700 text-center'>✅ iCloud sync across devices</Text>
                    </View>

                    {/* Pricing */}
                    <View className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <Text className="text-center text-lg font-bold text-blue-600">
                            $6.99/month
                        </Text>
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity onPress={onUpgrade} className="bg-blue-500 py-4 px-6 rounded-lg mb-3">
                        <Text className="text-white text-center font-bold text-lg">
                            🚀 Upgrade to Premium
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={onClose} className="py-3 px-6">
                    <Text className="text-gray-500 text-center text-sm">
                        Continue with Free (oldest items auto-deleted)
                    </Text>
                </TouchableOpacity>
            </View>


        </Modal>
    )
}