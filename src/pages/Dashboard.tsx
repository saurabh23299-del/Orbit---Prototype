import { useState } from 'react';
import { PageHeader } from '../components/shell/AppShell';
import { EMPLOYEES, PROJECTS } from '../data/mockData';
import { BAND_LABEL, BAND_MARK, alertByPerson, employeeStats, type Band } from '../data/selectors';
import type { EmployeeId, Task } from '../data/types';
import { ActionModal, type ModalRequest } from '../features/dashboard/ActionModal';
import { AlertCard } from '../features/dashboard/AlertCard';
import { DashboardDrawer, type DrawerView } from '../features/dashboard/DashboardDrawer';
import { EmployeeCard } from '../features/dashboard/EmployeeCard';
import { KpiRow } from '../features/dashboard/KpiRow';
import { ProjectCard } from '../features/dashboard/ProjectCard';
import { SectionHeader } from '../features/dashboard/parts';
import styles from '../features/dashboard/Dashboard.module.css';
import { useAppStore } from '../store/appStore';

const BANDS: Band[] = ['Low', 'Moderate', 'High'];

export default function Dashboard() {
  const tasks = useAppStore((s) => s.tasks);
  const handled = useAppStore((s) => s.handledAlerts);
  const [openEmp, setOpenEmp] = useState<EmployeeId | null>(null);
  const [drawer, setDrawer] = useState<DrawerView | null>(null);
  const [modal, setModal] = useState<ModalRequest | null>(null);
  // Re-keys the modal for each new request so its steps start fresh.
  const [modalKey, setModalKey] = useState(0);
  const stats = employeeStats(tasks);
  const keplerFlags = alertByPerson(handled);

  /** Opens the manager's confirmation flow. Drawers close first, as in the reference. */
  const openModal = (req: ModalRequest) => {
    setDrawer(null);
    setModalKey((k) => k + 1);
    setModal(req);
  };
  const reassign = (t: Task, suggested?: EmployeeId) => openModal({ type: 'reassign', taskId: t.id, suggested });
  const deadline = (t: Task) => openModal({ type: 'deadline', taskId: t.id });

  return (
    <>
      <PageHeader title="Dashboard" description="What's happening with your team right now, and what needs your attention." />

      <KpiRow tasks={tasks} />

      <AlertCard
        handled={handled}
        onAsk={(a) => setDrawer({ type: 'chat', id: a.id })}
        onInvestigate={(a) => setDrawer({ type: 'alert', id: a.id })}
      />

      <section aria-labelledby="pj" className={styles.section}>
        <SectionHeader id="pj" title="Project health and deadlines" description="All active projects. Progress and health are measured separately." />
        <div className={styles.projectGrid}>
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={() => setDrawer({ type: 'project', id: p.id })} />
          ))}
        </div>
      </section>

      <section aria-labelledby="wl" className={styles.section}>
        <SectionHeader
          id="wl"
          title="Team workload"
          description="Utilisation is assigned remaining effort ÷ available hours over the next 2 weeks."
          aside={
            <div className={styles.legend} aria-label="Utilisation bands">
              {BANDS.map((b) => (
                <span key={b} className={styles.legendItem}>
                  <span className={styles.swatch} style={{ background: BAND_MARK[b] }} aria-hidden="true" />
                  {BAND_LABEL[b]}
                </span>
              ))}
            </div>
          }
        />
        <div className={styles.empList}>
          {EMPLOYEES.map((e) => (
            <EmployeeCard
              key={e.id}
              stats={stats[e.id]}
              open={openEmp === e.id}
              onToggle={() => setOpenEmp((cur) => (cur === e.id ? null : e.id))}
              onDetails={() => setDrawer({ type: 'emp', id: e.id })}
              onReassign={(t) => reassign(t)}
              onDeadline={deadline}
              alert={keplerFlags[e.id]}
              onAlert={(a) => setDrawer({ type: 'alert', id: a.id })}
            />
          ))}
        </div>
      </section>

      <DashboardDrawer
        view={drawer}
        onClose={() => setDrawer(null)}
        onNavigate={setDrawer}
        onReassign={reassign}
        onDeadline={deadline}
      />
      <ActionModal key={modalKey} request={modal} onClose={() => setModal(null)} />
    </>
  );
}
