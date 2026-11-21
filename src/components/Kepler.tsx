import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { ChatScript, Evidence, KeplerLine, Tone } from '../data/types';
import { Button } from './Button';
import { Chip, Tag } from './Chip';
import { KeplerIcon } from './KeplerIcon';
import { ThinkingDots } from './Misc';
import { IconArrowRight } from './icons';
import styles from './Kepler.module.css';

// ---------- Evidence ----------

/** Evidence lines, each tagged Observed or Predicted. */
export function EvidenceList({ items }: { items: (Evidence | KeplerLine)[] }) {
  return (
    <ul className={styles.evidence}>
      {items.map((e) => (
        <li key={e.text} className={styles.evLine}>
          {e.tag && <Tag kind={e.tag} className={styles.evTag} />}
          <span>{e.text}</span>
        </li>
      ))}
    </ul>
  );
}

/** Overline-labelled block used throughout drawers. */
export function DrawerSection({ label, children, gap = 12 }: { label: ReactNode; children: ReactNode; gap?: number }) {
  return (
    <section className={styles.dsection} style={{ gap }}>
      <h3 className={styles.overline}>{label}</h3>
      {children}
    </section>
  );
}

// ---------- Chat state ----------

export type ChatMessage = { role: 'user'; text: string } | { role: 'kepler'; lines: KeplerLine[] };

const STOP = new Set(['what', 'which', 'when', 'where', 'does', 'this', 'that', 'there', 'with', 'about', 'should', 'would', 'could', 'have', 'from', 'they', 'their', 'will', 'into', 'than', 'then', 'them', 'your', 'were']);
const words = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w));

/** Finds the scripted answer for a question: exact match, else the best keyword overlap, else the context fallback. */
export const answerFor = (script: ChatScript, question: string): KeplerLine[] => {
  const q = question.trim().toLowerCase();
  const exact = script.qs.find((x) => x.q.toLowerCase() === q);
  if (exact) return exact.a;
  const qw = new Set(words(q));
  let best: { score: number; a: KeplerLine[] } | null = null;
  for (const item of script.qs) {
    const score = words(item.q).filter((w) => qw.has(w)).length;
    if (score > 0 && (!best || score > best.score)) best = { score, a: item.a };
  }
  return best && best.score >= 1 && qw.size <= 8 ? best.a : script.fallback;
};

/**
 * Contextual Kepler conversation. State resets when `contextId` changes,
 * so a chat opened from a different alert or insight starts fresh with that context.
 */
export function useKeplerChat(contextId: string | null, script: ChatScript | null, intro: string) {
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState('');
  const timer = useRef<number>();

  useEffect(() => {
    window.clearTimeout(timer.current);
    setMsgs(contextId ? [{ role: 'kepler', lines: [{ tag: '', text: intro }] }] : []);
    setThinking(false);
    setInput('');
  }, [contextId, intro]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const ask = useCallback(
    (text: string) => {
      const q = text.trim();
      if (!q || thinking || !script) return;
      setMsgs((m) => [...m, { role: 'user', text: q }]);
      setInput('');
      setThinking(true);
      timer.current = window.setTimeout(() => {
        setMsgs((m) => [...m, { role: 'kepler', lines: answerFor(script, q) }]);
        setThinking(false);
      }, 1100);
    },
    [script, thinking],
  );

  const asked = msgs.filter((m): m is { role: 'user'; text: string } => m.role === 'user').map((m) => m.text.toLowerCase());
  const suggestions = (script?.qs ?? []).map((x) => x.q).filter((q) => !asked.includes(q.toLowerCase()));

  return { msgs, thinking, input, setInput, ask, suggestions };
}

// ---------- Chat UI ----------

export function KeplerTile({ size = 36, iconSize = 18, spin = false }: { size?: number; iconSize?: number; spin?: boolean }) {
  return (
    <span className={styles.tile} style={{ width: size, height: size }}>
      <KeplerIcon size={iconSize} spin={spin} />
    </span>
  );
}

export function ChatContext({ title, chip, backLabel, onBack }: { title: string; chip?: { text: string; tone: Tone }; backLabel?: string; onBack?: () => void }) {
  return (
    <div className={styles.contextWrap}>
      <div className={styles.context}>
        <span className={styles.contextLabel}>Context</span>
        <div className={styles.contextTitle}>
          {chip && <Chip tone={chip.tone} size="sm" dot>{chip.text}</Chip>}
          <span>{title}</span>
        </div>
        {onBack && backLabel && (
          <Button variant="ghost" size="xs" className={styles.back} iconLeft={<IconArrowRight size={13} />} onClick={onBack}>
            {backLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export function ChatMessages({ msgs, thinking }: { msgs: ChatMessage[]; thinking: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    endRef.current?.scrollIntoView({ block: 'end', behavior: reduce ? 'auto' : 'smooth' });
  }, [msgs.length, thinking]);

  return (
    <div className={styles.messages} role="log" aria-live="polite" aria-label="Conversation with Kepler">
      {msgs.map((m, i) =>
        m.role === 'user' ? (
          <div key={i} className={styles.user}>{m.text}</div>
        ) : (
          <div key={i} className={styles.kep}>
            <span className={styles.kepName}><KeplerIcon size={13} />Kepler</span>
            {m.lines.map((l) => (
              <div key={l.text} className={styles.kepLine}>
                {l.tag && <Tag kind={l.tag} className={styles.evTag} />}
                <span>{l.text}</span>
              </div>
            ))}
          </div>
        ),
      )}
      {thinking && (
        <div className={styles.thinking}>
          <ThinkingDots />
          Kepler is checking the data…
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}

export function ChatComposer({
  suggestions, input, setInput, onAsk, thinking, placeholder,
}: { suggestions: string[]; input: string; setInput: (v: string) => void; onAsk: (q: string) => void; thinking: boolean; placeholder: string }) {
  return (
    <>
      {suggestions.length > 0 && (
        <div className={styles.chips} aria-label="Suggested questions">
          {suggestions.map((q) => (
            <button key={q} type="button" className={styles.qchip} onClick={() => onAsk(q)} disabled={thinking}>
              {q}
            </button>
          ))}
        </div>
      )}
      <form
        className={styles.composer}
        onSubmit={(e) => {
          e.preventDefault();
          onAsk(input);
        }}
      >
        <label htmlFor="kepler-q" className="sr-only">Ask a follow-up question</label>
        <input
          id="kepler-q"
          data-autofocus
          className={styles.field}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" variant="kepler" className={styles.send} aria-label="Send" disabled={!input.trim() || thinking}>
          <IconArrowRight size={16} />
        </Button>
      </form>
      <p className={styles.disclaimer}>Kepler only advises. It never changes assignments or deadlines.</p>
    </>
  );
}
