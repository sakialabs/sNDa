"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Case } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = [
  '#0088FE', // blue
  '#00C49F', // teal
  '#FFBB28', // yellow
  '#FF8042', // orange
  '#8884D8', // purple
  '#FF6B6B', // red
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ 
  cx, 
  cy, 
  midAngle, 
  innerRadius, 
  outerRadius, 
  percent, 
  name,
  value 
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.2;
  const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.2;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface CaseDistributionChartProps {
  cases: Case[];
  loading: boolean;
}

export function CaseDistributionChart({ cases, loading }: CaseDistributionChartProps) {
  // Group cases by status
  const statusCounts = cases.reduce((acc: Record<string, number>, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.split('_').map(s => s.charAt(0) + s.slice(1).toLowerCase()).join(' '),
    value,
  }));

  if (loading) {
    return (
      <Card className="h-[400px] flex flex-col">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <Skeleton className="h-64 w-64 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle>Case Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                className="text-xs"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="outline-none"
                  />
                ))}
              </Pie>
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '12px',
                }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} cases`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
