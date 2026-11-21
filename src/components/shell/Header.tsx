import { useEffect, useRef, useState } from 'react';
import { CURRENT_USER, TEAM_NAME } from '../../data/mockData';
import { useAppStore } from '../../store/appStore';
import { Button, IconButton } from '../Button';
import { Chip } from '../Chip';
import { Input } from '../Input';
import { IconBell, IconChevronDown, IconMoon, IconRefresh, IconSearch, IconSun, IconTeam } from '../icons';
import styles from './Header.module.css';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export function Header() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const lastSync = useAppStore((s) => s.lastSync);
  const refreshSync = useAppStore((s) => s.refreshSync);
  const searchRef = useRef<HTMLInputElement>(null);
  const [syncing, setSyncing] = useState(false);

  // ⌘K / Ctrl+K focuses the global search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const refresh = () => {
    if (syncing) return;
    setSyncing(true);
    window.setTimeout(() => {
      refreshSync();
      setSyncing(false);
    }, 700);
  };

  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <header className={styles.header}>
      <Button variant="secondary" size="sm" className={styles.team} iconLeft={<IconTeam size={16} />} iconRight={<IconChevronDown size={16} />} aria-label={`Team: ${TEAM_NAME}`}>
        {TEAM_NAME}
      </Button>

      <div role="search" className={styles.search}>
        <Input
          ref={searchRef}
          type="search"
          label="Search Orbit"
          hideLabel
          placeholder="Search people, tasks or projects"
          icon={<IconSearch size={16} />}
          trailing={<span className={`${styles.kbd} num`}>{isMac ? '⌘K' : 'Ctrl K'}</span>}
        />
      </div>

      <div className={styles.actions}>
        <Chip tone="success" dot title="Jira and Linear sync is simulated in this prototype" aria-live="polite">
          {syncing ? 'Syncing… (simulated)' : `Last sync ${lastSync}`}
        </Chip>
        <IconButton label="Refresh data" onClick={refresh} aria-busy={syncing}>
          <IconRefresh size={17} className={syncing ? styles.spinning : undefined} />
        </IconButton>
        <IconButton label={themeLabel} onClick={toggleTheme}>
          {theme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
        </IconButton>
        <IconButton label="Notifications, 3 unread" title="Notifications" className={styles.bell}>
          <IconBell size={17} />
          <span className={styles.badge} aria-hidden="true" />
        </IconButton>
        <IconButton label={`${CURRENT_USER.name}, profile`} variant="plain" className={styles.avatar}>
          {CURRENT_USER.initials}
        </IconButton>
      </div>
    </header>
  );
}
