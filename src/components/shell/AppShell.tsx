import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import styles from './AppShell.module.css';

/** 216px fixed side panel + scrolling main area with a sticky header. */
export function AppShell() {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  // Each page starts at the top.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <a href="#content" className={styles.skip}>Skip to content</a>
      <Sidebar />
      <main ref={mainRef} className={styles.main}>
        <Header />
        <div id="content" className={styles.content} tabIndex={-1}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.pageHeader}>
      <h1 className="text-h1">{title}</h1>
      <p className={styles.pageDesc}>{description}</p>
    </div>
  );
}
