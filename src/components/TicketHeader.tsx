import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import type { TicketHeaderElement, TicketTemplateDecoded } from '../types';
import { b64ImageToImageSource } from '../util';
import { GyroscopeImage } from './GyroscopeImage';
import { SvgClock } from './SvgClock';

type ImagesMap = Pick<TicketTemplateDecoded['content'], 'images'>;

const TicketHeaderPart = (props: { header: TicketHeaderElement } & ImagesMap) => {
    switch (props.header.type) {
        case 'color':
            return <View style={{ backgroundColor: props.header.color }} />;
        case 'image':
            return (
                <Image
                    source={b64ImageToImageSource(props.images[props.header.key])}
                    height={50}
                    width={50}
                    resizeMethod="scale"
                />
            );
        case 'gyroscope_image':
            return <GyroscopeImage image={props.images[props.header.key]} />;
        case 'analog_clock':
            return <SvgClock />;
        case 'text':
            return (
                <Text
                    style={{
                        color: props.header.color,
                        fontWeight: props.header.bold ? 'bold' : undefined,
                        fontSize: props.header.size,
                    }}
                >
                    {props.header.text}
                </Text>
            );
    }
};

export type TicketHeaderProps = TicketTemplateDecoded['content']['header']['global'] & ImagesMap;
export const TicketHeader = ({ background, bottom, left, right, top, images }: TicketHeaderProps) => {
    let backgroundColor = 'white';
    if (background.type === 'color') {
        backgroundColor = '#' + background.color;
    }
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.outerElement}>
                <TicketHeaderPart header={left} images={images} />
            </View>
            <View style={styles.centerElement}>
                <View style={styles.centerContainer}>
                    <View style={styles.innerElement}>
                        <TicketHeaderPart header={top} images={images} />
                    </View>
                    <View style={styles.innerElement}>
                        <TicketHeaderPart header={bottom} images={images} />
                    </View>
                </View>
            </View>
            <View style={styles.outerElement}>
                <TicketHeaderPart header={right} images={images} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        gap: 10,
    },
    outerElement: {
        width: 50,
        height: 50,
    },
    centerElement: {
        flexGrow: 2,
    },
    centerContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    innerElement: {
        height: 22,
    },
});
