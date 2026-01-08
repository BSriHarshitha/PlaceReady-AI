import React from 'react';
import CountUp from 'react-countup';
import { Typography } from '@mui/material';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  sx?: any;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2,
  prefix = '',
  suffix = '%',
  variant = 'h3',
  sx
}) => {
  return (
    <Typography variant={variant} sx={sx}>
      {prefix}
      <CountUp
        end={end}
        duration={duration}
        decimals={0}
        useEasing
        separator=","
      />
      {suffix}
    </Typography>
  );
};

