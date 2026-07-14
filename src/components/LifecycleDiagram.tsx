import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Moon,
  Power,
  RotateCcw,
  Server,
  UserRound,
  Wifi,
} from 'lucide-react';
import wakezillaLogo from '../assets/wakezilla.png';
import {
  handleLifecycleRequest,
  nextLifecyclePhase,
  type LifecyclePhase,
} from '../lifecycle';

const phaseCopy: Record<LifecyclePhase, string> = {
  sleeping: 'Target sleeping',
  request: 'Request received',
  checking: 'Checking target',
  waking: 'Sending wake packet',
  forwarding: 'Forwarding request',
  responding: 'Returning 200 OK',
  idle: 'Idle timer running',
  shutdown: 'Powering target down',
};

const phaseDelay: Record<LifecyclePhase, number> = {
  sleeping: 1800,
  request: 1350,
  checking: 1350,
  waking: 1800,
  forwarding: 1450,
  responding: 1800,
  idle: 2600,
  shutdown: 1700,
};

const timeline = [
  { phases: ['request'], label: 'Request arrives' },
  { phases: ['checking'], label: 'Target checked' },
  { phases: ['waking'], label: 'Wake packet sent' },
  { phases: ['forwarding'], label: 'Request forwarded' },
  { phases: ['responding'], label: 'Response returned' },
  { phases: ['idle'], label: 'Idle timer' },
  { phases: ['shutdown', 'sleeping'], label: 'Target sleeps' },
] satisfies Array<{ phases: LifecyclePhase[]; label: string }>;

function includesPhase(phases: LifecyclePhase[], currentPhase: LifecyclePhase) {
  return phases.includes(currentPhase);
}

export function LifecycleDiagram() {
  const [phase, setPhase] = useState<LifecyclePhase>('sleeping');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPhase((currentPhase) => nextLifecyclePhase(currentPhase));
    }, phaseDelay[phase]);

    return () => window.clearTimeout(timeout);
  }, [phase]);

  const serverIsOnline = ['forwarding', 'responding', 'idle'].includes(phase);
  const requestIsActive = phase === 'request' || phase === 'forwarding';
  const responseIsActive = phase === 'responding';

  const sendRequest = () => {
    setPhase((currentPhase) => handleLifecycleRequest(currentPhase));
  };

  return (
    <div className="lifecycle-shell" aria-label="Wakezilla request lifecycle">
      <div className="lifecycle-shell__header">
        <div className="flex items-center gap-2">
          <span className="live-dot" aria-hidden="true" />
          <span className="font-mono text-[0.68rem] font-semibold tracking-[0.2em] text-[#b9bbb4]">
            LIVE FLOW
          </span>
        </div>
        <p className="lifecycle-status" aria-live="polite">
          {phaseCopy[phase]}
        </p>
      </div>

      <div className="network-map">
        <article className={`network-node ${requestIsActive || responseIsActive ? 'is-active' : ''}`}>
          <div className="network-node__icon">
            <UserRound aria-hidden="true" />
          </div>
          <div>
            <span>CLIENT</span>
            <strong>you.local</strong>
          </div>
        </article>

        <div className={`flow-connector flow-connector--request ${requestIsActive ? 'is-active' : ''}`}>
          <span>REQUEST</span>
          <div className="flow-connector__line">
            <code>GET /media</code>
            <ArrowRight aria-hidden="true" />
          </div>
        </div>

        <article className={`network-node network-node--wakezilla ${phase !== 'sleeping' ? 'is-active' : ''}`}>
          <img src={wakezillaLogo} alt="Wakezilla routing the request" />
          <div>
            <span>WAKEZILLA</span>
            <strong>Always ready</strong>
          </div>
        </article>

        <div className={`flow-connector flow-connector--target ${phase === 'waking' || phase === 'forwarding' ? 'is-active' : ''}`}>
          <span>{phase === 'waking' ? 'WAKE' : 'PROXY'}</span>
          <div className="flow-connector__line">
            <code>{phase === 'waking' ? 'MAGIC PACKET' : ':8096'}</code>
            {phase === 'waking' ? <Wifi aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          </div>
        </div>

        <article className={`network-node ${serverIsOnline ? 'is-online' : ''}`}>
          <div className="network-node__icon">
            {serverIsOnline ? <CheckCircle2 aria-hidden="true" /> : <Server aria-hidden="true" />}
          </div>
          <div>
            <span>TARGET</span>
            <strong>{serverIsOnline ? 'ONLINE' : phase === 'waking' ? 'WAKING' : 'SLEEPING'}</strong>
          </div>
        </article>

        <div className={`response-route ${responseIsActive ? 'is-active' : ''}`}>
          <div className="response-route__label">
            <span>RESPONSE</span>
            <code>200 OK</code>
          </div>
          <div className="response-route__line">
            <ArrowLeft aria-hidden="true" />
            <span />
          </div>
        </div>
      </div>

      <div className={`idle-panel ${phase === 'idle' ? 'is-active' : ''}`}>
        <Clock3 aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span>Idle timeout</span>
            <code>60 minutes</code>
          </div>
          <div className="idle-panel__track"><span /></div>
        </div>
        <Power aria-hidden="true" />
      </div>

      <p className="idle-note">
        Every new request resets the idle timer. After 60 minutes without activity, Wakezilla powers the target down.
      </p>

      <ol className="lifecycle-timeline" aria-label="Lifecycle stages">
        {timeline.map((item, index) => (
          <li
            key={item.label}
            className={includesPhase(item.phases, phase) ? 'is-active' : ''}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
          </li>
        ))}
      </ol>

      <button type="button" className="replay-button" onClick={sendRequest}>
        <RotateCcw aria-hidden="true" />
        {phase === 'idle' ? 'Send another request' : 'Replay lifecycle'}
      </button>

      <div className="sr-only">
        <Moon /> The target returns to sleep after shutdown.
      </div>
    </div>
  );
}
