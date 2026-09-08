import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Check,
  Clock3,
  Gamepad2,
  MonitorPlay,
  Moon,
  Pause,
  Play,
  Radio,
  Server,
  SkipForward,
  Zap,
} from 'lucide-react';
import wakezillaLogo from '../assets/wakezilla.webp';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { nextLifecyclePhase, type LifecyclePhase } from '../lifecycle';

const scenarios = [
  {
    id: 'media',
    label: 'Jellyfin',
    icon: MonitorPlay,
    client: 'Jellyfin app',
    target: 'Media server',
    port: '8096',
    request: 'GET /media',
    response: '200 OK',
  },
  {
    id: 'ai',
    label: 'Local AI',
    icon: Bot,
    client: 'Your AI chat',
    target: 'GPU workstation',
    port: '11434',
    request: 'POST /api/chat',
    response: '200 OK',
  },
  {
    id: 'games',
    label: 'Game server',
    icon: Gamepad2,
    client: 'Minecraft',
    target: 'Game server',
    port: '25565',
    request: 'TCP CONNECT',
    response: 'CONNECTED',
  },
] as const;

const phaseCopy: Record<
  LifecyclePhase,
  { label: string; description: string; delay: number }
> = {
  sleeping: {
    label: 'Sleeping',
    description:
      'Your server is resting. A request is all it takes to wake it.',
    delay: 2200,
  },
  request: {
    label: 'Request received',
    description: 'A connection reaches Wakezilla. Your server is still asleep.',
    delay: 1400,
  },
  checking: {
    label: 'Checking the service',
    description: 'Wakezilla checks whether the target service is available.',
    delay: 1200,
  },
  waking: {
    label: 'Waking up',
    description:
      'A wake packet is sent. Wakezilla waits for the service to become ready.',
    delay: 2000,
  },
  forwarding: {
    label: 'Forwarding the request',
    description:
      'The service is ready. Your original request is forwarded to it.',
    delay: 1600,
  },
  responding: {
    label: 'Returning the response',
    description: 'The response travels back through Wakezilla to your app.',
    delay: 2000,
  },
  idle: {
    label: 'Idle timer running',
    description:
      'Every new connection resets the idle timer. Without new connections, the server can rest.',
    delay: 6000,
  },
  shutdown: {
    label: 'Time to rest',
    description:
      'The idle period has ended. Wakezilla asks the paired client to power down.',
    delay: 1800,
  },
};

const stages = [
  { label: 'Wake', icon: Zap, phases: ['request', 'checking', 'waking'] },
  { label: 'Forward', icon: ArrowRight, phases: ['forwarding'] },
  { label: 'Respond', icon: Check, phases: ['responding'] },
  { label: 'Rest', icon: Moon, phases: ['idle', 'shutdown', 'sleeping'] },
];

function Connection({
  requestActive,
  responseActive,
  request,
  response,
}: {
  requestActive: boolean;
  responseActive: boolean;
  request: string;
  response: string;
}) {
  return (
    <div
      className={`flow-connection ${requestActive ? 'has-request' : ''} ${responseActive ? 'has-response' : ''}`}
      aria-hidden="true"
    >
      <span className="flow-connection__request">
        {request} <ArrowRight />
      </span>
      <svg viewBox="0 0 200 110" fill="none" preserveAspectRatio="none">
        <path
          className="flow-track"
          d="M0 38 C60 38 45 12 100 12 S140 38 200 38"
        />
        <path
          className="flow-track"
          d="M200 72 C140 72 155 98 100 98 S60 72 0 72"
        />
        <path
          className="flow-packet flow-packet--request"
          pathLength="1"
          d="M0 38 C60 38 45 12 100 12 S140 38 200 38"
        />
        <path
          className="flow-packet flow-packet--response"
          pathLength="1"
          d="M200 72 C140 72 155 98 100 98 S60 72 0 72"
        />
        <circle cx="2" cy="38" r="3" className="flow-port" />
        <circle cx="198" cy="38" r="3" className="flow-port" />
        <circle cx="2" cy="72" r="3" className="flow-port" />
        <circle cx="198" cy="72" r="3" className="flow-port" />
      </svg>
      <span className="flow-connection__response">
        <ArrowRight /> {response}
      </span>
    </div>
  );
}

export function LifecycleDiagram() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<LifecyclePhase>('sleeping');
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const reducedMotion = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const timer = useRef({
    phase,
    scenarioIndex,
    remaining: phaseCopy[phase].delay,
  });
  const scenario = scenarios[scenarioIndex];
  const ClientIcon = scenario.icon;
  const running = playing && inView && pageVisible;

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    if (!window.IntersectionObserver) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  useEffect(() => {
    if (
      timer.current.phase !== phase ||
      timer.current.scenarioIndex !== scenarioIndex
    ) {
      timer.current = {
        phase,
        scenarioIndex,
        remaining: phaseCopy[phase].delay,
      };
    }
    if (!running) return;
    const startedAt = performance.now();
    const timeout = window.setTimeout(() => {
      setPhase(nextLifecyclePhase(phase));
    }, timer.current.remaining);
    return () => {
      window.clearTimeout(timeout);
      timer.current.remaining = Math.max(
        0,
        timer.current.remaining - (performance.now() - startedAt),
      );
    };
  }, [phase, running, scenarioIndex]);

  const selectScenario = (index: number) => {
    if (index === scenarioIndex) return;
    setScenarioIndex(index);
    setPhase('sleeping');
  };

  const nextStep = () => {
    setPhase((currentPhase) => nextLifecyclePhase(currentPhase));
  };

  const serverOnline = ['forwarding', 'responding', 'idle'].includes(phase);
  const targetState = serverOnline
    ? 'Online'
    : phase === 'waking'
      ? 'Waking up'
      : phase === 'shutdown'
        ? 'Powering down'
        : 'Sleeping';

  return (
    <div
      id="demo"
      ref={container}
      className={`lifecycle-shell ${running ? 'is-running' : 'is-paused'}`}
    >
      <div className="lifecycle-shell__header">
        <div className="demo-label">
          <span className="status-dot" /> YOUR HOMELAB, ON DEMAND
        </div>
        <span className="demo-caption">Interactive demo</span>
      </div>
      <div
        className="scenario-selector"
        role="group"
        aria-label="Choose a demo scenario"
      >
        {scenarios.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            type="button"
            aria-pressed={scenarioIndex === index}
            onClick={() => selectScenario(index)}
          >
            <Icon aria-hidden="true" /> {label}
          </button>
        ))}
      </div>
      <div
        className="network-map"
        role="group"
        aria-label={`${scenario.label} request and response path`}
      >
        <article
          className={`network-node network-node--client ${['request', 'forwarding', 'responding'].includes(phase) ? 'is-active' : ''}`}
        >
          <div className="network-node__icon">
            <ClientIcon aria-hidden="true" />
          </div>
          <strong>{scenario.client}</strong>
          <span className="network-node__subtitle">Your device</span>
          <div className="node-state">
            <span />{' '}
            {phase === 'responding' ? 'Response received' : 'Ready to connect'}
          </div>
        </article>
        <Connection
          requestActive={phase === 'request' || phase === 'forwarding'}
          responseActive={phase === 'responding'}
          request={scenario.request}
          response={scenario.response}
        />
        <article
          className={`network-node network-node--wakezilla ${phase !== 'sleeping' ? 'is-active' : ''}`}
        >
          <div className="mascot-orbit">
            <img src={wakezillaLogo} alt="" />
          </div>
          <strong>Wakezilla</strong>
          <span className="network-node__subtitle">Wake. Route. Rest.</span>
          <div className="node-state node-state--ready">
            <span /> Always listening
          </div>
        </article>
        <Connection
          requestActive={phase === 'waking' || phase === 'forwarding'}
          responseActive={phase === 'responding'}
          request={phase === 'waking' ? 'WAKE PACKET' : `TCP :${scenario.port}`}
          response="RESPONSE"
        />
        <article
          className={`network-node network-node--server ${serverOnline ? 'is-online' : ''} ${phase === 'waking' ? 'is-waking' : ''}`}
          aria-label={`${scenario.target}: ${targetState}`}
        >
          <div className="network-node__icon">
            {phase === 'waking' ? (
              <Zap aria-hidden="true" />
            ) : serverOnline ? (
              <Server aria-hidden="true" />
            ) : (
              <Moon aria-hidden="true" />
            )}
          </div>
          <strong>{scenario.target}</strong>
          <span className="network-node__subtitle">Port {scenario.port}</span>
          <div
            className={`node-state ${serverOnline ? 'node-state--ready' : ''}`}
          >
            <span /> {targetState}
          </div>
        </article>
      </div>
      <div
        className="demo-readout"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <Radio aria-hidden="true" />
        <div>
          <strong>{phaseCopy[phase].label}</strong>
          <p>{phaseCopy[phase].description}</p>
        </div>
      </div>
      <div
        className={`demo-idle ${phase === 'idle' ? 'is-active' : ''} ${phase === 'shutdown' || phase === 'sleeping' ? 'is-empty' : ''}`}
      >
        <span>
          <Clock3 aria-hidden="true" /> Idle timeout
        </span>
        <div className="demo-idle__track">
          <span
            key={phase}
            style={{ animationDuration: `${phaseCopy.idle.delay}ms` }}
          />
        </div>
        <span>60 minutes</span>
      </div>
      <div className="demo-footer">
        <ol className="demo-stages" aria-label="Lifecycle stages">
          {stages.map(({ label, icon: Icon, phases }, index) => (
            <li
              key={label}
              aria-current={phases.includes(phase) ? 'step' : undefined}
            >
              <span className="demo-stages__number">0{index + 1}</span>
              <Icon aria-hidden="true" /> {label}
            </li>
          ))}
        </ol>
        <div className="demo-controls">
          <button
            type="button"
            className="demo-control"
            onClick={() => setPlaying((currentPlaying) => !currentPlaying)}
            aria-label={playing ? 'Pause demo' : 'Play demo'}
          >
            {playing ? (
              <Pause aria-hidden="true" />
            ) : (
              <Play aria-hidden="true" />
            )}{' '}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            className="demo-next"
            onClick={nextStep}
            aria-label="Next step"
          >
            Next <SkipForward aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="demo-footnote">
        Example configuration · Time is accelerated
        {reducedMotion ? ' · Reduced motion: animations off' : ''}
      </p>
    </div>
  );
}
