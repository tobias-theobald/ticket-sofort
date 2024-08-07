import { DeviceMotion, type DeviceMotionMeasurement, DeviceMotionOrientation } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Image, type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { b64ImageToImageSource } from '../util';

export type GyroscopeImageProps = {
    image: string;
};

const SENSOR_UPDATE_INTERVAL_MS = 200; // See the restriction on Android in the API docs

const DEAD_ZONE = 0.1;
const MAX_ROTATION = 0.5;

const relevantRotationByOrientation = (deviceMotionMeasurement: DeviceMotionMeasurement) => {
    switch (deviceMotionMeasurement.orientation) {
        case DeviceMotionOrientation.Portrait:
            return -deviceMotionMeasurement.rotation.gamma;
        case DeviceMotionOrientation.UpsideDown:
            return deviceMotionMeasurement.rotation.gamma;
        case DeviceMotionOrientation.LeftLandscape:
            return -deviceMotionMeasurement.rotation.beta;
        case DeviceMotionOrientation.RightLandscape:
            return deviceMotionMeasurement.rotation.beta;
    }
};

export const GyroscopeImage = ({ image }: GyroscopeImageProps) => {
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

    const [relativeRotation, setRelativeRotation] = useState<number>(0);

    useEffect(() => {
        DeviceMotion.setUpdateInterval(SENSOR_UPDATE_INTERVAL_MS);
        const subscription = DeviceMotion.addListener((deviceMotionMeasurementData) => {
            const rotationByOrientation = relevantRotationByOrientation(deviceMotionMeasurementData);
            const isNegative = rotationByOrientation < 0;
            const absRotation = Math.abs(rotationByOrientation);
            const relativeRotation =
                absRotation > DEAD_ZONE ? Math.min(absRotation - DEAD_ZONE, MAX_ROTATION) / MAX_ROTATION : 0;
            setRelativeRotation(relativeRotation * (isNegative ? -1 : 1));
        });
        return () => {
            DeviceMotion.removeSubscription(subscription);
        };
    }, []);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
    };

    const marginLeft = useSharedValue(0);

    useEffect(() => {
        if (dimensions === null) {
            return;
        }
        marginLeft.value = withTiming(((dimensions.width - dimensions.height) * (1 - relativeRotation)) / 2, {
            duration: SENSOR_UPDATE_INTERVAL_MS,
            easing: Easing.linear,
        });
    }, [dimensions, marginLeft, relativeRotation]);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            marginLeft: marginLeft.value,
        };
    });

    if (dimensions === null) {
        return <View style={styles.container} onLayout={onLayout} />;
    }

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            <Image
                source={b64ImageToImageSource(image)}
                style={styles.image}
                height={dimensions.height}
                width={dimensions.height}
                resizeMethod="scale"
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    image: {
        height: '100%',
    },
});
