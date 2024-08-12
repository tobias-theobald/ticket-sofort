import { type PropsWithChildren, useCallback, useState } from 'react';
import {
    type GestureResponderEvent,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

type PressableProps = {
    onPress?: () => void;

    /**
     * The distance in pixels a touch start event can be from the touch end event for the touch event to count as a press.
     * This can be useful for differentiating between scrolling and pressing.
     */
    pressDistanceThreshold?: number;
    pressDurationThreshold?: number;
};

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

export function PageNoScroll({
    children,
    onPress,
    pressDistanceThreshold = 10,
    pressDurationThreshold = 1000,
}: PropsWithChildren<PressableProps>) {
    const [pressInCoordinates, setPressInCoordinates] = useState<{ x: number; y: number; time: number } | null>(null);
    const onPressIn = useCallback(
        (event: GestureResponderEvent) => {
            if (onPress === undefined) {
                return;
            }
            setPressInCoordinates({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY, time: Date.now() });
        },
        [onPress],
    );
    const onPressOut = useCallback(
        (event: GestureResponderEvent) => {
            setPressInCoordinates(null);
            if (onPress === undefined) {
                return;
            }
            if (pressInCoordinates === null) {
                // what? how?
                return;
            }
            const pressOutCoordinates = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
            if (
                Math.abs(pressInCoordinates.x - pressOutCoordinates.x) < pressDistanceThreshold &&
                Math.abs(pressInCoordinates.y - pressOutCoordinates.y) < pressDistanceThreshold &&
                Date.now() - pressInCoordinates.time < pressDurationThreshold
            ) {
                onPress();
            }
        },
        [onPress, pressDistanceThreshold, pressDurationThreshold, pressInCoordinates],
    );

    const content = (
        <SafeAreaView style={styles.container}>
            <View style={styles.page}>{children}</View>
        </SafeAreaView>
    );

    if (!onPress) {
        return content;
    }
    return (
        <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
            {content}
        </TouchableWithoutFeedback>
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
