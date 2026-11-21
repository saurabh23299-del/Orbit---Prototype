import { NavLink } from 'react-router-dom';
import { CURRENT_USER, ORGANISATION, REMINDERS } from '../../data/mockData';
import type { Reminder } from '../../data/types';
import { KeplerIcon } from '../KeplerIcon';
import { Logo } from '../Logo';
import {
  IconCalendar, IconChart, IconChevronDown, IconChevronsUpDown, IconFlag, IconFolder, IconHome, IconSettings, IconTeam, IconVideo,
} from '../icons';
import styles from './Sidebar.module.css';

const REMINDER_ICON: Record<Reminder['icon'], JSX.Element> = {
  video: <IconVideo size={14} />,
  flag: <IconFlag size={14} />,
  calendar: <IconCalendar size={14} />,
};

const NOT_IN_PROTOTYPE = 'Not included in this prototype';

export function Sidebar() {
  const navClass = ({ isActive }: { isActive: boolean }) => `${styles.nav} ${isActive ? styles.sel : ''}`;

  return (
    <aside className={styles.aside}>
      <Logo />

      <button type="button" className={styles.org} aria-label={`Switch organisation, current: ${ORGANISATION}`}>
        <span className={styles.orgDot} aria-hidden="true" />
        <span className={styles.orgName}>{ORGANISATION}</span>
        <IconChevronDown size={14} />
      </button>

      <nav aria-label="Main" className={styles.navList}>
        <span className={styles.navLabel}>Workspace</span>
        <NavLink to="/dashboard" className={navClass}>
          <span className={styles.navIcon}><IconHome size={16} /></span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/analytics" className={navClass}>
          <span className={styles.navIcon}><IconChart size={16} /></span>
          <span>Analytics</span>
        </NavLink>
        <button type="button" className={styles.nav} title={NOT_IN_PROTOTYPE}>
          <span className={styles.navIcon}><IconTeam size={16} strokeWidth={1.5} /></span>
          <span>My Team</span>
        </button>
        <button type="button" className={styles.nav} title={NOT_IN_PROTOTYPE}>
          <span className={styles.navIcon}><IconFolder size={16} /></span>
          <span>Projects</span>
        </button>
        <button type="button" className={styles.nav} title={NOT_IN_PROTOTYPE}>
          <span className={styles.navIcon}><KeplerIcon size={16} spin /></span>
          <span>Kepler AI</span>
        </button>
        <button type="button" className={styles.nav} title={NOT_IN_PROTOTYPE}>
          <span className={styles.navIcon}><IconSettings size={16} /></span>
          <span>Settings</span>
        </button>
      </nav>

      <div className={styles.bottom}>
        <section aria-labelledby="reminders-h" className={styles.remcard}>
          <div className={styles.remHead}>
            <h2 id="reminders-h" className={styles.remTitle}>Reminders</h2>
            <span className={`${styles.count} num`} aria-label={`${REMINDERS.length} reminders`}>{REMINDERS.length}</span>
          </div>
          {REMINDERS.map((r) => (
            <button key={r.id} type="button" className={styles.rem}>
              <span className={`${styles.remTile} ${styles[r.tone]}`} aria-hidden="true">{REMINDER_ICON[r.icon]}</span>
              <span className={styles.remText}>
                <span className={styles.remName}>{r.title}</span>
                <span className={styles.remWhen}>{r.when}</span>
              </span>
            </button>
          ))}
        </section>

        <button type="button" className={styles.ptab} aria-label={`${CURRENT_USER.name}, account menu`}>
          <span className={styles.pAvatar} aria-hidden="true">{CURRENT_USER.initials}</span>
          <span className={styles.pText}>
            <span className={styles.pName}>{CURRENT_USER.name}</span>
            <span className={styles.pRole}>{CURRENT_USER.role}</span>
          </span>
          <span className={styles.pChev} aria-hidden="true"><IconChevronsUpDown size={16} /></span>
        </button>
      </div>
    </aside>
  );
}
