import { Check, Copy } from 'lucide-react';

type InstallCommandProps = {
  command: string;
  shell: string;
  note: string;
  copied: boolean;
  onCopy: () => void;
};

export function InstallCommand({
  command,
  shell,
  note,
  copied,
  onCopy,
}: InstallCommandProps) {
  return (
    <div className="install-command">
      <div className="install-command__bar">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="window-dot window-dot--red" />
          <span className="window-dot window-dot--amber" />
          <span className="window-dot window-dot--green" />
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#8f918c]">
          {shell}
        </span>
      </div>
      <div className="install-command__body">
        <code>{command}</code>
        <button type="button" onClick={onCopy} title="Copy to clipboard">
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <p>{note}</p>
    </div>
  );
}
