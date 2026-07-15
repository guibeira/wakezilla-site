import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Github,
  Gauge,
  Globe2,
  MonitorPlay,
  Moon,
  Network,
  Power,
  Server,
  Star,
  TimerReset,
  Zap,
} from 'lucide-react';
import wakezillaDashboard from './assets/wakezilla-dashboard.png';
import wakezillaLogo from './assets/wakezilla.png';
import { InstallCommand } from './components/InstallCommand';
import { LifecycleDiagram } from './components/LifecycleDiagram';
import { SectionHeading } from './components/SectionHeading';
import { fetchGitHubStars, formatGitHubStars } from './githubStars';

type GitHubStarsState =
  | { status: 'loading' }
  | { status: 'loaded'; count: number }
  | { status: 'error' };

type InstallPlatform = 'unix' | 'windows';

const installCommands: Record<InstallPlatform, { command: string; shell: string; note: string }> = {
  unix: {
    command: 'curl -fsSL https://wakezilla.dev/install.sh | sh',
    shell: 'bash',
    note: 'Installs a verified prebuilt release on Linux or macOS.',
  },
  windows: {
    command: 'irm https://wakezilla.dev/install.ps1 | iex',
    shell: 'powershell',
    note: 'Installs the Wakezilla tray app, shortcuts, and command-line tools.',
  },
};

const lifecycleSteps = [
  {
    number: '01',
    title: 'Traffic arrives',
    description: 'A connection reaches a port managed by Wakezilla.',
    icon: Globe2,
  },
  {
    number: '02',
    title: 'The target wakes',
    description: 'If the machine is offline, Wakezilla sends a magic packet and waits for it.',
    icon: Zap,
  },
  {
    number: '03',
    title: 'Request goes through',
    description: 'The original connection is forwarded to the service when it is ready.',
    icon: Network,
  },
  {
    number: '04',
    title: 'Response comes back',
    description: 'The service response travels back through Wakezilla to the client.',
    icon: ArrowRight,
  },
  {
    number: '05',
    title: 'Activity resets the timer',
    description: 'Every accepted connection updates the target’s last-request time.',
    icon: TimerReset,
  },
  {
    number: '06',
    title: 'Silence means sleep',
    description: 'After the configured idle period, Wakezilla asks the target to power down.',
    icon: Moon,
  },
];

const useCases = [
  {
    icon: MonitorPlay,
    label: 'Media server',
    title: 'Ready for movie night, quiet the rest of the week.',
    detail: 'Wake Jellyfin or Plex when somebody opens the app.',
  },
  {
    icon: Bot,
    label: 'Local AI',
    title: 'Keep the GPU off until a prompt needs it.',
    detail: 'Bring an Ollama or inference machine online on demand.',
  },
  {
    icon: Gauge,
    label: 'Development',
    title: 'Use powerful hardware only while you are building.',
    detail: 'Route traffic to a workstation or test server when needed.',
  },
  {
    icon: Server,
    label: 'Occasional services',
    title: 'Stop paying the always-on tax for rarely used tools.',
    detail: 'Perfect for backups, game servers, and internal apps.',
  },
];

function detectInstallPlatform(): InstallPlatform {
  if (typeof navigator === 'undefined') {
    return 'unix';
  }

  const platform = navigator.platform.toLowerCase();
  const userAgent = navigator.userAgent.toLowerCase();

  return platform.includes('win') || userAgent.includes('windows') ? 'windows' : 'unix';
}

function App() {
  const [copied, setCopied] = useState(false);
  const [installPlatform] = useState<InstallPlatform>(() => detectInstallPlatform());
  const [githubStars, setGithubStars] = useState<GitHubStarsState>({ status: 'loading' });

  const selectedInstall = installCommands[installPlatform];
  const githubStarsValue = githubStars.status === 'loaded'
    ? formatGitHubStars(githubStars.count)
    : githubStars.status === 'error'
      ? 'Unavailable'
      : '...';
  const githubStarsLabel = githubStars.status === 'loaded'
    ? `${githubStarsValue} stars`
    : githubStars.status === 'error'
      ? 'Stars unavailable'
      : 'Stars';
  const githubStarsAriaStatus = githubStars.status === 'loaded'
    ? `${githubStarsValue} stars`
    : githubStars.status === 'error'
      ? 'stars unavailable'
      : 'stars loading';
  const githubRepositoryAriaLabel = `GitHub repository, ${githubStarsAriaStatus}`;
  const heroGithubRepositoryAriaLabel = `View on GitHub repository, ${githubStarsAriaStatus}`;

  useEffect(() => {
    let isMounted = true;

    fetchGitHubStars()
      .then((starCount) => {
        if (isMounted) {
          setGithubStars({ status: 'loaded', count: starCount });
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to load GitHub stars:', err);
        if (isMounted) {
          setGithubStars({ status: 'error' });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(selectedInstall.command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <nav className="page-width site-nav" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Wakezilla home">
            <img src={wakezillaLogo} alt="" />
            <span>Wakezilla</span>
          </a>

          <div className="site-nav__links">
            <a href="#how">How it works</a>
            <a href="#use-cases">Use cases</a>
            <a href="#install">Install</a>
            <a href="/docs/">Docs</a>
          </div>

          <a
            href="https://github.com/guibeira/wakezilla"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={githubRepositoryAriaLabel}
            className="github-link"
          >
            <Github aria-hidden="true" />
            <span>GitHub</span>
            <span className="github-link__stars">
              <Star aria-hidden="true" /> {githubStarsLabel}
            </span>
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section page-width">
          <div className="hero-copy">
            <p className="section-kicker">ON-DEMAND POWER FOR YOUR HOMELAB</p>
            <h1>
              Your server wakes for the request.
              <span>Sleeps when the work is done.</span>
            </h1>
            <p className="hero-copy__description">
              Wakezilla wakes your target, proxies the request, and returns the response.
              After 60 minutes without activity, Wakezilla powers the target down automatically.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#how">
                See how it works <ArrowRight aria-hidden="true" />
              </a>
              <a
                className="button button--secondary"
                href="https://github.com/guibeira/wakezilla"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={heroGithubRepositoryAriaLabel}
              >
                <Github aria-hidden="true" />
                <span>View on GitHub</span>
                <span className="button__meta"><Star aria-hidden="true" /> {githubStarsLabel}</span>
              </a>
            </div>
            <div className="hero-trust" aria-label="Project highlights">
              <span><CheckCircle2 aria-hidden="true" /> Open source</span>
              <span><CheckCircle2 aria-hidden="true" /> MIT licensed</span>
              <span><CheckCircle2 aria-hidden="true" /> Linux, macOS & Windows</span>
            </div>
          </div>

          <LifecycleDiagram />
        </section>

        <section className="section-block page-width" aria-labelledby="why-heading">
          <div className="split-heading">
            <SectionHeading
              eyebrow="THE ALWAYS-ON TAX"
              title="Why keep it running?"
              description="Most homelab services are used in bursts. Wakezilla lets the hardware follow demand instead of burning energy through the quiet hours."
            />
            <p className="split-heading__aside">
              The service still feels available. The machine simply does not have to be awake before the first connection arrives.
            </p>
          </div>

          <div className="comparison-grid">
            <article className="comparison-card comparison-card--muted">
              <div className="comparison-card__topline">
                <span>WITHOUT WAKEZILLA</span>
                <Power aria-hidden="true" />
              </div>
              <h3>Always on</h3>
              <p>The server stays powered through long periods with no useful traffic.</p>
              <div className="usage-chart usage-chart--always" aria-label="Server powered all day">
                {Array.from({ length: 24 }, (_, index) => <span key={index} />)}
              </div>
              <footer><span>00:00</span><strong>24 hours powered</strong><span>24:00</span></footer>
            </article>

            <article className="comparison-card comparison-card--accent">
              <div className="comparison-card__topline">
                <span>WITH WAKEZILLA</span>
                <Moon aria-hidden="true" />
              </div>
              <h3>Awake on demand</h3>
              <p>Traffic wakes the target. Inactivity sends it back to sleep.</p>
              <div className="usage-chart usage-chart--demand" aria-label="Server powered only during use">
                {Array.from({ length: 24 }, (_, index) => <span key={index} />)}
              </div>
              <footer><span>00:00</span><strong>Power follows activity</strong><span>24:00</span></footer>
            </article>
          </div>
        </section>

        <section id="how" className="section-block section-block--panel">
          <div className="page-width">
            <SectionHeading
              eyebrow="THE COMPLETE LOOP"
              title="How Wakezilla works"
              description="The request and response are only half the story. Wakezilla also keeps the target awake while traffic continues and closes the loop when activity stops."
              align="center"
            />

            <ol className="process-grid">
              {lifecycleSteps.map(({ number, title, description, icon: Icon }) => (
                <li key={number}>
                  <div className="process-grid__number">{number}</div>
                  <Icon aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="use-cases" className="section-block page-width">
          <SectionHeading
            eyebrow="USE THE BIG MACHINE WHEN IT MATTERS"
            title="Built for real homelabs"
            description="From movie night to local inference, keep occasional workloads reachable without keeping their hardware awake around the clock."
          />

          <div className="use-case-grid">
            {useCases.map(({ icon: Icon, label, title, detail }, index) => (
              <article key={label} className={`use-case-card use-case-card--${index + 1}`}>
                <div className="use-case-card__icon"><Icon aria-hidden="true" /></div>
                <span>{label}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block page-width configuration-section">
          <div>
            <SectionHeading
              eyebrow="YOU SET THE RHYTHM"
              title="Configure the lifecycle"
              description="Register a machine, choose the ports Wakezilla should proxy, and decide how long it may remain idle."
            />
            <ul className="configuration-points">
              <li><CheckCircle2 aria-hidden="true" /> Discover or add machines from the web interface.</li>
              <li><CheckCircle2 aria-hidden="true" /> Set local and target ports for each service.</li>
              <li><CheckCircle2 aria-hidden="true" /> Choose the inactivity period in minutes.</li>
            </ul>
          </div>

          <figure className="dashboard-preview">
            <div className="dashboard-preview__chrome" aria-hidden="true">
              <span /><span /><span />
              <p>wakezilla.local</p>
            </div>
            <img
              src={wakezillaDashboard}
              alt="Wakezilla web interface with expanded port forward fields"
              width="1080"
              height="750"
              loading="lazy"
            />
          </figure>
        </section>

        <section id="install" className="section-block section-block--install">
          <div className="page-width install-layout">
            <div>
              <SectionHeading
                eyebrow="ONE COMMAND AWAY"
                title="Install and start saving energy"
                description="Install Wakezilla, run the guided setup, and register the machines that should wake on demand."
              />
              <a
                className="text-link"
                href="/docs/"
              >
                Read the setup guide <ArrowRight aria-hidden="true" />
              </a>
            </div>
            <InstallCommand
              command={selectedInstall.command}
              shell={selectedInstall.shell}
              note={selectedInstall.note}
              copied={copied}
              onCopy={copyToClipboard}
            />
          </div>
        </section>

        <section className="section-block page-width open-source-section">
          <div>
            <SectionHeading
              eyebrow="YOURS TO RUN, READ, AND IMPROVE"
              title="Open source, by design"
              description="Wakezilla is free to self-host, transparent to inspect, and shaped in public with its community."
            />
            <a
              className="button button--secondary"
              href="https://github.com/guibeira/wakezilla"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={githubRepositoryAriaLabel}
            >
              <Github aria-hidden="true" /> Explore the repository
            </a>
          </div>
          <div className="project-stats">
            <div><strong>100%</strong><span>Open Source</span></div>
            <div><strong>{githubStarsValue}</strong><span>GitHub Stars</span></div>
            <div><strong>MIT</strong><span>Licensed</span></div>
          </div>
        </section>

        <section className="final-cta page-width">
          <img src={wakezillaLogo} alt="" />
          <p className="section-kicker">THE NEXT REQUEST CAN WAKE IT</p>
          <h2>Let your server sleep.</h2>
          <p>Keep the service available without keeping the machine awake.</p>
          <div className="hero-actions">
            <a className="button button--primary" href="#install">
              Install Wakezilla <ArrowRight aria-hidden="true" />
            </a>
            <a
              className="button button--secondary"
              href="/docs/"
            >
              Documentation
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width site-footer__inner">
          <a className="brand" href="#top">
            <img src={wakezillaLogo} alt="" />
            <span>Wakezilla</span>
          </a>
          <p>On-demand power for the modern homelab.</p>
          <div>
            <a
              href="https://github.com/guibeira/wakezilla"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={githubRepositoryAriaLabel}
            >
              GitHub
            </a>
            <a
              href="/docs/"
            >
              Documentation
            </a>
            <a href="https://github.com/guibeira" target="_blank" rel="noopener noreferrer">
              @guibeira
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
