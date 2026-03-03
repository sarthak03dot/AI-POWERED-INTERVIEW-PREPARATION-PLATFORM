import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { interviewService } from '../services/interviewService';

const History: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [historyInfo, setHistoryInfo] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Hitting the /all route
                const data = await interviewService.getHistory();
                setHistoryInfo(data || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch history');
            } finally {
                setIsLoading(false);
            }
        }
        fetchHistory();
    }, []);

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 1000, margin: '0 auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Interview History
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

            {!historyInfo || historyInfo.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">No interview history found yet.</Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {historyInfo.map((item, index) => (
                        <Paper key={index} sx={{ p: 3 }}>
                            <Typography variant="h6" color="primary">{item.topic || "Unknown Topic"}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {new Date(item.date).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#f8fafc', p: 2, borderRadius: 2 }}>
                                <Typography variant="body2" fontWeight="bold">Score:</Typography>
                                <Typography variant="body2" color={item.score > 70 ? 'success.main' : 'warning.main'} fontWeight="bold">
                                    {item.score}%
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default History;
