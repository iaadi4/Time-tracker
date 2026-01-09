import { Settings } from "lucide-react";

interface SettingsViewProps {
  trackingDelay: number;
  onTrackingDelayChange: (value: number) => void;
  onSave: () => void;
}

export function SettingsView({
  trackingDelay,
  onTrackingDelayChange,
  onSave,
}: SettingsViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-lg font-bold mb-2 text-neutral-200 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-400" />
          Tracking Delay
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          Set how many seconds you need to stay on a website before it starts
          counting towards your tracked time. This helps filter out quick
          visits.
        </p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={1}
            max={100}
            value={trackingDelay}
            onChange={(e) => {
              const val = Math.min(
                100,
                Math.max(1, parseInt(e.target.value) || 1)
              );
              onTrackingDelayChange(val);
            }}
            className="w-24 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-red-500/50 transition-colors"
          />
          <span className="text-neutral-400">seconds</span>
          <button
            onClick={onSave}
            className="bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-400 transition-colors flex items-center gap-2 ml-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
