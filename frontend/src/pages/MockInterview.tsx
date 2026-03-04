import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, Paper, TextField, Button,
    Avatar, CircularProgress,
    MenuItem, Select, InputLabel, FormControl,
    alpha, useTheme, Divider, IconButton, Fade, Chip
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/slices/uiSlice';
import {
    Send as SendIcon,
    Psychology as PsychologyIcon,
    Face as FaceIcon,
    NavigateBefore as BackIcon,
    AutoAwesome as PersonaIcon,
    AccessTime as TimeIcon,
    AssignmentTurnedIn as ReviewIcon
} from '@mui/icons-material';
import { mockInterviewService } from '../services/mockInterviewService';

const MockInterview: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [session, setSession] = useState<any>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [topic, setTopic] = useState('React');
    const [difficulty, setDifficulty] = useState('Medium');
    const [view, setView] = useState<'setup' | 'chat'>('setup');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [session?.history]);

    const handleStart = async () => {
        setIsLoading(true);
        try {
            const newSession = await mockInterviewService.startSession(topic, difficulty);
            setSession(newSession);
            setView('chat');
            dispatch(addNotification({
                title: 'Mock Interview Started',
                message: `AI Interviewer is ready for your ${topic} session.`,
                type: 'info'
            }));
        } catch (err) {
            console.error("Failed to start session", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setIsLoading(true);

        try {
            const updatedSession = await mockInterviewService.sendMessage(session.id, userMsg);
            setSession(updatedSession);
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (view === 'setup') {
        return (
            <Box sx={{ maxWidth: 800, margin: '0 auto', mt: 4 }} className="animate-fade-in">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1.5, mb: 1.5 }}>
                        AI <span className="gradient-text">Mock Interview</span>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500, maxWidth: 600, mx: 'auto' }}>
                        Simulate a rigorous, state-of-the-art interview experience. Our AI will analyze your communication, technical depth, and soft skills in real-time.
                    </Typography>
                </Box>

                <Paper className="glass-card" sx={{ p: { xs: 3, md: 5 } }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 4
                    }}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, letterSpacing: 1 }}>EXPERIENCE SETUP</Typography>
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Target Topic</InputLabel>
                                    <Select
                                        value={topic}
                                        label="Target Topic"
                                        onChange={(e: any) => setTopic(e.target.value)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="React">Frontend (React/Next.js)</MenuItem>
                                        <MenuItem value="Node.js">Backend (Node/Express)</MenuItem>
                                        <MenuItem value="Python">Python & AI</MenuItem>
                                        <MenuItem value="System Design">System Design & Scalability</MenuItem>
                                        <MenuItem value="Data Structures">CS Fundamentals (DSA)</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Interview Intensity</InputLabel>
                                    <Select
                                        value={difficulty}
                                        label="Interview Intensity"
                                        onChange={(e: any) => setDifficulty(e.target.value)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="Easy">Standard / Entry Level</MenuItem>
                                        <MenuItem value="Medium">Mid-Senior / Technical Deep-Dive</MenuItem>
                                        <MenuItem value="Hard">Architect / FAANG+ Intensity</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleStart}
                                disabled={isLoading}
                                sx={{ py: 2, borderRadius: 2, fontWeight: 800, fontSize: '1.1rem' }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Begin Session'}
                            </Button>
                        </Box>
                        <Box>
                            <Box sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                p: 3,
                                borderRadius: 2,
                                height: '100%',
                                border: '1px solid',
                                borderColor: alpha(theme.palette.primary.main, 0.1)
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>WHAT TO EXPECT</Typography>
                                {[
                                    { icon: <PersonaIcon />, text: 'Dynamic AI Persona with follow-up questions.' },
                                    { icon: <TimeIcon />, text: 'Real-time performance metrics tracking.' },
                                    { icon: <ReviewIcon />, text: 'Comprehensive end-of-session evaluation card.' },
                                ].map((item, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '1rem' }}>{item.icon}</Avatar>
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>{item.text}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        );
    }

    const goToDashboard = () => window.location.assign('/');

    return (
        <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => setView('setup')} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <BackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{topic} Interview Session</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>INTENSITY: {difficulty.toUpperCase()}</Typography>
                    </Box>
                </Box>
                <Chip
                    label={session.status === 'completed' ? 'FINISHED' : 'LIVE SESSION'}
                    color={session.status === 'completed' ? 'default' : 'primary'}
                    sx={{ fontWeight: 800, borderRadius: 2 }}
                />
            </Box>

            <Paper className="glass-card" sx={{ flexGrow: 1, mb: 3, overflowY: 'auto', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {session.history.map((msg: any, idx: number) => (
                    <Fade in={true} key={idx} timeout={500}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            gap: 2,
                            mb: 1
                        }}>
                            <Avatar sx={{
                                bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main',
                                width: 40, height: 40,
                                boxShadow: `0 4px 12px ${alpha(msg.role === 'user' ? theme.palette.primary.main : theme.palette.secondary.main, 0.4)}`
                            }}>
                                {msg.role === 'user' ? <FaceIcon /> : <PsychologyIcon />}
                            </Avatar>
                            <Box sx={{
                                maxWidth: '75%',
                                p: 2.5,
                                borderRadius: msg.role === 'user' ? '24px 4px 24px 24px' : '4px 24px 24px 24px', // Preserving chat bubble specific borderRadius
                                bgcolor: msg.role === 'user' ? 'primary.main' : 'rgba(255,255,255,0.05)',
                                color: msg.role === 'user' ? 'white' : 'text.main',
                                border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                position: 'relative'
                            }}>
                                <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6 }}>{msg.content}</Typography>
                                <Typography variant="caption" sx={{
                                    position: 'absolute',
                                    bottom: -20,
                                    [msg.role === 'user' ? 'right' : 'left']: 0,
                                    color: 'text.secondary',
                                    fontWeight: 700
                                }}>
                                    {msg.role === 'user' ? 'CANDIDATE' : 'AI INTERVIEWER'}
                                </Typography>
                            </Box>
                        </Box>
                    </Fade>
                ))}

                {isLoading && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}><PsychologyIcon /></Avatar>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Box sx={{ width: 8, height: 8, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                                <Box sx={{ width: 8, height: 8, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                                <Box sx={{ width: 8, height: 8, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                            </Box>
                        </Box>
                    </Box>
                )}

                {session.status === 'completed' && session.feedback && (
                    <Fade in={true} timeout={1000}>
                        <Box sx={{
                            mt: 4,
                            border: '1px solid',
                            borderColor: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.03),
                            borderRadius: 2,
                            mb: 3,
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ p: 4, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Session Evaluation Summary</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>TRANSCRIPT ANALYSIS COMPLETE</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="h2" sx={{ fontWeight: 900, color: 'primary.main', mb: -1 }}>{session.feedback.score}%</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>CANDIDATE SCORE</Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 4, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

                                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'text.main' }}>AI INTERVIEWER FEEDBACK</Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1.05rem' }}>
                                    {session.feedback.feedback}
                                </Typography>

                                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                                    <Button variant="contained" onClick={() => setView('setup')} sx={{ borderRadius: 2 }}>New Interview Session</Button>
                                    <Button variant="outlined" onClick={goToDashboard} sx={{ borderRadius: 2 }}>Back to Dashboard</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                )}

                <div ref={messagesEndRef} />
            </Paper>

            {session.status !== 'completed' && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        placeholder="Provide your detailed response..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                        sx={{
                            bgcolor: 'background.paper',
                            borderRadius: 4,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 4,
                                height: 56
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        sx={{
                            height: 56,
                            width: 56,
                            minWidth: 56,
                            borderRadius: '50%',
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.4)}`
                        }}
                    >
                        <SendIcon />
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default MockInterview;
