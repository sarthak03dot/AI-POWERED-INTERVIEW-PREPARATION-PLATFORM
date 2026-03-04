import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Tooltip,
    Button,
    alpha,
    useTheme,
    Avatar,
    Chip,
    CircularProgress,
    IconButton
} from '@mui/material';
import {
    History as HistoryIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Update as UpdateIcon,
    EmojiEvents as TrophyIcon,
    Assignment as AssignmentIcon,
    Psychology as PracticeIcon,
    ChevronRight as ChevronRightIcon,
    Code as CodeIcon,
    BarChart as BarChartIcon,
    Radar as RadarIcon,
    EmojiEvents as DailyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChartWrapper from '../components/ChartWrapper';
import { statsService } from '../services/statsService';
import type { RootState } from '../redux/store';

interface StatsData {
    total_score?: number;
    challenges_solved?: number;
    total_questions_attempted?: number;
    readiness_score?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    topics?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recent_activity?: any[];
}

const Home: React.FC = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [statsData, setStatsData] = useState<StatsData | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const stats = await statsService.getMyStats();
            setStatsData(stats);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 60000);
        return () => clearInterval(interval);
    }, []);

    const hasTopics = statsData?.topics && statsData.topics.length > 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topicLabels = hasTopics ? statsData.topics!.map((t: any) => t.topic) : ['Fundamentals', 'Logic', 'Architecture', 'Syntax', 'Problem Solving'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accuracyData = hasTopics ? statsData.topics!.map((t: any) => t.accuracy) : [65, 70, 45, 80, 55];

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="animate-fade-in">
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1.5, mb: 1 }}>
                        Welcome Back, <span className="gradient-text">{user?.name || 'Candidate'}</span>
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Here's your interview readiness overview for today.
                    </Typography>
                </Box>
                <Tooltip title="Auto-refreshes every minute">
                    <Chip
                        icon={<UpdateIcon sx={{ fontSize: '1rem !important' }} />}
                        label={`Last updated: ${lastUpdated}`}
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            fontWeight: 600,
                            borderRadius: 2,
                            mb: 0.5
                        }}
                    />
                </Tooltip>
            </Box>

            {/* Quick Stats Grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 3,
                mb: 6
            }}>
                {[
                    { label: 'Total XP', value: statsData?.total_score || 0, icon: <TrophyIcon />, color: 'hsl(245, 82%, 67%)' },
                    { label: 'Solved', value: statsData?.challenges_solved || 0, icon: <AssignmentIcon />, color: 'hsl(271, 91%, 70%)' },
                    { label: 'Attempts', value: statsData?.total_questions_attempted || 0, icon: <HistoryIcon />, color: 'hsl(330, 81%, 60%)' },
                    { label: 'Readiness', value: `${statsData?.readiness_score || 0}%`, icon: <RadarIcon />, color: 'hsl(160, 84%, 39%)' },
                ].map((stat, idx) => (
                    <Box key={idx} sx={{ animation: `fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.1}s forwards`, opacity: 0 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3.5,
                                borderRadius: 4,
                                position: 'relative',
                                overflow: 'hidden',
                                background: mode === 'dark'
                                    ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.5)} 100%)`
                                    : '#ffffff',
                                border: '1px solid',
                                borderColor: alpha(stat.color, 0.2),
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                '&:hover': {
                                    transform: 'translateY(-8px) scale(1.02)',
                                    borderColor: stat.color,
                                    boxShadow: `0 20px 30px -10px ${alpha(stat.color, 0.3)}`,
                                    '& .stat-icon': {
                                        transform: 'scale(1.2) rotate(-10deg)',
                                        opacity: 0.2
                                    }
                                }
                            }}
                        >
                            <Box
                                className="stat-icon"
                                sx={{
                                    position: 'absolute',
                                    top: -15,
                                    right: -15,
                                    opacity: 0.08,
                                    fontSize: 80,
                                    color: stat.color,
                                    transition: 'all 0.4s ease'
                                }}
                            >
                                {stat.icon}
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', mb: 1 }}>
                                {stat.label}
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 900, color: stat.color, letterSpacing: -1 }}>
                                {stat.value}
                            </Typography>
                            <Box sx={{
                                mt: 2,
                                width: '40px',
                                height: '4px',
                                borderRadius: 2,
                                background: `linear-gradient(90deg, ${stat.color}, transparent)`
                            }} />
                        </Paper>
                    </Box>
                ))}
            </Box>

            {/* Main Content Layout */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                gap: 4
            }}>
                {/* Left Column: Analytics */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 4
                    }}>
                        <Box>
                            {hasTopics ? (
                                <ChartWrapper
                                    title="Readiness Radar"
                                    type="radar"
                                    labels={topicLabels}
                                    dataSets={[{
                                        label: 'Current Proficiency',
                                        data: accuracyData,
                                        borderColor: theme.palette.primary.main,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2)
                                    }]}
                                />
                            ) : (
                                <EmptyChart title="Readiness Radar" />
                            )}
                        </Box>
                        <Box>
                            {hasTopics ? (
                                <ChartWrapper
                                    title="Recent Accuracy"
                                    type="bar"
                                    labels={topicLabels}
                                    dataSets={[{
                                        label: 'Accuracy %',
                                        data: accuracyData,
                                        borderColor: theme.palette.secondary.main,
                                        backgroundColor: alpha(theme.palette.secondary.main, 0.5)
                                    }]}
                                />
                            ) : (
                                <EmptyChart title="Recent Accuracy" />
                            )}
                        </Box>
                    </Box>

                    {/* Quick Actions Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 5,
                            background: mode === 'dark'
                                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`
                                : alpha(theme.palette.primary.main, 0.02),
                            border: '1px solid',
                            borderColor: alpha(theme.palette.primary.main, 0.1),
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="h5" fontWeight={900} letterSpacing={-0.5} gutterBottom>Quick Actions</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
                                Jump straight into your daily routine or start a new high-intensity interview challenge.
                            </Typography>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                                gap: 3
                            }}>
                                {[
                                    { label: 'Practice Coding', icon: <CodeIcon />, color: 'primary', path: '/practice' },
                                    { label: 'AI Mock Interview', icon: <PracticeIcon />, color: 'secondary', path: '/mock-interview' },
                                    { label: 'Daily Challenge', icon: <DailyIcon />, color: 'inherit', path: '/daily', variant: 'outlined' }
                                ].map((action, idx) => (
                                    <Button
                                        key={idx}
                                        fullWidth
                                        variant={(action.variant as any) || 'contained'}
                                        color={action.color as any}
                                        onClick={() => navigate(action.path)}
                                        startIcon={action.icon}
                                        sx={{
                                            borderRadius: 3,
                                            py: 2.5,
                                            fontWeight: 800,
                                            fontSize: '0.9rem',
                                            boxShadow: action.variant === 'outlined' ? 'none' : 3
                                        }}
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* Right Column: Activity Feed */}
                <Box>
                    <Paper sx={{ p: 3, minHeight: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BarChartIcon color="primary" /> Recent Activity
                            </Typography>
                        </Box>

                        <List sx={{ flexGrow: 1, px: 0 }}>
                            {!statsData?.recent_activity || statsData.recent_activity.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography variant="body2" color="text.secondary">No recent activity found.</Typography>
                                    <Button sx={{ mt: 2, borderRadius: 2 }} onClick={() => navigate('/practice')}>Start Practicing</Button>
                                </Box>
                            ) : (
                                statsData.recent_activity.map((activity, idx) => (
                                    <ListItem
                                        key={idx}
                                        disableGutters
                                        sx={{
                                            px: 1.5,
                                            py: 2,
                                            borderRadius: 2,
                                            mb: 1,
                                            '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.03) },
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 44 }}>
                                            <Avatar sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: activity.correct ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                                                color: activity.correct ? 'success.main' : 'error.main'
                                            }}>
                                                {activity.correct ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {activity.topic}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(activity.created_at).toLocaleDateString()}
                                                    </Typography>
                                                    <Divider orientation="vertical" flexItem sx={{ height: 10, alignSelf: 'center' }} />
                                                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                                        {activity.type.toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondaryTypographyProps={{ component: 'div' }}
                                        />
                                        <IconButton size="small" sx={{ opacity: 0.5 }}>
                                            <ChevronRightIcon />
                                        </IconButton>
                                    </ListItem>
                                ))
                            )}
                        </List>

                        <Button
                            sx={{ mt: 2, borderRadius: 2 }}
                            onClick={() => navigate('/history')}
                            endIcon={<ChevronRightIcon />}
                        >
                            View Full History
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

const EmptyChart: React.FC<{ title: string }> = ({ title }) => {
    const theme = useTheme();
    return (
        <Paper elevation={0} sx={{
            p: 4,
            height: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.text.primary, 0.02),
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2
        }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, opacity: 0.5 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">No performance data yet.</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>Start a practice session to see analytics.</Typography>
        </Paper>
    );
};

export default Home;
