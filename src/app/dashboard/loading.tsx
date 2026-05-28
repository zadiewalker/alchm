export default function DashboardLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(165deg, var(--sage-800) 0%, var(--sage-700) 35%, var(--sage-600) 65%, var(--sage-500) 100%)', color: 'var(--text-primary)', padding: 24 }}>
      <div style={{ height: 30, width: 260, borderRadius: 8, background: 'var(--glass-surface-hover)', marginBottom: 10 }} />
      <div style={{ height: 16, width: 220, borderRadius: 8, background: 'var(--glass-surface)', marginBottom: 22 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12, marginBottom: 18 }}>
        <div style={{ height: 120, borderRadius: 14, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)' }} />
        <div style={{ height: 120, borderRadius: 14, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)' }} />
        <div style={{ height: 120, borderRadius: 14, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
        <div style={{ height: 108, borderRadius: 14, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)' }} />
        <div style={{ height: 108, borderRadius: 14, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)' }} />
      </div>
    </div>
  );
}
