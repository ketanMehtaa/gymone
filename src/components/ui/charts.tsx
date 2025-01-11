interface ChartData {
  name: string;
  value: number;
}

interface ChartProps {
  data: ChartData[];
}

export function LineChart({ data }: ChartProps) {
  return (
    <div className="h-[200px] w-full">
      {/* Simple representation of data */}
      <div className="flex flex-col space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarChart({ data }: ChartProps) {
  return (
    <div className="h-[200px] w-full">
      {/* Simple representation of data */}
      <div className="flex flex-col space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PieChart({ data }: ChartProps) {
  return (
    <div className="h-[200px] w-full">
      {/* Simple representation of data */}
      <div className="flex flex-col space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 