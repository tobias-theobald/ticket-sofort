import { addOrientationChangeListener, getOrientationAsync, Orientation } from 'expo-screen-orientation';
import { DeviceMotion, type DeviceMotionMeasurement } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Image, type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { b64ImageToImageSource } from '../util';

export type GyroscopeImageProps = {
    image: string;
};

const SENSOR_UPDATE_INTERVAL_MS = 200; // See the restriction on Android in the API docs

const DEAD_ZONE = 0.1;
const MAX_ROTATION = 0.7;

const relevantRotationByOrientation = (deviceMotionMeasurement: DeviceMotionMeasurement, orientation: Orientation) => {
    switch (orientation) {
        case Orientation.UNKNOWN:
        case Orientation.PORTRAIT_UP:
            return -deviceMotionMeasurement.rotation.gamma;
        case Orientation.PORTRAIT_DOWN:
            return deviceMotionMeasurement.rotation.gamma;
        case Orientation.LANDSCAPE_LEFT:
            return deviceMotionMeasurement.rotation.beta;
        case Orientation.LANDSCAPE_RIGHT:
            return -deviceMotionMeasurement.rotation.beta;
    }
};

export const GyroscopeImage = ({ image }: GyroscopeImageProps) => {
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
    const [orientation, setOrientation] = useState<Orientation>(Orientation.UNKNOWN);
    const [relativeRotation, setRelativeRotation] = useState<number>(0);

    useEffect(() => {
        // Get the initial orientation
        getOrientationAsync()
            .then((orientationInfo) => {
                setOrientation((currentOrientation) => {
                    // console.debug('Initial orientation:', { currentOrientation, orientationInfo });
                    if (currentOrientation !== Orientation.UNKNOWN) {
                        return currentOrientation;
                    } else {
                        return orientationInfo;
                    }
                });
            })
            .catch((error) => {
                console.error('Failed to get initial orientation:', error);
            });
        DeviceMotion.setUpdateInterval(SENSOR_UPDATE_INTERVAL_MS);
        const deviceMotionSubscription = DeviceMotion.addListener((deviceMotionMeasurementData) => {
            const rotationByOrientation = relevantRotationByOrientation(deviceMotionMeasurementData, orientation);
            // console.debug('Rotation by orientation:', rotationByOrientation);
            const isNegative = rotationByOrientation < 0;
            const absRotation = Math.abs(rotationByOrientation);
            const relativeRotation =
                absRotation > DEAD_ZONE ? Math.min(absRotation - DEAD_ZONE, MAX_ROTATION) / MAX_ROTATION : 0;
            const newRelativeRotation = relativeRotation * (isNegative ? -1 : 1);
            // console.debug('Setting relative rotation:', newRelativeRotation);
            setRelativeRotation(newRelativeRotation);
        });
        const screenOrientationSubscription = addOrientationChangeListener((orientationChangeEvent) => {
            // console.debug('Orientation changed:', orientationChangeEvent);
            setOrientation(orientationChangeEvent.orientationInfo.orientation);
        });
        return () => {
            DeviceMotion.removeSubscription(deviceMotionSubscription);
            screenOrientationSubscription.remove();
        };
    }, [orientation]);

    const onLayout = (event: LayoutChangeEvent) => {
        // console.debug('Layout event:', event.nativeEvent.layout);
        const { width, height } = event.nativeEvent.layout;
        const roundedWidth = Math.round(width);
        const roundedHeight = Math.round(height);
        setDimensions((currentDimensions) => {
            if (
                currentDimensions === null ||
                currentDimensions.width !== roundedWidth ||
                currentDimensions.height !== roundedHeight
            ) {
                // console.debug('Dimensions changed:', { width, height });
                return { width: roundedWidth, height: roundedHeight };
            } else {
                return currentDimensions;
            }
        });
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
        <Animated.View style={[styles.container, animatedStyles]} onLayout={onLayout}>
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
