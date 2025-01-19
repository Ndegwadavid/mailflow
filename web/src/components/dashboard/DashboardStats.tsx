import React from 'react';
import { Card } from '@/components/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const subscriberData = [
  { month: 'Jan', subscribers: 400 },
  { month: 'Feb', subscribers: 600 },
  { month: 'Mar', subscribers: 800 },
  { month: 'Apr', subscribers: 1000 },
  { month: 'May', subscribers: 1200 },
  { month: 'Jun', subscribers: 1500 },
];

const engagementData = [
  { month: 'Jan', openRate: 68, clickRate: 40 },
  { month: 'Feb', openRate: 72, clickRate: 45 },
  { month: 'Mar', openRate: 65, clickRate: 38 },
  { month: 'Apr', openRate: 75, clickRate: 48 },
  { month: 'May', openRate: 70, clickRate: 42 },
  { month: 'Jun', openRate: 78, clickRate: 50 },
];

export const DashboardStats = () => {
  return (
    <div className="space-y-6">
      {/* Subscriber Growth Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Subscriber Growth
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subscriberData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="subscribers"
                fill="#3B82F6"
                name="Total Subscribers"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Engagement Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Email Engagement
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="openRate"
                stroke="#3B82F6"
                name="Open Rate %"
              />
              <Line
                type="monotone"
                dataKey="clickRate"
                stroke="#10B981"
                name="Click Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Campaign "{['Welcome Series', 'Monthly Newsletter', 'Product Update'][index]}" sent
                  </p>
                  <p className="text-sm text-gray-500">
                    {['2 hours ago', '1 day ago', '3 days ago'][index]}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {['85%', '72%', '68%'][index]} open rate
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};