import { Stack } from 'expo-router/stack';

export default function MyLayout() {
    return (
        <Stack>
            <Stack.Screen
                name='data'
                // or href='..'
                options={{ animation: 'none' }}
            />
        </Stack>
    );
}