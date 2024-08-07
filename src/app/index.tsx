import { Link } from 'expo-router';
import { Button, Text } from 'react-native-paper';

import { CenterPage, PageNoScroll } from '../components/Page';
import { useSettings } from '../components/providers/SettingsProvider';
import { TicketRenderer } from '../components/TicketRenderer';
import styles from '../constants/styles';
import { useValidTicket } from '../services/workflows';

const TicketView = () => {
    const { appSettings, loginStatus } = useSettings();
    const validTicketResult = useValidTicket(appSettings);

    if (loginStatus !== true) {
        return (
            <CenterPage>
                <Text style={styles.mediumMarginBottom}>Bitte einloggen um Tickets anzuzeigen</Text>
                <Link href="/settings" asChild>
                    <Button mode="contained">Zu den Einstellungen</Button>
                </Link>
            </CenterPage>
        );
    }
    if (typeof validTicketResult === 'string') {
        return (
            <CenterPage>
                <Text style={styles.mediumMarginBottom}>{validTicketResult}</Text>
                <Link href="/settings" asChild>
                    <Button mode="contained">Zu den Einstellungen</Button>
                </Link>
            </CenterPage>
        );
    }

    const [_validTicketId, validTicket] = validTicketResult;

    return (
        <PageNoScroll>
            <TicketRenderer ticket={validTicket} />
        </PageNoScroll>
    );
};

export default TicketView;
