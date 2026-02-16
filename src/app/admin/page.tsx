"use client";

import React, { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { CrisisMonitoringDashboard } from '@/components/admin/CrisisMonitoringDashboard';
import { LoadingState } from '@/components/ui/LoadingState';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';
import { auth } from '@/lib/firebase';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Admin" showBack />}>
        <LoadingState message="Loading admin dashboard..." variant="page" />
      </SanctuaryLayout>
    );
  }

  return (
    <AdminAuthGuard>
      <SanctuaryLayout header={<SanctuaryHeader title="Admin" showBack />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN.spacing.lg }}>
          <SanctuaryCard elevated>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: DESIGN.spacing.md }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN.spacing.xs }}>
                <SanctuaryText variant="title" as="h1">
                  Crisis Monitoring Dashboard
                </SanctuaryText>
                <SanctuaryText variant="muted" as="p">
                  Real-time monitoring of user safety with privacy protection.
                </SanctuaryText>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN.spacing.md }}>
                <div style={{ textAlign: 'right' }}>
                  <SanctuaryText variant="caption" as="div" style={{ color: DESIGN.colors.textSecondary }}>
                    Logged in as
                  </SanctuaryText>
                  <SanctuaryText variant="body" as="div" style={{ fontWeight: DESIGN.typography.weights.medium }}>
                    {user?.email || 'Unknown'}
                  </SanctuaryText>
                </div>
                <button
                  type="button"
                  onClick={() => auth.signOut()}
                  style={{
                    height: '44px',
                    paddingLeft: DESIGN.spacing.md,
                    paddingRight: DESIGN.spacing.md,
                    borderRadius: DESIGN.radius.full,
                    border: `1px solid ${DESIGN.colors.border}`,
                    backgroundColor: 'rgba(232, 197, 109, 0.12)',
                    color: DESIGN.colors.gold,
                    fontFamily: DESIGN.typography.sansSerif,
                    fontSize: DESIGN.typography.sizes.sm,
                    cursor: 'pointer',
                    transition: DESIGN.transitions.normal,
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </SanctuaryCard>

          <SanctuaryCard>
            <SanctuaryText variant="title" as="h2" style={{ fontSize: DESIGN.typography.sizes.lg }}>
              Privacy Protection Active
            </SanctuaryText>
            <SanctuaryText variant="muted" as="p" style={{ marginTop: DESIGN.spacing.sm }}>
              This dashboard should display only non-identifying information necessary for safety monitoring. Treat any access as
              sensitive and auditable.
            </SanctuaryText>
          </SanctuaryCard>

          <CrisisMonitoringDashboard />
        </div>
      </SanctuaryLayout>
    </AdminAuthGuard>
  );
}
