import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export function FullPageSpinner() {
    return (
        <View style={styles.fullPageSpinnerView}>
            <ActivityIndicator animating={true} size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    fullPageSpinnerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
