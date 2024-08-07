import { Link, Stack } from 'expo-router';
import { Button, Text } from 'react-native-paper';

import { Page } from '../components/Page';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <Page>
                <Text>This screen doesn&apos;t exist.</Text>
                <Link href="/">
                    <Button>Go to home screen!</Button>
                </Link>
            </Page>
        </>
    );
}
