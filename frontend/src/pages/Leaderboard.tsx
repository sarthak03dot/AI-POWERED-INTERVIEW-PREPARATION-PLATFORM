import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Avatar, CircularProgress, useTheme, alpha
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { statsService } from '../services/statsService';

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await statsService.getLeaderboard();
                setLeaderboard(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, margin: '0 auto', px: { xs: 2, md: 0 } }} className="animate-fade-in">
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1.5, mb: 1.5, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    Global <span className="gradient-text">Leaderboard</span>
                    <Box sx={{
                        animation: 'float 3s ease-in-out infinite',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <TrophyIcon sx={{ fontSize: 48, color: 'hsl(45, 92%, 55%)', filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))' }} />
                    </Box>
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, maxWidth: 600 }}>
                    Compete with the top developers worldwide and showcase your interview readiness skills.
                </Typography>
            </Box>

            <TableContainer
                component={Paper}
                elevation={0}
                className="glass-card"
                sx={{
                    borderRadius: 5,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    background: alpha(theme.palette.background.paper, 0.4),
                    backdropFilter: 'blur(20px)'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: alpha(theme.palette.text.primary, 0.04) }}>
                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.75rem', py: 3 }}>Rank</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.75rem', py: 3 }}>User Profile</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.75rem', py: 3 }}>Challenges</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.75rem', py: 3 }}>Total Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboard.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    transition: 'all 0.3s ease',
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        transform: 'scale(1.002) translateX(4px)',
                                    }
                                }}
                            >
                                <TableCell sx={{ py: 2.5 }}>
                                    <Box sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 900,
                                        fontSize: '0.9rem',
                                        bgcolor: index === 0 ? 'hsl(45, 92%, 55%)' :
                                            index === 1 ? 'hsl(210, 20%, 75%)' :
                                                index === 2 ? 'hsl(30, 80%, 45%)' :
                                                    alpha(theme.palette.text.primary, 0.05),
                                        color: index < 3 ? '#fff' : 'text.secondary',
                                        boxShadow: index < 3 ? `0 4px 12px ${alpha(index === 0 ? '#f59e0b' : '#94a3b8', 0.4)}` : 'none'
                                    }}>
                                        {index + 1}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ py: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                        <Avatar sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                            width: 42,
                                            height: 42,
                                            fontSize: '1rem',
                                            fontWeight: 800,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}>
                                            {row.username[0].toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: 800 }}>{row.username}</Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Active Explorer</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 2.5, fontWeight: 700 }}>{row.challenges_solved}</TableCell>
                                <TableCell align="right" sx={{ py: 2.5 }}>
                                    <Typography sx={{
                                        fontWeight: 900,
                                        color: 'primary.main',
                                        fontSize: '1.1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        gap: 0.5
                                    }}>
                                        {row.total_score.toLocaleString()}
                                        <Typography component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, ml: 0.5 }}>XP</Typography>
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Leaderboard;
