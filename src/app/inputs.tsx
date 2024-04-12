import React from "react";

export function Input({
  name,
  onChange,
  value,
  onNameClick,
}: {
  name: string;
  onChange: (num: number) => void;
  value: number;
  onNameClick?: () => void;
}) {
  return (
    <label>
      <div onClick={onNameClick}>{name}</div>
      <div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
          min={0}
          max={99}
        />
      </div>
    </label>
  );
}
