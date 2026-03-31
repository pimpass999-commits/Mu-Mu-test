import React from 'react';
import { useTaskFlow } from '../hooks/useTaskFlow';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { User, Bell, Shield, Palette, Globe, Mail } from 'lucide-react';
import { cn } from '../utils/cn';

export const Settings: React.FC = () => {
  const { currentUser } = useTaskFlow();

  const sections = [
    {
      title: 'Profile Information',
      icon: User,
      description: 'Update your personal details and how others see you.',
      fields: [
        { label: 'Full Name', value: currentUser.name, type: 'text' },
        { label: 'Email Address', value: currentUser.email, type: 'email' },
        { label: 'Job Role', value: currentUser.role, type: 'text' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Manage how and when you receive updates.',
      fields: [
        { label: 'Email Notifications', value: 'Enabled', type: 'toggle' },
        { label: 'Desktop Alerts', value: 'Disabled', type: 'toggle' },
        { label: 'Task Reminders', value: 'Enabled', type: 'toggle' },
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel of TaskFlow.',
      fields: [
        { label: 'Theme', value: 'Light Mode', type: 'select' },
        { label: 'Sidebar Density', value: 'Comfortable', type: 'select' },
        { label: 'Primary Color', value: 'Blue', type: 'select' },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 lg:p-8 space-y-8 max-w-4xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-500">Manage your account preferences and application settings.</p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-bottom border-slate-100 flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl">
                    <section.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{section.title}</h3>
                    <p className="text-sm text-slate-500">{section.description}</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
                      <label className="text-sm font-medium text-slate-700">{field.label}</label>
                      <div className="w-full sm:w-64">
                        {field.type === 'toggle' ? (
                          <button className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                            field.value === 'Enabled' ? 'bg-blue-600' : 'bg-slate-200'
                          )}>
                            <span className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              field.value === 'Enabled' ? 'translate-x-6' : 'translate-x-1'
                            )} />
                          </button>
                        ) : field.type === 'select' ? (
                          <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>{field.value}</option>
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            defaultValue={field.value}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-slate-50 border-top border-slate-100 flex justify-end">
                  <Button variant="primary" size="sm">Save Changes</Button>
                </div>
              </div>
            ))}

            <div className="bg-red-50 rounded-2xl border border-red-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-red-900">Danger Zone</h3>
                <p className="text-sm text-red-700">Permanently delete your account and all project data.</p>
              </div>
              <Button variant="danger" size="sm">Delete Account</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
