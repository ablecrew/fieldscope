import React from 'react';
import { ClipboardList, UserCheck, Sprout, Bell, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: <ClipboardList className="text-[#008800]" size={30} />,
    title: 'Create and Manage Fields',
    description: 'Admins create fields with name, crop type, planting date, current stage, and assignment details.',
  },
  {
    icon: <UserCheck className="text-[#9A7B4F]" size={30} />,
    title: 'Assign Field Agents',
    description: 'Each field can be assigned to a field agent responsible for updates and observations.',
  },
  {
    icon: <Sprout className="text-[#008800]" size={30} />,
    title: 'Update Field Stages',
    description: 'Agents update progress through Planted, Growing, Ready, and Harvested stages.',
  },
  {
    icon: <Bell className="text-[#9A7B4F]" size={30} />,
    title: 'Monitor Notifications',
    description: 'Receive live notifications for updates, assignments, risks, and other system events.',
  },
  {
    icon: <BarChart3 className="text-[#008800]" size={30} />,
    title: 'Review Insights',
    description: 'Dashboards provide total field counts, status breakdowns, analytics, and useful observations.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <section className="py-20 bg-gradient-to-b from-[#008800] to-[#9A7B4F] text-[#FFFDD0]">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-lg md:text-xl">
            FieldScope simplifies field monitoring from setup to reporting.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col md:flex-row gap-6 md:items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#FFFDD0] border border-[#9A7B4F]/20 flex items-center justify-center">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#9A7B4F] mb-1">Step {index + 1}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-7">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;