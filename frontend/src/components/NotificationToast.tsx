import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, AlertTitle, Slide, type SlideProps } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { markAsRead } from '../redux/slices/uiSlice';

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="left" />;
}

const NotificationToast: React.FC = () => {
    const dispatch = useDispatch();
    const { notifications } = useSelector((state: RootState) => state.ui);
    const [open, setOpen] = useState(false);
    const [currentNotif, setCurrentNotif] = useState<any>(null);

    useEffect(() => {
        // Find the latest unread notification
        const latestUnread = notifications.find(n => !n.read);
        if (latestUnread && (!currentNotif || latestUnread.id !== currentNotif.id)) {
            setCurrentNotif(latestUnread);
            setOpen(true);
        }
    }, [notifications, currentNotif]);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        if (currentNotif) {
            dispatch(markAsRead(currentNotif.id));
        }
    };

    if (!currentNotif) return null;

    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            TransitionComponent={SlideTransition}
            sx={{ mt: 7 }} // Adjust for AppBar height
        >
            <Alert
                onClose={handleClose}
                severity={currentNotif.type || 'info'}
                variant="filled"
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    '& .MuiAlert-message': { fontWeight: 500 }
                }}
            >
                <AlertTitle sx={{ fontWeight: 800 }}>{currentNotif.title}</AlertTitle>
                {currentNotif.message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationToast;
