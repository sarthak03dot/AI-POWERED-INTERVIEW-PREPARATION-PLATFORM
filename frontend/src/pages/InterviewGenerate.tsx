import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import SelectInput from '../components/SelectInput';
import { interviewService } from '../services/interviewService';

type GenerateInputs = {
    topic: string;
    difficulty: string;
    type: 'mcq' | 'coding' | 'system-design' | 'hr';
};

const InterviewGenerate: React.FC = () => {
    const methods = useForm<GenerateInputs>({
        defaultValues: {
            topic: 'React',
            difficulty: 'medium',
            type: 'mcq',
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: GenerateInputs) => {
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            let response;
            if (data.type === 'mcq') {
                response = await interviewService.generateMCQ(data.topic, data.difficulty);
            } else if (data.type === 'coding') {
                response = await interviewService.generateCoding(data.topic, data.difficulty);
            } else if (data.type === 'system-design') {
                response = await interviewService.generateSystemDesign();
            } else {
                response = await interviewService.generateHR();
            }
            setResult(response);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to generate interview question.');
        } finally {
            setIsLoading(false);
        }
    };

    const typeOptions = [
        { value: 'mcq', label: 'Multiple Choice' },
        { value: 'coding', label: 'Coding Challenge' },
        { value: 'system-design', label: 'System Design' },
        { value: 'hr', label: 'HR / Behavioral' },
    ];

    const difficultyOptions = [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
    ];

    const topicOptions = [
        { value: 'React', label: 'React' },
        { value: 'Python', label: 'Python' },
        { value: 'System Design', label: 'System Design Architecture' },
        { value: 'Data Structures', label: 'Data Structures & Algorithms' },
    ];

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Practice Interviews
            </Typography>

            <Paper sx={{ p: 4, mb: 4 }}>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                            <SelectInput name="type" label="Question Type" options={typeOptions} />
                            <SelectInput name="difficulty" label="Difficulty" options={difficultyOptions} />
                            <Box sx={{ gridColumn: { md: 'span 2' } }}>
                                <SelectInput name="topic" label="Topic" options={topicOptions} />
                            </Box>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ mt: 3 }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Question'}
                        </Button>
                    </form>
                </FormProvider>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

            {result && (
                <Paper sx={{ p: 4, backgroundColor: '#f8fafc', whiteSpace: 'pre-wrap' }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Result</Typography>
                    <Typography variant="body1" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.9rem', overflowX: 'auto' }}>
                        {result}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default InterviewGenerate;
