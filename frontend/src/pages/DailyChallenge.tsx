import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField } from '@mui/material';
import { interviewService } from '../services/interviewService';

const DailyChallenge: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [question, setQuestion] = useState<string | null>(null);
    const [answer, setAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDaily = async () => {
            try {
                const data = await interviewService.getDailyToday();
                setQuestion(data.question);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch daily challenge.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDaily();
    }, []);

    const handleSubmit = async () => {
        if (!answer.trim()) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const resp = await interviewService.submitDaily(answer);
            setResult(resp);
        } catch (err: any) {
            setError(err.message || 'Submission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Daily Challenge
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

            {!result ? (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">Today's Question:</Typography>
                    <Typography variant="body1" sx={{ mb: 4, whiteSpace: 'pre-wrap', p: 2, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                        {question || "No active question found."}
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        variant="outlined"
                        label="Your Answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={isSubmitting || !answer.trim() || !question}
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Submit Answer'}
                    </Button>
                </Paper>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main" gutterBottom fontWeight="bold">
                        {result.msg || "Submitted Successfully!"}
                    </Typography>
                    {result.new_score && (
                        <Typography variant="h6">
                            Your New Score: <Box component="span" fontWeight="bold">{result.new_score}</Box>
                        </Typography>
                    )}
                </Paper>
            )}
        </Box>
    );
};

export default DailyChallenge;
