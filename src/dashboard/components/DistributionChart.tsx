import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatDuration } from "../../utils/format";

const COLORS = [
  "#f87171", // Red 400
  "#fb923c", // Orange 400
  "#fbbf24", // Amber 400
  "#f472b6", // Pink 400
  "#e879f9", // Fuchsia 400
  "#c084fc", // Purple 400
  "#fb7185", // Rose 400
  "#fdba74", // Orange 300
];

interface Site {
  domain: string;
  time: number;
  favicon: string;
  [key: string]: string | number;
}

interface DistributionChartProps {
  sites: Site[];
}

export function DistributionChart({ sites }: DistributionChartProps) {
  const chartData = sites.slice(0, 8);

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col relative overflow-hidden h-full">
      <h3 className="text-lg font-bold mb-6 text-neutral-200">Distribution</h3>
      <div className="flex-1 min-h-[250px] relative z-10 flex items-center gap-4">
        <div className="w-2/3 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="time"
                nameKey="domain"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                stroke="none"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(
                  value:
                    | number
                    | string
                    | readonly (number | string)[]
                    | null
                    | undefined
                ) => [formatDuration(Number(value) || 0), "Time"]}
                contentStyle={{
                  backgroundColor: "#09090b",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#e4e4e7" }}
                cursor={{ fill: "transparent" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Side */}
        <div className="w-1/3 max-h-full overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {chartData.map((d, i) => (
            <div key={d.domain} className="flex items-center gap-2 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              ></div>
              <span
                className="truncate text-neutral-300 font-medium"
                title={d.domain}
              >
                {d.domain}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
