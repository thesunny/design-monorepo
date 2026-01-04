"use client";

import Slider, { SliderProps } from "@mui/material/Slider";

const sliderSx = {
  color: '#5b3a70',
  height: 6,
  maxWidth: 400,
  padding: '2px 0',
  width: 'calc(100% - 16px)',
  '& .MuiSlider-thumb': {
    width: 14,
    height: 14,
    '&::before': {
      content: '""',
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: '#fff',
    },
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 6px rgba(91,58,112,0.2)',
    },
  },
  '& .MuiSlider-markLabel': {
    fontSize: '12px',
    color: '#737373',
    top: '14px',
  },
  '& .MuiSlider-rail': {
    backgroundColor: '#e5e5e5',
    opacity: 1,
  },
  '& .MuiSlider-mark': {
    backgroundColor: 'white',
  },
  '&.Mui-disabled': {
    color: '#d4d4d4',
  },
};

export function StyledSlider(props: SliderProps) {
  return <Slider sx={sliderSx} size="small" {...props} />;
}
