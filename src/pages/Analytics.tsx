import { useMemo, useState } from 'react';
import { usePeriod } from '../components/PeriodSelector';
import { PageHeader } from '../components/shell/AppShell';
import { rangeOf } from '../data/analytics';
import { AnalyticsDrawer, type AnalyticsDrawerView } from '../features/analytics/AnalyticsDrawer';
import { Bottlenecks } from '../features/analytics/Bottlenecks';
import { Delivery } from '../features/analytics/Delivery';
import { KeplerAnalysis } from '../features/analytics/KeplerAnalysis';
import { OverviewKpis } from '../features/analytics/OverviewKpis';
import { WorkloadTrends } from '../features/analytics/WorkloadTrends';
import styles from '../features/analytics/Analytics.module.css';

/** Historical patterns. No global period: each section keeps its own selection. */
export default function Analytics() {
  const ov = usePeriod();
  const tr = usePeriod();
  const dl = usePeriod();
  const bn = usePeriod();

  const trRange = useMemo(() => rangeOf(tr.period), [tr.period]);
  const dlRange = useMemo(() => rangeOf(dl.period), [dl.period]);
  const bnRange = useMemo(() => rangeOf(bn.period), [bn.period]);

  const [drawer, setDrawer] = useState<AnalyticsDrawerView | null>(null);
  const [openBottleneck, setOpenBottleneck] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Patterns in your team's workload and delivery over time. Each section has its own reporting period."
      />

      <OverviewKpis period={ov.period} setPeriod={ov.setPeriod} loading={ov.loading} />

      <div className={styles.g2}>
        {/* Kepler comes first in reading order, directly after the overview; it sits in the right column. */}
        <KeplerAnalysis
          range={trRange}
          loading={tr.loading}
          onExplore={() => setDrawer({ type: 'insight' })}
          onAsk={() => setDrawer({ type: 'chat', ctx: 'insight' })}
        />
        <WorkloadTrends period={tr.period} setPeriod={tr.setPeriod} range={trRange} loading={tr.loading} version={tr.version} />
      </div>

      <Delivery period={dl.period} setPeriod={dl.setPeriod} range={dlRange} loading={dl.loading} version={dl.version} />

      <Bottlenecks
        period={bn.period}
        setPeriod={bn.setPeriod}
        range={bnRange}
        loading={bn.loading}
        openId={openBottleneck}
        setOpenId={setOpenBottleneck}
        onAsk={(id) => setDrawer({ type: 'chat', ctx: id })}
      />

      <AnalyticsDrawer
        view={drawer}
        trendRange={trRange}
        bottleneckRange={bnRange}
        onClose={() => setDrawer(null)}
        onNavigate={setDrawer}
        onBackToBottleneck={(id) => {
          setDrawer(null);
          setOpenBottleneck(id);
        }}
      />
    </>
  );
}
