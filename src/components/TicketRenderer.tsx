import { useCallback, useMemo, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import type { FullTicketDecoded } from '../types';
import { b64ImageToImageSource } from '../util';
import { TicketHeader } from './TicketHeader';

const INJECTED_CSP_META = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox; frame-ancestors 'none';">`;
const SCRIPT_REGEX = /<script>.*<\/script>/g;
const HEAD_CLOSE_TAG = '</head>';
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

    /*
      This is a hack to force the webview to rerender when the content process dies
      That tends to happen when the app is in the background for a while
    */
    const [webviewRerenderCounter, setWebviewRerenderCounter] = useState(0);
    const rerenderWebview = useCallback(() => setWebviewRerenderCounter((prev) => prev + 1), []);

    const containerStyle = useMemo(
        () => ({
            backgroundColor: `#${backgroundColors.split(',')[1]}`,
        }),
        [backgroundColors],
    );

    const webViewSource = useMemo(
        () => ({
            html: page
                .replaceAll('{css}', globalStyles)
                .replaceAll(SCRIPT_REGEX, '')
                .replaceAll(HEAD_CLOSE_TAG, INJECTED_CSP_META + HEAD_CLOSE_TAG),
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
                        key={webviewRerenderCounter}
                        containerStyle={styles.webView}
                        style={styles.webView}
                        source={webViewSource}
                        // I really wish I could restrict the allowed origins to nothing except the ticket source
                        originWhitelist={ORIGIN_WHITELIST_HTML}
                        // Lock it down as much as possible
                        javaScriptEnabled={false}
                        allowFileAccess={false}
                        allowFileAccessFromFileURLs={false}
                        allowsAirPlayForMediaPlayback={false}
                        allowsInlineMediaPlayback={false}
                        allowUniversalAccessFromFileURLs={false}
                        incognito={true}
                        // This for that hack to force the webview to rerender when the content process dies we mentioned earlier
                        onContentProcessDidTerminate={rerenderWebview}
                        onRenderProcessGone={rerenderWebview}
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
