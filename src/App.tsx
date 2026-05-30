import { useState, useEffect } from 'react';
import {
  Zap,
  Globe,
  Power,
  Copy,
  Check,
  Github,
  Server,
  Wifi,
  ArrowRight,
  Monitor,
  Timer
} from 'lucide-react';

function App() {
  const [copied, setCopied] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const installCommand = 'curl -fsSL https://wakezilla.dev/install.sh | sh';

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Wake-on-LAN Made Simple',
      description: 'Power on your machines remotely whenever needed. No more running to the server room.',
    },
    {
      icon: Globe,
      title: 'Reverse Proxy',
      description: 'Intercepts traffic and wakes the server automatically if it\'s offline.',
    },
    {
      icon: Power,
      title: 'Automatic Shutdown',
      description: 'Saves energy by powering down idle machines after configurable thresholds.',
    },
  ];

  const workflowSteps = [
    { label: 'Request Arrives', icon: Globe, description: 'HTTP request hits the proxy' },
    { label: 'Check Status', icon: Server, description: 'Proxy checks if server is awake' },
    { label: 'Send Wake Packet', icon: Wifi, description: 'Wake-on-LAN packet sent if offline' },
    { label: 'Server Wakes', icon: Power, description: 'Machine powers up remotely' },
    { label: 'Request Proxied', icon: ArrowRight, description: 'Traffic routed to destination' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-['Inter']">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://raw.githubusercontent.com/guibeira/wakezilla/main/assets/wakezilla.png"
              alt="Wakezilla"
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold text-white">Wakezilla</span>
          </div>
          <a
            href="https://github.com/guibeira/wakezilla"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-16 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-16">
            {/* Mascot */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <img
                src="https://raw.githubusercontent.com/guibeira/wakezilla/main/assets/wakezilla.png"
                alt="Wakezilla"
                className="w-32 h-32 object-contain drop-shadow-2xl"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-sm font-medium mb-6 animate-fade-in">
              <Zap className="w-4 h-4" />
              Open Source Wake-on-LAN Toolkit
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Wake-on-LAN
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-orange-400">
                Made Simple
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Power on your machines remotely whenever needed. Automatic reverse proxy
              with intelligent power management for the modern homelab.
            </p>

            {/* Installation Command */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl p-1 shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-slate-500 font-mono">bash</span>
                </div>
                <div className="flex items-center gap-3 p-4">
                  <code className="flex-1 text-left text-rose-400 font-mono text-sm sm:text-base overflow-x-auto">
                    {installCommand}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-rose-600/20"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                Installs via Homebrew, Cargo, or from source
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/guibeira/wakezilla"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-200 hover:scale-105 shadow-xl"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
              <a
                href="https://github.com/guibeira/wakezilla#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors"
              >
                Documentation
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* How It Works Animation */}
          <div className="mb-24">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              Watch Wakezilla intelligently route your traffic and manage power automatically
            </p>

            <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 overflow-hidden">
              {/* Connection line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 opacity-20"></div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2 relative">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = animationStep === index;
                  const isPast = animationStep > index;

                  return (
                    <div key={index} className="flex flex-col items-center text-center relative">
                      {/* Connector arrow (hidden on last item and mobile) */}
                      {index < workflowSteps.length - 1 && (
                        <div className="hidden sm:block absolute top-8 left-[60%] w-full h-0.5">
                          <div
                            className={`h-full transition-all duration-1000 ${
                              isPast || isActive ? 'bg-gradient-to-r from-rose-500 to-red-500' : 'bg-slate-700'
                            }`}
                          ></div>
                        </div>
                      )}

                      <div
                        className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ${
                          isActive
                            ? 'bg-rose-500 shadow-lg shadow-rose-500/50 scale-110'
                            : isPast
                              ? 'bg-red-500/80'
                              : 'bg-slate-700'
                        }`}
                      >
                        <Icon className={`w-7 h-7 transition-colors duration-500 ${
                          isActive || isPast ? 'text-white' : 'text-slate-400'
                        }`} />

                        {/* Pulse animation for active step */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-xl bg-rose-500 animate-ping opacity-50"></div>
                        )}
                      </div>

                      <h3 className={`font-semibold mb-1 transition-colors duration-300 ${
                        isActive ? 'text-rose-400' : isPast ? 'text-red-400' : 'text-slate-300'
                      }`}>
                        {step.label}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 max-w-[120px]">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Progress indicator */}
              <div className="flex justify-center gap-2 mt-8">
                {workflowSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      animationStep === index ? 'bg-rose-500 w-6' : 'bg-slate-600'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-24">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
              Everything You Need
            </h2>
            <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              A complete toolkit for managing remote machines with intelligent automation
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-rose-500/50 transition-all duration-300 hover:scale-105 cursor-default"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="mb-24">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
              Perfect For
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Server, label: 'Homelabs', desc: 'Self-hosted services on demand' },
                { icon: Monitor, label: 'Media Servers', desc: 'Wake Plex for movie night' },
                { icon: Timer, label: 'Development', desc: 'Spin up dev servers when needed' },
                { icon: Power, label: 'Energy Saving', desc: 'Cut power bills automatically' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-rose-500/30 transition-colors"
                  >
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{item.label}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-rose-500/10 via-red-500/10 to-orange-500/10 border border-slate-700 rounded-2xl p-8 sm:p-12 mb-24">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400 mb-2">
                  100%
                </div>
                <div className="text-slate-400">Open Source</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">
                  Rust
                </div>
                <div className="text-slate-400">Built for Performance</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 mb-2">
                  MIT
                </div>
                <div className="text-slate-400">Licensed</div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Wake Your Machines?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Get started in seconds with a single command. No complex setup required.
            </p>
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-2">
              <code className="px-4 py-2 text-rose-400 font-mono">
                curl -fsSL https://wakezilla.dev/install.sh | sh
              </code>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="https://raw.githubusercontent.com/guibeira/wakezilla/main/assets/wakezilla.png"
              alt="Wakezilla"
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-semibold text-white">Wakezilla</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/guibeira/wakezilla"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://github.com/guibeira/wakezilla#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Documentation
            </a>
          </div>

          <div className="text-slate-500 text-sm">
            Made with care by{' '}
            <a
              href="https://github.com/guibeira"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              @guibeira
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
