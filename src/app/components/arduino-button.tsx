interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function ArduinoButton({ label, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center gap-1"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      <div
        className="relative flex items-center justify-center w-8.5 h-8.5 rounded-full 
  bg-linear-to-br from-orange-400 to-orange-600
  shadow-[0_4px_0_#9a3412,0_5px_2px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)]
  border-2 border-orange-700
  transition-all duration-75 active:translate-y-0.75"
      />

      <div
        className="mt-1 px-2 py-0.5 rounded-sm text-xs uppercase tracking-widest 
  bg-orange-950 text-orange-300 border border-orange-700
  font-mono
  shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]
  transition-all duration-75 active:translate-y-0.75"
      >
        <p className="font-bitcount">{label}</p>
      </div>
    </button>
  );
}
