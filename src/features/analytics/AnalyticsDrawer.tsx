import { useMemo, type ComponentProps } from 'react';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Drawer } from '../../components/Drawer';
import {
  ChatComposer, ChatContext, ChatMessages, DrawerSection, EvidenceList, KeplerTile, useKeplerChat,
} from '../../components/Kepler';
import { KeplerIcon } from '../../components/KeplerIcon';
import { bottleneckChat, insight, insightChat, type Range } from '../../data/analytics';
import { BOTTLENECKS } from '../../data/mockData';
import styles from './Analytics.module.css';

/** `ctx` is "insight" or a bottleneck id. */
export type AnalyticsDrawerView = { type: 'insight' } | { type: 'chat'; ctx: string };

interface Props {
  view: AnalyticsDrawerView | null;
  trendRange: Range;
  bottleneckRange: Range;
  onClose: () => void;
  onNavigate: (v: AnalyticsDrawerView) => void;
  /** Close the chat and expand that bottleneck row. */
  onBackToBottleneck: (id: string) => void;
}

export function AnalyticsDrawer({ view, trendRange, bottleneckRange, onClose, onNavigate, onBackToBottleneck }: Props) {
  const chatCtx = view?.type === 'chat' ? view.ctx : null;
  const script = useMemo(() => {
    if (!chatCtx) return null;
    if (chatCtx === 'insight') return insightChat(trendRange);
    const b = BOTTLENECKS.find((x) => x.id === chatCtx);
    return b ? bottleneckChat(b, bottleneckRange) : null;
  }, [chatCtx, trendRange, bottleneckRange]);
  // The context includes the period, so a new period starts a fresh conversation.
  const contextId = script ? `${chatCtx}|${script.sub}` : null;
  const intro = script ? `I’m looking at “${script.title}” (${script.sub}). What would you like to know?` : '';
  const chat = useKeplerChat(contextId, script, intro);

  let chrome: Omit<ComponentProps<typeof Drawer>, 'open' | 'onClose' | 'children'> = { title: '' };
  let body: JSX.Element | null = null;

  if (view?.type === 'insight') {
    const d = insight(trendRange);
    chrome = {
      contentKey: 'insight',
      title: d.title,
      leading: <Chip tone="kepler" size="sm" icon={<KeplerIcon size={12} />} className={styles.selfStart}>Kepler insight</Chip>,
      subtitle: `Workload trends · ${trendRange.label} (${trendRange.span})`,
      footer: (
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="kepler" iconLeft={<KeplerIcon size={16} />} onClick={() => onNavigate({ type: 'chat', ctx: 'insight' })}>
            Ask AI about this insight
          </Button>
        </>
      ),
    };
    body = (
      <>
        <DrawerSection label="The pattern" gap={6}><p>{d.text}</p></DrawerSection>
        <DrawerSection label="Supporting figures" gap={8}>
          <div className={styles.figTable} role="table" aria-label="Weekly utilisation figures">
            <div className={`${styles.figRow} ${styles.figHead}`} role="row">
              <span className={styles.label} role="columnheader">Week of</span>
              <span className={styles.label} role="columnheader">Average</span>
              <span className={styles.label} role="columnheader">Above 85%</span>
            </div>
            {d.rows.map((w) => (
              <div key={w.label} className={styles.figRow} role="row">
                <span role="cell">{w.label}</span>
                <span role="cell">{w.avg}%</span>
                <span role="cell" className={w.high >= 3 ? styles.dangerStrong : undefined}>{w.high} of 8 ({w.share}%)</span>
              </div>
            ))}
          </div>
        </DrawerSection>
        <DrawerSection label="Most often above 85%" gap={8}>
          {d.top.length === 0 && <p className={styles.caption}>Nobody in this period.</p>}
          {d.top.map((t) => (
            <div key={t.name} className={styles.topRow}>
              <span>{t.name}</span>
              <span className={`${styles.secondary} num`}>{t.n} of {t.of} weeks</span>
            </div>
          ))}
        </DrawerSection>
        <DrawerSection label="Evidence" gap={8}><EvidenceList items={d.evidence} /></DrawerSection>
        <DrawerSection label="Why it matters" gap={6}><p>{d.why}</p></DrawerSection>
        <div className={styles.drawerSuggest}>
          <span className={styles.suggestLabel} style={{ fontSize: 13 }}><KeplerIcon size={15} />Suggested action</span>
          <p>{d.action}</p>
          <span className={styles.caption}>Advisory only. You decide what to change.</span>
        </div>
      </>
    );
  }

  if (view?.type === 'chat' && script && chatCtx) {
    const isInsightChat = chatCtx === 'insight';
    chrome = {
      contentKey: `chat-${chatCtx}`,
      title: 'Kepler',
      ariaLabel: `Ask Kepler about: ${script.title}`,
      media: <KeplerTile />,
      subtitle: 'Answers use Orbit’s analytics data',
      beforeBody: (
        <ChatContext
          title={`${script.title} · ${script.sub}`}
          chip={{ text: isInsightChat ? 'Insight' : 'Bottleneck', tone: 'kepler' }}
          backLabel={isInsightChat ? 'Back to insight' : 'Back to bottlenecks'}
          onBack={() => (isInsightChat ? onNavigate({ type: 'insight' }) : onBackToBottleneck(chatCtx))}
        />
      ),
      footerStacked: true,
      footer: (
        <ChatComposer
          suggestions={chat.suggestions}
          input={chat.input}
          setInput={chat.setInput}
          onAsk={chat.ask}
          thinking={chat.thinking}
          placeholder="Ask a follow-up question"
        />
      ),
    };
    body = <ChatMessages msgs={chat.msgs} thinking={chat.thinking} />;
  }

  return (
    <Drawer open={!!body} onClose={onClose} {...chrome}>
      {body}
    </Drawer>
  );
}
