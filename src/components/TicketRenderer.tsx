import { useMemo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import type { FullTicketDecoded } from '../types';
import { b64ImageToImageSource } from '../util';
import { TicketHeader } from './TicketHeader';

const ORIGIN_WHITELIST_HTML = ['*'];
export type TicketRendererProps = {
    ticket: FullTicketDecoded;
};
export const TicketRenderer = ({ ticket }: TicketRendererProps) => {
    const {
        templateDecoded: {
            content: {
                header: { background_colors: backgroundColors, global },
                images,
                pages: [page],
                styles: { global: globalStyles },
            },
        },
    } = ticket;

    const containerStyle = useMemo(
        () => ({
            backgroundColor: `#${backgroundColors.split(',')[1]}`,
        }),
        [backgroundColors],
    );

    const webViewSource = useMemo(
        () => ({
            html: page.replaceAll('{css}', globalStyles),
        }),
        [globalStyles, page],
    );

    const backgroundImageSource = useMemo(() => b64ImageToImageSource(images.background), [images.background]);

    return (
        <View style={containerStyle}>
            <ImageBackground source={backgroundImageSource}>
                <View style={styles.container}>
                    <View style={styles.ticketHeader}>
                        <TicketHeader {...global} images={images} />
                    </View>
                    <WebView
                        containerStyle={styles.webView}
                        style={styles.webView}
                        originWhitelist={ORIGIN_WHITELIST_HTML}
                        source={webViewSource}
                    />
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    ticketHeader: {
        height: 50,
        width: '100%',
    },
    webView: {
        flex: 0,
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
    },
});
