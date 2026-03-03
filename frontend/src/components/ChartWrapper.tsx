import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ChartWrapperProps {
    title: string;
    type: 'line' | 'bar';
    labels: string[];
    dataSets: {
        label: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string;
    }[];
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, type, labels, dataSets }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
            },
        },
    };

    const data = {
        labels,
        datasets: dataSets.map(ds => ({
            ...ds,
            borderColor: ds.borderColor || '#6366f1',
            backgroundColor: ds.backgroundColor || 'rgba(99, 102, 241, 0.5)',
            tension: 0.4,
            borderRadius: type === 'bar' ? 4 : undefined,
        })),
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="text.secondary">
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
                {type === 'line' ? <Line options={options} data={data} /> : <Bar options={options} data={data} />}
            </Box>
        </Paper>
    );
};

export default ChartWrapper;
