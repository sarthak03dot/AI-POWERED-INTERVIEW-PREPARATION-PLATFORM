import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, RadioGroup, FormControlLabel, Radio, FormControl, TextField, useTheme, alpha } from '@mui/material';
import { interviewService } from '../services/interviewService';
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/slices/uiSlice';

interface QuestionPayload {
    question: string;
    options: string[];
}

const DailyChallenge: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [questionData, setQuestionData] = useState<QuestionPayload | null>(null);
    const [answer, setAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ msg?: string, is_correct?: boolean, new_score?: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDaily = async () => {
            try {
                const data = await interviewService.getDailyToday();
                if (data.already_solved) {
                    setResult({
                        msg: data.is_correct ? "Correct! You've already earned points for today." : `Completed. The correct answer was ${data.correct_answer}.`,
                        is_correct: data.is_correct,
                        new_score: undefined // Won't have new score here unless we fetch stats again
                    });
                }
                const rawQuestion = data.question;
                // ... rest of Parsing logic
                const jsonMatch = rawQuestion.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || rawQuestion.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);

                try {
                    const parsed = JSON.parse(jsonMatch ? jsonMatch[1].trim() : rawQuestion);
                    setQuestionData(parsed);
                } catch (e) {
                    setQuestionData({ question: rawQuestion, options: [] });
                }
            } catch (err: unknown) {
                setError((err as Error).message || 'Failed to fetch daily challenge.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDaily();
    }, []);

    const handleSubmit = async () => {
        if (!answer) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const resp = await interviewService.submitDaily(answer);
            setResult(resp);
            dispatch(addNotification({
                title: resp.is_correct ? 'Challenge Conquered!' : 'Challenge Completed',
                message: resp.is_correct ? `Great job! You earned ${resp.new_score ? 'XP' : 'points'}.` : 'Keep practicing to improve your score.',
                type: resp.is_correct ? 'success' : 'info'
            }));
        } catch (err: unknown) {
            setError((err as Error).message || 'Submission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 900, margin: '0 auto', px: { xs: 2, md: 0 } }} className="animate-fade-in">
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1.5, mb: 1.5 }}>
                    Daily <span className="gradient-text">Challenge</span>
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, maxWidth: 600 }}>
                    Keep your streak alive and earn XP by solving today's high-intensity technical assessment.
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

            {!result ? (
                <Paper
                    elevation={0}
                    className="glass-card"
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 5,
                        background: alpha(theme.palette.background.paper, 0.4),
                        border: '1px solid',
                        borderColor: 'divider',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 24, borderRadius: 2, bgcolor: 'primary.main', boxShadow: `0 0 10px ${theme.palette.primary.main}` }} />
                        <Typography variant="h6" fontWeight={800} color="text.primary">Today's Focus</Typography>
                    </Box>
                    <Typography variant="body1" sx={{
                        mb: 5,
                        whiteSpace: 'pre-wrap',
                        p: 4,
                        bgcolor: alpha(theme.palette.text.primary, 0.02),
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'divider',
                        fontWeight: 600,
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        color: 'text.primary',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        {questionData?.question || "No active question found."}
                    </Typography>

                    {questionData?.options && questionData.options.length > 0 ? (
                        <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
                            <RadioGroup
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            >
                                {questionData.options.map((opt, idx) => {
                                    const letter = opt.substring(0, 1).toUpperCase();
                                    const isSelected = answer === letter;
                                    return (
                                        <Paper
                                            key={idx}
                                            elevation={0}
                                            sx={{
                                                mb: 2.5,
                                                p: 0,
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                border: '2px solid',
                                                borderColor: isSelected ? 'primary.main' : alpha(theme.palette.divider, 0.5),
                                                bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    transform: 'translateX(8px)',
                                                    borderColor: isSelected ? 'primary.main' : 'primary.light',
                                                    bgcolor: alpha(theme.palette.primary.main, 0.03)
                                                }
                                            }}
                                            onClick={() => setAnswer(letter)}
                                        >
                                            <FormControlLabel
                                                value={letter}
                                                control={<Radio sx={{
                                                    color: 'divider',
                                                    '&.Mui-checked': { color: 'primary.main' },
                                                    ml: 2, mr: 1
                                                }} />}
                                                label={
                                                    <Typography sx={{
                                                        py: 2.5,
                                                        px: 1,
                                                        fontWeight: isSelected ? 800 : 500,
                                                        fontSize: '1rem'
                                                    }}>
                                                        {opt}
                                                    </Typography>
                                                }
                                                sx={{ m: 0, width: '100%', display: 'flex' }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Paper>
                                    );
                                })}
                            </RadioGroup>
                        </FormControl>
                    ) : (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Type your answer:</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Write your response here..."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={isSubmitting || !answer || !questionData}
                        sx={{
                            py: 2.5,
                            borderRadius: 3,
                            fontWeight: 900,
                            fontSize: '1rem',
                            letterSpacing: 1,
                            mt: 2,
                            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}
                    >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Finalize Submission'}
                    </Button>
                </Paper>
            ) : (
                <Paper
                    elevation={0}
                    className="glass-card"
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 5,
                        background: alpha(theme.palette.background.paper, 0.4),
                        border: '1px solid',
                        borderColor: result.is_correct ? 'success.light' : 'error.light',
                        backdropFilter: 'blur(20px)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: 6,
                        bgcolor: result.is_correct ? 'success.main' : 'error.main'
                    }} />

                    <Typography variant="h4" color={result.is_correct ? "success.main" : "error.main"} gutterBottom fontWeight={900}>
                        {result.is_correct ? "Mission Accomplished!" : "Challenge Completed."}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2, fontWeight: 600, color: 'text.secondary' }}>
                        {result.msg}
                    </Typography>

                    {result.new_score && (
                        <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 4, display: 'inline-block' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                Updated XP: <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', ml: 1 }}>{result.new_score}</Box>
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 6 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => window.location.reload()}
                            sx={{ borderRadius: 3, fontWeight: 800, px: 4 }}
                        >
                            Explore More Challenges
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default DailyChallenge;
