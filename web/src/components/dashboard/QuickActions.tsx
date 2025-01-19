import React from 'react';
import { Card } from '@/components/ui';
import {
  EnvelopeIcon,
  UserPlusIcon,
  DocumentPlusIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const actions = [
  {
    name: 'New Campaign',
    description: 'Create and send a new email campaign',
    icon: EnvelopeIcon,
    href: '/campaigns/new',
    color: 'bg-blue-500',
  },
  {
    name: 'Add Subscribers',
    description: 'Import or add new subscribers',
    icon: UserPlusIcon,
    href: '/subscribers/import',
    color: 'bg-green-500',
  },
  {
    name: 'Create Template',
    description: 'Design a new email template',
    icon: DocumentPlusIcon,
    href: '/templates/new',
    color: 'bg-purple-500',
  },
  {
    name: 'View Reports',
    description: 'Check campaign performance',
    icon: ChartBarIcon,
    href: '/reports',
    color: 'bg-orange-500',
  },
];

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link key={action.name} to={action.href}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <div
                className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {action.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {action.description}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};