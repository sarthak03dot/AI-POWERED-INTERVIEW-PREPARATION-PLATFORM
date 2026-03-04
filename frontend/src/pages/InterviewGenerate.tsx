import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/slices/uiSlice';
import {
    Box, Typography, Button, Paper, CircularProgress,
    Alert, TextField, Divider, Radio, RadioGroup,
    FormControlLabel,
    Card, CardActionArea, CardContent,
    useTheme, alpha, Skeleton, Fade,
    Avatar
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Psychology as PsychologyIcon,
    Code as CodeIcon,
    QuestionAnswer as QAIcon,
    Architecture as DesignIcon,
    Group as HRIcon,
    Description as ResumeIcon,
    AutoAwesome as APIcon,
    ChevronLeft as BackIcon,
    Send as SendIcon
} from '@mui/icons-material';
import SelectInput from '../components/SelectInput';
import { interviewService } from '../services/interviewService';

type PracticeType = 'mcq' | 'coding' | 'system-design' | 'hr' | 'full-interview' | 'resume' | 'llm';

type GenerateInputs = {
    topic: string;
    difficulty: string;
    type: PracticeType;
    resumeText: string;
    message: string;
};

const InterviewGenerate: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const methods = useForm<GenerateInputs>({
        defaultValues: {
            topic: 'React',
            difficulty: 'medium',
            type: 'mcq',
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Practice State
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [evaluation, setEvaluation] = useState<any | null>(null);

    const selectedType = methods.watch('type');

    const onSubmit = async (data: GenerateInputs) => {
        setIsLoading(true);
        setResult(null);
        setError(null);
        setUserAnswer('');
        setEvaluation(null);

        try {
            let response;
            if (data.type === 'mcq') {
                response = await interviewService.generateMCQ(data.topic, data.difficulty);
            } else if (data.type === 'coding') {
                response = await interviewService.generateCoding(data.topic, data.difficulty);
            } else if (data.type === 'system-design') {
                response = await interviewService.generateSystemDesign();
            } else if (data.type === 'hr') {
                response = await interviewService.generateHR();
            } else if (data.type === 'full-interview') {
                response = await interviewService.generateFullInterview(data.topic, data.difficulty);
            } else if (data.type === 'resume') {
                response = await interviewService.generateResumeQuestion(data.resumeText || 'No resume provided');
            } else if (data.type === 'llm') {
                response = await interviewService.askLLM(data.message || 'Hello');
            }

            if (typeof response === 'string') {
                // Try to extract JSON from markdown or raw text
                const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || response.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
                if (jsonMatch) {
                    try {
                        setResult(JSON.parse(jsonMatch[1].trim()));
                    } catch (e) {
                        setResult(response);
                    }
                } else {
                    setResult(response);
                }
            } else {
                setResult(response);
            }
            dispatch(addNotification({
                title: 'Interview Generated',
                message: `Your ${data.type.toUpperCase()} session is ready.`,
                type: 'success'
            }));
        } catch (err: any) {
            setError(err.message || 'Failed to generate content.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEvaluate = async () => {
        if (!userAnswer) return;
        setIsEvaluating(true);
        try {
            const evalRes = await interviewService.evaluatePractice({
                question_data: result,
                user_answer: userAnswer,
                question_type: selectedType,
                topic: methods.getValues('topic')
            });
            setEvaluation(evalRes);
            dispatch(addNotification({
                title: 'Evaluation Complete',
                message: evalRes.is_correct ? 'Great work! Check your feedback.' : 'Review the feedback for improvements.',
                type: evalRes.is_correct ? 'success' : 'info'
            }));
        } catch (err: any) {
            setError(err.message || "Evaluation failed");
        } finally {
            setIsEvaluating(false);
        }
    };

    const practiceModes: { id: PracticeType; label: string; icon: React.ReactNode; description: string; color: string }[] = [
        { id: 'mcq', label: 'Multiple Choice', icon: <QAIcon />, description: 'Quick technical assessments', color: 'hsl(245, 82%, 67%)' },
        { id: 'coding', label: 'Coding Challenge', icon: <CodeIcon />, description: 'Algorithm & data structures', color: 'hsl(271, 91%, 70%)' },
        { id: 'system-design', label: 'System Design', icon: <DesignIcon />, description: 'Scalability & Architecture', color: 'hsl(330, 81%, 60%)' },
        { id: 'hr', label: 'HR / Behavioral', icon: <HRIcon />, description: 'Soft skills & culture fit', color: 'hsl(160, 84%, 39%)' },
        { id: 'resume', label: 'Resume Review', icon: <ResumeIcon />, description: 'AI analysis of your CV', color: 'hsl(45, 92%, 50%)' },
        { id: 'full-interview', label: 'Full Interview', icon: <PsychologyIcon />, description: 'Comprehensive mock session', color: 'hsl(210, 92%, 55%)' },
        { id: 'llm', label: 'Career Coach', icon: <APIcon />, description: 'Doubts & Career Advice', color: 'hsl(0, 84%, 60%)' },
    ];

    const difficultyOptions = [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
    ];

    const topicOptions = [
        { value: 'React', label: 'React' },
        { value: 'Node.js', label: 'Node.js' },
        { value: 'Python', label: 'Python' },
        { value: 'System Design', label: 'System Design Architecture' },
        { value: 'Data Structures', label: 'Data Structures & Algorithms' },
    ];

    const renderPracticeInterface = () => {
        if (isLoading) {
            return (
                <Box sx={{ mt: 4 }}>
                    <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 2 }} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 4 }} />
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Box>
            );
        }

        if (!result) return null;

        const isMCQ = selectedType === 'mcq' && result.options;
        const isCoding = selectedType === 'coding';

        return (
            <Fade in={true}>
                <Paper className="glass-card" sx={{ p: { xs: 3, md: 5 }, mt: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                        <Button
                            startIcon={<BackIcon />}
                            onClick={() => setResult(null)}
                            variant="text"
                            sx={{ color: 'text.secondary', fontWeight: 700 }}
                        >
                            Change Mode
                        </Button>
                        <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {isMCQ ? "Technical Assessment" : isCoding ? result.title : "Interview Practice"}
                        </Typography>
                    </Box>

                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 500, lineHeight: 1.6, color: 'text.main' }}>
                        {result.question || result.description || (Array.isArray(result.questions) ? result.questions[0] : JSON.stringify(result))}
                    </Typography>

                    <Box sx={{ mb: 5 }}>
                        {isMCQ ? (
                            <RadioGroup value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                                    {result.options.map((option: string, index: number) => (
                                        <Box key={index}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: userAnswer === option ? 'primary.main' : 'divider',
                                                    bgcolor: userAnswer === option ? alpha(theme.palette.primary.main, 0.1) : 'background.paper',
                                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                                                    transition: 'all 0.2s',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setUserAnswer(option)}
                                            >
                                                <FormControlLabel
                                                    value={option}
                                                    control={<Radio sx={{ display: 'none' }} />}
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Box sx={{
                                                                width: 24, height: 24, borderRadius: '50%',
                                                                border: '2px solid',
                                                                borderColor: userAnswer === option ? 'primary.main' : 'text.muted',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                flexShrink: 0
                                                            }}>
                                                                {userAnswer === option && <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />}
                                                            </Box>
                                                            <Typography sx={{ fontWeight: userAnswer === option ? 700 : 500 }}>{option}</Typography>
                                                        </Box>
                                                    }
                                                    sx={{ width: '100%', m: 0 }}
                                                />
                                            </Paper>
                                        </Box>
                                    ))}
                                </Box>
                            </RadioGroup>
                        ) : (
                            <TextField
                                fullWidth
                                multiline
                                rows={isCoding ? 15 : 6}
                                variant="outlined"
                                placeholder={isCoding ? "// Write your solution here..." : "Type your answer and focus on key concepts..."}
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.text.primary, 0.02),
                                        fontFamily: isCoding ? 'monospace' : 'inherit'
                                    }
                                }}
                            />
                        )}
                    </Box>

                    {!evaluation ? (
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleEvaluate}
                            disabled={!userAnswer || isEvaluating}
                            fullWidth
                            endIcon={<SendIcon />}
                            sx={{ py: 2, borderRadius: 2, fontSize: '1.1rem' }}
                        >
                            {isEvaluating ? <CircularProgress size={24} color="inherit" /> : 'Sumbit for AI Feedback'}
                        </Button>
                    ) : (
                        <Fade in={true}>
                            <Box sx={{
                                mt: 3, p: 4, borderRadius: 2,
                                bgcolor: alpha(evaluation.is_correct ? theme.palette.success.main : theme.palette.error.main, 0.05),
                                border: '1px solid',
                                borderColor: alpha(evaluation.is_correct ? theme.palette.success.main : theme.palette.error.main, 0.1)
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                                    <Avatar sx={{
                                        bgcolor: evaluation.is_correct ? 'success.main' : 'error.main',
                                        width: 48, height: 48
                                    }}>
                                        {evaluation.is_correct ? <CheckCircleIcon /> : <CancelIcon />}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: evaluation.is_correct ? 'success.main' : 'error.main' }}>
                                            {evaluation.is_correct ? 'Excellent Response!' : 'Needs Improvement'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>AI ANALYSIS COMPLETE</Typography>
                                    </Box>
                                </Box>

                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>AI FEEDBACK & RECOMMENDATIONS</Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary', lineHeight: 1.7 }}>
                                    {evaluation.feedback}
                                </Typography>

                                {evaluation.score_delta > 0 && (
                                    <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 800 }}>
                                            🏆 ACHIEVEMENTUnlocked: +{evaluation.score_delta} XP
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                                    <Button variant="contained" onClick={() => { setEvaluation(null); setUserAnswer(''); setResult(null); }} sx={{ borderRadius: 2 }}>
                                        Next Question
                                    </Button>
                                    <Button variant="outlined" onClick={() => navigate('/history')} sx={{ borderRadius: 2 }}>
                                        View in History
                                    </Button>
                                </Box>
                            </Box>
                        </Fade>
                    )}
                </Paper>
            </Fade>
        );
    };

    const navigate = (path: string) => window.location.assign(path);

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', px: { xs: 2, md: 0 } }}>
            {!result && (
                <Box className="animate-fade-in">
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1.5, mb: 1 }}>
                            Practice <span className="gradient-text">Hub</span>
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            Select a dedicated mode to start sharpening your skills.
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                        gap: 3
                    }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 800, color: 'text.muted', letterSpacing: 1 }}>SELECT INTERVIEW MODE</Typography>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 2
                            }}>
                                {practiceModes.map((mode, idx) => (
                                    <Box key={mode.id} sx={{ animation: `fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.05}s forwards`, opacity: 0 }}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: 4,
                                                border: '1px solid',
                                                borderColor: selectedType === mode.id ? mode.color : 'divider',
                                                background: selectedType === mode.id
                                                    ? `linear-gradient(135deg, ${alpha(mode.color, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.5)} 100%)`
                                                    : 'background.paper',
                                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                '&:hover': {
                                                    transform: 'translateY(-6px)',
                                                    borderColor: mode.color,
                                                    boxShadow: `0 15px 30px -10px ${alpha(mode.color, 0.2)}`,
                                                    '& .mode-icon': {
                                                        transform: 'scale(1.1) rotate(5deg)',
                                                        opacity: 1
                                                    }
                                                }
                                            }}
                                        >
                                            <CardActionArea onClick={() => methods.setValue('type', mode.id)} sx={{ p: 1.5 }}>
                                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                    <Avatar
                                                        className="mode-icon"
                                                        sx={{
                                                            bgcolor: alpha(mode.color, 0.1),
                                                            color: mode.color,
                                                            width: 60, height: 60,
                                                            fontSize: '2rem',
                                                            transition: 'all 0.4s ease',
                                                            boxShadow: selectedType === mode.id ? `0 0 20px ${alpha(mode.color, 0.3)}` : 'none'
                                                        }}
                                                    >
                                                        {mode.icon}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 800, color: selectedType === mode.id ? mode.color : 'text.primary' }}>{mode.label}</Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{mode.description}</Typography>
                                                    </Box>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 900, color: 'primary.main', letterSpacing: 1.5, textTransform: 'uppercase' }}>CONFIGURATION</Typography>
                            <Paper
                                elevation={0}
                                className="glass-card"
                                sx={{
                                    p: 4,
                                    borderRadius: 6,
                                    background: theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.background.paper, 0.4)
                                        : alpha(theme.palette.background.paper, 0.8),
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.divider, 0.1),
                                    backdropFilter: 'blur(20px)'
                                }}
                            >
                                <FormProvider {...methods}>
                                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                                        {['mcq', 'coding', 'system-design', 'hr', 'full-interview'].includes(selectedType) ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <SelectInput name="topic" label="Focus Topic" options={topicOptions} />
                                                <SelectInput name="difficulty" label="Target Difficulty" options={difficultyOptions} />
                                            </Box>
                                        ) : selectedType === 'resume' ? (
                                            <TextField
                                                fullWidth multiline rows={8}
                                                label="Paste Resume Text"
                                                variant="filled"
                                                {...methods.register('resumeText')}
                                                sx={{
                                                    '& .MuiFilledInput-root': {
                                                        borderRadius: 4,
                                                        backgroundColor: alpha(theme.palette.text.primary, 0.03)
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <TextField
                                                fullWidth multiline rows={6}
                                                label="How can I help you?"
                                                placeholder="I need help with salary negotiation..."
                                                variant="filled"
                                                {...methods.register('message')}
                                                sx={{
                                                    '& .MuiFilledInput-root': {
                                                        borderRadius: 4,
                                                        backgroundColor: alpha(theme.palette.text.primary, 0.03)
                                                    }
                                                }}
                                            />
                                        )}
                                        <Box sx={{ mt: 5, position: 'relative' }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                sx={{
                                                    py: 2.5,
                                                    borderRadius: 4,
                                                    fontWeight: 900,
                                                    fontSize: '1rem',
                                                    letterSpacing: 1,
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                                    boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                    '&:hover': {
                                                        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.5)}`,
                                                        transform: 'translateY(-2px)'
                                                    }
                                                }}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'INITIALIZE PRACTICE'}
                                            </Button>
                                        </Box>
                                    </form>
                                </FormProvider>
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            )}

            {error && <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

            {result && renderPracticeInterface()}
        </Box>
    );
};

export default InterviewGenerate;
