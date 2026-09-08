import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Moon,
  Radio,
  Server,
  Zap,
} from 'lucide-react';
import wakezillaLogo from '../assets/wakezilla.webp';

const steps = [
  {
    title: 'A request is all it takes.',
    label: 'WAKE ON DEMAND',
    description:
      'Open your app as usual. Wakezilla checks the service and wakes the machine if it is asleep.',
    icon: Zap,
  },
  {
    title: 'A clear path to your server.',
    label: 'FORWARD THE REQUEST',
    description:
      'Once the service is ready, Wakezilla forwards your original connection to the port you configured.',
    icon: ArrowRight,
  },
  {
    title: 'The answer finds its way back.',
    label: 'RETURN THE RESPONSE',
    description:
      'Traffic flows in both directions. The response travels from your service, through Wakezilla, back to your app.',
    icon: Check,
  },
  {
    title: 'Nothing to do? Time to rest.',
    label: 'POWER DOWN AFTER INACTIVITY',
    description:
      'New connections reset the timer. After your configured idle period, Wakezilla asks the paired client to power down.',
    icon: Moon,
  },
];

export function LifecycleStory() {
  const list = useRef<HTMLOListElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!window.IntersectionObserver || !list.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActiveStep(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: '-25% 0px -35% 0px', threshold: 0 },
    );
    for (const item of list.current.children) observer.observe(item);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={list} className="lifecycle-story">
      {steps.map(({ title, label, description, icon: Icon }, index) => (
        <li
          key={label}
          data-step={index}
          className={`story-step story-step--${index + 1} ${activeStep === index ? 'is-active' : ''}`}
        >
          <div className="story-step__marker">
            <Icon aria-hidden="true" />
          </div>
          <div className="story-step__copy">
            <p className="section-kicker">
              0{index + 1} / {label}
            </p>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <div className="story-visual" aria-hidden="true">
            {index === 0 && (
              <>
                <div className="story-chip">
                  <Radio />
                  <span>Incoming request</span>
                </div>
                <div className="story-wire">
                  <span />
                  <Zap />
                  <span />
                </div>
                <div className="story-machine">
                  <Server />
                  <span>Server waking up</span>
                  <i />
                </div>
              </>
            )}
            {(index === 1 || index === 2) && (
              <div
                className={`story-route ${index === 2 ? 'story-route--response' : ''}`}
              >
                <div className="story-endpoint">
                  <span>{index === 1 ? 'APP' : 'CLIENT'}</span>
                  <div>{index === 1 ? <Radio /> : <Check />}</div>
                </div>
                <div className="story-route__wire">
                  {index === 1 ? <ArrowRight /> : <ArrowLeft />}
                </div>
                <div className="story-proxy">
                  <img src={wakezillaLogo} alt="" />
                  <span>Wakezilla</span>
                </div>
                <div className="story-route__wire">
                  {index === 1 ? <ArrowRight /> : <ArrowLeft />}
                </div>
                <div className="story-endpoint">
                  <span>SERVER</span>
                  <div>
                    <Server />
                  </div>
                </div>
                <code>
                  {index === 1 ? 'Connection forwarded' : 'Response delivered'}
                </code>
              </div>
            )}
            {index === 3 && (
              <div className="story-rest">
                <div>
                  <Clock3 />
                  <span>Inactivity period</span>
                  <strong>60 min</strong>
                </div>
                <div className="rest-bars">
                  {Array.from({ length: 24 }, (_, i) => (
                    <span key={i} />
                  ))}
                </div>
                <p>
                  <Moon /> Back to sleep.<span>You choose the timeout.</span>
                </p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
