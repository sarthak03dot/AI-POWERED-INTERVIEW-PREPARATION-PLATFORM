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
    RadialLinearScale,
    Filler,
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { Box, Typography, Paper, useTheme, alpha } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

interface ChartWrapperProps {
    title: string;
    type: 'line' | 'bar' | 'radar';
    labels: string[];
    dataSets: {
        label: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string;
    }[];
    height?: number | string;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, type, labels, dataSets, height = 350 }) => {
    const theme = useTheme();

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: theme.palette.text.secondary,
                    font: {
                        family: 'Inter',
                        weight: 600,
                    },
                    padding: 20,
                    usePointStyle: true,
                },
            },
            tooltip: {
                backgroundColor: theme.palette.background.paper,
                titleColor: theme.palette.text.primary,
                bodyColor: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
            },
        },
        scales: type !== 'radar' ? {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: theme.palette.text.secondary,
                    font: { family: 'Inter' }
                }
            },
            y: {
                grid: {
                    color: theme.palette.divider,
                },
                ticks: {
                    color: theme.palette.text.secondary,
                    font: { family: 'Inter' }
                }
            },
        } : {
            r: {
                angleLines: {
                    color: theme.palette.divider,
                },
                grid: {
                    color: theme.palette.divider,
                },
                pointLabels: {
                    color: theme.palette.text.secondary,
                    font: {
                        family: 'Outfit',
                        size: 11,
                        weight: 600,
                    }
                },
                ticks: {
                    display: false,
                }
            }
        },
    };

    const data = {
        labels,
        datasets: dataSets.map(ds => ({
            ...ds,
            borderColor: ds.borderColor || theme.palette.primary.main,
            backgroundColor: ds.backgroundColor || alpha(ds.borderColor || theme.palette.primary.main, 0.2),
            tension: 0.4,
            pointBackgroundColor: ds.borderColor || theme.palette.primary.main,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: ds.borderColor || theme.palette.primary.main,
            borderRadius: type === 'bar' ? 8 : undefined,
            borderWidth: 2,
            fill: true,
        })),
    };

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, letterSpacing: -0.5, mb: 3 }}>
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
                {type === 'line' && <Line options={options} data={data} />}
                {type === 'bar' && <Bar options={options} data={data} />}
                {type === 'radar' && <Radar options={options} data={data} />}
            </Box>
        </Paper>
    );
};

export default ChartWrapper;
