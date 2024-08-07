import type { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export function Page({ children }: PropsWithChildren) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.page} keyboardDismissMode="interactive">
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}

export function CenterPage({ children }: PropsWithChildren) {
    return (
        <SafeAreaView style={styles.centerContainer}>
            <ScrollView
                style={styles.page}
                keyboardDismissMode="interactive"
                contentContainerStyle={styles.centerContainer}
            >
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}

export function PageNoScroll({ children }: PropsWithChildren) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.page}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    page: {
        padding: 8,
        height: '100%',
        width: '100%',
        maxWidth: 600,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
