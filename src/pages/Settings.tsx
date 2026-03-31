import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskFlow } from '../hooks/useTaskFlow';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { User, Bell, Shield, Palette, Globe, Mail, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface SettingsProps {
  onLogout: () => Promise<void> | void;
}

export const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
  const { currentUser, updateCurrentUser } = useTaskFlow();
  const navigate = useNavigate();
  
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    avatar: currentUser.avatar
  });
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    setProfileForm({
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      avatar: currentUser.avatar,
    });
  }, [currentUser]);

  const handleLogout = async () => {
    await onLogout();
    navigate('/');
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaveStatus('saving');

    try {
      await updateCurrentUser({
        name: profileForm.name,
        email: profileForm.email,
        role: profileForm.role,
        avatar: profileForm.avatar,
      });
      setSaveStatus('success');

      window.setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch {
      setSaveStatus('idle');
    }
  };

  const sections = [
    {
      id: 'profile',
      title: 'Profile Information',
      icon: User,
      description: 'Update your personal details and how others see you.',
      fields: [
        { label: 'Full Name', name: 'name', value: profileForm.name, type: 'text' },
        { label: 'Email Address', name: 'email', value: profileForm.email, type: 'email' },
        { label: 'Job Role', name: 'role', value: profileForm.role, type: 'text' },
        { label: 'Avatar URL', name: 'avatar', value: profileForm.avatar, type: 'text' },
      ],
      onSave: handleSaveProfile
    },
    {
      id: 'notifications',
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
      id: 'appearance',
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 lg:p-8 space-y-8 max-w-4xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and application settings.</p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <section.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{section.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {section.fields.map((field: any) => (
                    <div key={field.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{field.label}</label>
                      <div className="w-full sm:w-64">
                        {field.type === 'toggle' ? (
                          <button className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                            field.value === 'Enabled' ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                          )}>
                            <span className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              field.value === 'Enabled' ? 'translate-x-6' : 'translate-x-1'
                            )} />
                          </button>
                        ) : field.type === 'select' ? (
                          <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200">
                            <option>{field.value}</option>
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={field.value}
                            onChange={section.id === 'profile' ? handleProfileChange : undefined}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center gap-3 transition-colors">
                  {section.id === 'profile' && saveStatus === 'success' && (
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Changes saved successfully
                    </span>
                  )}
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={section.onSave ? () => void section.onSave() : undefined}
                    disabled={section.id === 'profile' && saveStatus === 'saving'}
                  >
                    {section.id === 'profile' && saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            ))}

            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-400">Danger Zone</h3>
                <p className="text-sm text-red-700 dark:text-red-500/80">Permanently delete your account and all project data.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" onClick={() => void handleLogout()} className="text-slate-600 dark:text-slate-400">Sign Out</Button>
                <Button variant="danger" size="sm">Delete Account</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
