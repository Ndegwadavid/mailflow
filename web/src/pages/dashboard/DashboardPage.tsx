import { Card } from '@/components/ui';
import {
  UsersIcon,
  EnvelopeIcon,
  CursorArrowRaysIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Subscribers',
    value: '0',
    icon: UsersIcon,
    change: '+0%',
    changeType: 'positive',
  },
  {
    name: 'Campaigns Sent',
    value: '0',
    icon: EnvelopeIcon,
    change: '+0%',
    changeType: 'positive',
  },
  {
    name: 'Average Open Rate',
    value: '0%',
    icon: CursorArrowRaysIcon,
    change: '+0%',
    changeType: 'positive',
  },
  {
    name: 'Average Click Rate',
    value: '0%',
    icon: CheckCircleIcon,
    change: '+0%',
    changeType: 'positive',
  },
];

export const DashboardPage = () => {
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="px-4 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </div>
                  <div className="mt-1 text-xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Welcome to MailFlow
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Get started by importing your subscribers or creating your first
                email campaign.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Documentation
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};