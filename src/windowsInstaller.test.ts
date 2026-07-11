import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const installer = readFileSync(resolve(process.cwd(), 'public/install.ps1'), 'utf8');

describe('Windows installer', () => {
  it('includes the desktop integration lifecycle', () => {
    expect(installer).toContain('Install-WakezillaDesktopIntegration');
    expect(installer).toContain('wakezilla-tray.exe');
    expect(installer).toContain('WakezillaTray');
    expect(installer).toContain('uninstall-wakezilla.ps1');
  });
});
