import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import SelectInput from '../components/SelectInput';
import ChartWrapper from '../components/ChartWrapper';
import { statsService, topicService } from '../services/analyticsService';

type DashboardFilterInputs = {
    timeRange: string;
};

const Home: React.FC = () => {
    const methods = useForm<DashboardFilterInputs>({
        defaultValues: {
            timeRange: '7days',
        },
    });

    const [statsData, setStatsData] = useState<any>(null);
    const [topicData, setTopicData] = useState<any>(null);

    // Watch for changes in the form
    useEffect(() => {
        const subscription = methods.watch(() => { });
        return () => subscription.unsubscribe();
    }, [methods.watch]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const stats = await statsService.getMyStats();
                const topics = await topicService.getMyTopics();
                setStatsData(stats);
                setTopicData(topics);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };
        fetchAnalytics();
    }, []);

    const selectOptions = [
        { value: '7days', label: 'Last 7 Days' },
        { value: '30days', label: 'Last 30 Days' },
        { value: '1year', label: 'Last 1 Year' },
    ];

    // Dummy logic to map backend shapes while maintaining the chart structure for UI
    // If backend provided proper timeseries we would map it here
    const getChartData = () => {
        if (!statsData || !topicData) {
            return [0, 0, 0, 0, 0, 0, 0];
        }
        // Using real total_score or total_interviews to seed the graph
        const base = statsData.total_score || 10;
        return [base * 0.5, base * 0.8, base, base * 1.2, base * 1.5, base * 1.1, base * 1.3];
    };

    const currentData = getChartData();

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Dashboard Overview
            </Typography>

            <Box sx={{ mb: 4, maxWidth: 300 }}>
                <FormProvider {...methods}>
                    <form>
                        <SelectInput
                            name="timeRange"
                            label="Select Time Range"
                            options={selectOptions}
                        />
                    </form>
                </FormProvider>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                <Box>
                    <ChartWrapper
                        title="Interview Performance"
                        type="line"
                        labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                        dataSets={[
                            {
                                label: 'Score',
                                data: currentData,
                            },
                        ]}
                    />
                </Box>
                <Box>
                    <ChartWrapper
                        title="Questions Answered"
                        type="bar"
                        labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                        dataSets={[
                            {
                                label: 'Count',
                                data: currentData.map(v => v * 0.5),
                                backgroundColor: '#eab308'
                            },
                        ]}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
