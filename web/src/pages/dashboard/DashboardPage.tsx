import React from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';

export const DashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back! Here's what's happening with your campaigns.
        </p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <QuickActions />
      </section>

      {/* Stats and Charts */}
      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics Overview</h2>
        <DashboardStats />
      </section>
    </div>
  );
};