import { Shield, Plus, Trash2 } from "lucide-react";

interface WhitelistViewProps {
  whitelist: string[];
  newDomain: string;
  onNewDomainChange: (value: string) => void;
  onAdd: (e: React.FormEvent) => void;
  onRemove: (domain: string) => void;
}

export function WhitelistView({
  whitelist,
  newDomain,
  onNewDomainChange,
  onAdd,
  onRemove,
}: WhitelistViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-lg font-bold mb-2 text-neutral-200 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          Excluded Domains
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          Add domains that should not be tracked. Time spent on these sites
          won't count towards your stats.
        </p>
        <form onSubmit={onAdd} className="flex gap-4">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => onNewDomainChange(e.target.value)}
            placeholder="example.com"
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-neutral-600"
          />
          <button
            type="submit"
            disabled={!newDomain}
            className="bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Domain
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {whitelist.map((domain) => (
          <div
            key={domain}
            className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-red-500/30 transition-colors"
          >
            <span className="font-medium text-neutral-300">{domain}</span>
            <button
              onClick={() => onRemove(domain)}
              className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {whitelist.length === 0 && (
          <div className="col-span-full p-8 text-center text-neutral-500 border border-dashed border-white/10 rounded-xl">
            No excluded domains yet.
          </div>
        )}
      </div>
    </div>
  );
}
