"use client";

import { ReactNode } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { StyledSlider } from "./StyledSlider";

type LabeledSliderProps = {
  label: string;
  value: number;
  defaultValue: number;
  onChange: (value: number) => void;
  onChangeCommitted?: (value: number) => void;
  min: number;
  max: number;
  step: number;
  marks: { value: number; label: string }[];
  disabled?: boolean;
  className?: string;
  suffix?: ReactNode;
};

export function LabeledSlider({
  label,
  value,
  defaultValue,
  onChange,
  onChangeCommitted,
  min,
  max,
  step,
  marks,
  disabled,
  className,
  suffix,
}: LabeledSliderProps) {
  const isDefault = value === defaultValue;

  return (
    <div className={`flex items-start ${className ?? ""}`}>
      <span className="text-[11px] text-neutral-500 uppercase w-20 shrink-0 mt-[2px] leading-tight text-right pr-4">
        {label}
      </span>
      <div className="flex items-start gap-2 flex-1">
        <StyledSlider
          className="flex-1 mt-1"
          value={value}
          onChange={(_, v) => onChange(v as number)}
          onChangeCommitted={
            onChangeCommitted ? (_, v) => onChangeCommitted(v as number) : undefined
          }
          min={min}
          max={max}
          step={step}
          marks={marks}
          disabled={disabled}
        />
        <button
          onClick={() => onChange(defaultValue)}
          className={`ml-2 -mt-1 p-1 rounded transition-colors ${
            isDefault || disabled
              ? "text-neutral-300 cursor-default"
              : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 cursor-pointer"
          }`}
          disabled={isDefault || disabled}
          title="Reset to default"
        >
          <IconRefresh size={18} />
        </button>
        {suffix}
      </div>
    </div>
  );
}
