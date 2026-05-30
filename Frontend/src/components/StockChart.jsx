import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StockChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis dataKey="day" stroke="#ffffff" />

        <YAxis stroke="#ffffff" />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="price"
          stroke="#22c55e"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default StockChart;
