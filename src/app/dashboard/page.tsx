// Next.js Page: Dashboard
'use client';

import React from 'react';
import DashboardPage from '../../presentation/pages/DashboardPage';

export default function Dashboard() {
  // Mock user data - in real app this would come from auth context
  const user = {
    fullName: 'John Doe',
    email: 'john.doe@example.com'
  };

  return <DashboardPage user={user} />;
}