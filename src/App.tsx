import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Download,
  Github,
  Gauge,
  MonitorPlay,
  Moon,
  Play,
  Power,
  Server,
  Star,
} from 'lucide-react';
import wakezillaDashboard from './assets/wakezilla-dashboard.webp';
import wakezillaLogo from './assets/wakezilla.webp';
import { InstallCommand } from './components/InstallCommand';
import { LifecycleDiagram } from './components/LifecycleDiagram';
import { LifecycleStory } from './components/LifecycleStory';
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

const useCases = [
  {
    icon: MonitorPlay,
    label: 'Media server',
    title: 'Movie night, on demand.',
    detail: 'Wake Jellyfin or Plex when somebody opens the app.',
  },
  {
    icon: Bot,
    label: 'Local AI',
    title: 'Give your GPU a break.',
    detail: 'Bring an Ollama or inference machine online on demand.',
  },
  {
    icon: Gauge,
    label: 'Development',
    title: 'Power for your next build.',
    detail: 'Route traffic to a workstation or test server when needed.',
  },
  {
    icon: Server,
    label: 'Occasional services',
    title: 'Small jobs. Quiet servers.',
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
  const [installPlatform, setInstallPlatform] = useState<InstallPlatform>('unix');
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
    setInstallPlatform(detectInstallPlatform());
  }, []);

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
      <a className="skip-link" href="#top">Skip to content</a>
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

      <main id="top" tabIndex={-1}>
        <section className="hero-section page-width" aria-labelledby="hero-heading">
          <div className="hero-light" aria-hidden="true"><span /><span /><span /></div>
          <div className="hero-copy">
            <p className="hero-eyebrow"><span /> ON-DEMAND POWER FOR YOUR HOMELAB</p>
            <h1 id="hero-heading">
              Let your servers<br />
              <span>sleep.</span>
            </h1>
            <p className="hero-copy__description">
              Ready when you need them. Quiet when you don’t.
              <span>Wakezilla is a free, open-source Wake-on-LAN proxy. Wake your machines on demand, route TCP traffic, and power them down after inactivity.</span>
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#install">
                <Download aria-hidden="true" /> Install Wakezilla
              </a>
              <a className="button button--secondary" href="#demo">
                <Play aria-hidden="true" /> Watch it work
              </a>
            </div>
            <div className="hero-trust" aria-label="Project highlights">
              <span><CheckCircle2 aria-hidden="true" /> Free & open source</span>
              <span>Linux, macOS & Windows</span>
              <a
                className="hero-repo-link"
                href="https://github.com/guibeira/wakezilla"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={heroGithubRepositoryAriaLabel}
              >
                <Github aria-hidden="true" />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>

          <LifecycleDiagram />
        </section>

        <section className="section-block page-width benefits-section" aria-labelledby="why-heading">
          <div className="split-heading">
            <SectionHeading
              eyebrow="THE ALWAYS-ON TAX"
              title="Why keep it running?"
              id="why-heading"
              description="Your best hardware doesn’t need to run around the clock. Let its working hours follow yours."
            />
            <p className="split-heading__aside">
              Less idle time. Less noise. More room to do something useful with your hardware.
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

        <section id="how" className="section-block how-section" aria-labelledby="how-heading">
          <div className="page-width">
            <SectionHeading
              eyebrow="A LITTLE AUTOMATION. A COMPLETE LOOP."
              title="From the first request to a well-earned rest."
              id="how-heading"
              description="Wake, forward, respond, rest. Wakezilla connects the dots."
              align="center"
            />

            <LifecycleStory />
          </div>
        </section>

        <section className="section-block page-width configuration-section">
          <div>
            <SectionHeading
              eyebrow="YOUR MACHINES. YOUR RULES."
              title="Everything in its right place."
              description="Your machines, ports, and inactivity settings. Together in one simple dashboard."
            />
            <ul className="configuration-points">
              <li><span>01</span> Discover or add your machines.</li>
              <li><span>02</span> Connect the ports your apps use.</li>
              <li><span>03</span> Choose when it’s time to rest.</li>
            </ul>
            <a className="text-link" href="/docs/guides/web-dashboard/">Explore the dashboard <ArrowRight aria-hidden="true" /></a>
          </div>

          <figure className="dashboard-preview">
            <div className="dashboard-preview__chrome" aria-hidden="true">
              <span /><span /><span />
              <p>wakezilla.local</p>
            </div>
            <img
              src={wakezillaDashboard}
              alt="Wakezilla dashboard showing machine status and configured services"
              width="1440"
              height="1000"
              loading="lazy"
            />
          </figure>
        </section>

        <section id="use-cases" className="section-block page-width">
          <SectionHeading
            eyebrow="MADE FOR YOUR CORNER OF THE INTERNET"
            title="Big ideas. Smaller running hours."
            description="A movie, a prompt, a new project. Give your hardware a reason to wake up."
          />
          <div className="use-case-grid">
            {useCases.map(({ icon: Icon, label, title, detail }, index) => (
              <article key={label} className={`use-case-card use-case-card--${index + 1}`}>
                <div className="use-case-card__icon"><Icon aria-hidden="true" /></div>
                <span>{label}</span><h3>{title}</h3><p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="install" className="section-block section-block--install">
          <div className="page-width install-layout">
            <div>
              <SectionHeading
                eyebrow="ONE COMMAND AWAY"
                title="Your homelab can take it from here."
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
          <p className="section-kicker">READY FOR THE NEXT REQUEST</p>
          <h2>Let your server sleep.</h2>
          <p>It has better things to do than wait.</p>
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
