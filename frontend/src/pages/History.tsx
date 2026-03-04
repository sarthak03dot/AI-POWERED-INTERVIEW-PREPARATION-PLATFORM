import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, CircularProgress, Alert, Chip, Divider,
    Tabs, Tab, Pagination, useTheme, alpha,
    Avatar
} from '@mui/material';
import {
    History as HistoryIcon,
    ChevronRight as ChevronRightIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { interviewService } from '../services/interviewService';

interface HistoryItem {
    id: number;
    topic: string;
    question_type: string;
    question: string;
    answer: string;
    correct_answer: string;
    created_at: string;
}

const History: React.FC = () => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [historyInfo, setHistoryInfo] = useState<HistoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Filters and Pagination
    const [selectedTab, setSelectedTab] = useState<string>('All');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const LIMIT = 10;

    const topics = ['All', 'React', 'Python', 'System Design', 'Data Structures'];

    const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (selectedTab === 'All') {
                const response = await interviewService.getPaginatedHistory(page, LIMIT);
                setHistoryInfo(response?.data || []);
                setTotalPages(response?.total_pages || 1);
            } else {
                const data = await interviewService.getHistoryByTopic(selectedTab);
                setHistoryInfo(data || []);
                setTotalPages(1);
            }
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to fetch history');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [page, selectedTab]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
        setPage(1);
    };

    return (
        <Box sx={{ maxWidth: 1100, margin: '0 auto', px: { xs: 2, md: 0 } }} className="animate-fade-in">
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1.5, mb: 1.5 }}>
                    Interview <span className="gradient-text">History</span>
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, maxWidth: 600 }}>
                    Track your growth and review detailed AI feedback on all your previous sessions.
                </Typography>
            </Box>

            <Box sx={{ mb: 6 }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTabs-indicator': { height: 4, borderRadius: '4px 4px 0 0' },
                        '& .MuiTab-root': {
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            minHeight: 60,
                            color: 'text.secondary',
                            '&.Mui-selected': { color: 'primary.main' }
                        }
                    }}
                >
                    {topics.map((topic) => (
                        <Tab key={topic} label={topic} value={topic} />
                    ))}
                </Tabs>
                <Divider sx={{ mt: -0.1 }} />
            </Box>

            {error && <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
            ) : !historyInfo || historyInfo.length === 0 ? (
                <Paper className="glass-card" sx={{ p: 8, textAlign: 'center', mt: 4, borderRadius: 5 }}>
                    <HistoryIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h5" color="text.primary" fontWeight={800} gutterBottom>
                        No history found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Your journey is just beginning. Start a practice session to see your progress here!
                    </Typography>
                </Paper>
            ) : (
                <Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3.5 }}>
                        {historyInfo.map((item, index) => {
                            const isCorrect = item.correct_answer &&
                                item.answer?.trim().toLowerCase() === item.correct_answer?.trim().toLowerCase();

                            return (
                                <Paper
                                    key={index}
                                    elevation={0}
                                    className="glass-card"
                                    sx={{
                                        p: 3.5,
                                        borderRadius: 5,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        background: alpha(theme.palette.background.paper, 0.4),
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.divider, 0.1),
                                        '&:hover': {
                                            transform: 'translateY(-6px)',
                                            borderColor: alpha(theme.palette.primary.main, 0.3),
                                            boxShadow: `0 20px 40px -10px ${alpha(theme.palette.background.default, 0.5)}`
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: -0.5 }}>
                                                {item.topic || "General Concepts"}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                {new Date(item.created_at).toLocaleString('en-US', {
                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={item.question_type.toUpperCase()}
                                            size="small"
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: '0.65rem',
                                                borderRadius: 1.5,
                                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                color: 'secondary.main',
                                                border: '1px solid',
                                                borderColor: alpha(theme.palette.secondary.main, 0.2),
                                                letterSpacing: 1
                                            }}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 2.5, opacity: 0.5 }} />

                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        bgcolor: isCorrect ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.text.primary, 0.03),
                                        p: 2.5,
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: isCorrect ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.divider, 0.1)
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: isCorrect ? 'success.main' : 'text.disabled',
                                                color: '#fff'
                                            }}>
                                                {isCorrect ? <CheckCircleIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                                            </Avatar>
                                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                                {isCorrect ? 'Accurate Response' : 'Review Completed'}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: 900,
                                                color: isCorrect ? 'success.main' : 'text.secondary',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            {isCorrect ? 'Status: Correct' : 'Status: Captured'}
                                        </Typography>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Box>

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_e, val) => setPage(val)}
                                color="primary"
                                size="large"
                                sx={{
                                    '& .MuiPaginationItem-root': { fontWeight: 800, borderRadius: 2 }
                                }}
                            />
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default History;

