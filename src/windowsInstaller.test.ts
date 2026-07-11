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

  it('supports legacy Windows PowerShell architecture and service handling', () => {
    expect(installer).toContain('function Get-WindowsArchitecture');
    expect(installer).toContain('PROCESSOR_ARCHITEW6432');
    expect(installer).toContain('PROCESSOR_ARCHITECTURE');
    expect(installer).toContain('$service.WaitForStatus("Stopped", [TimeSpan]::FromSeconds(30))');
  });

  it('replaces existing Windows installation files safely', () => {
    expect(installer).toContain('function Publish-WakezillaFile');
    expect(installer).toContain('Copy-Item -LiteralPath $Source -Destination $Destination -Force');
    expect(installer).toContain('Publish-WakezillaFile -Source (Join-Path $temporary "wakezilla.exe") -Destination $cli');
  });

  it('stops running Wakezilla services while replacing installation files', () => {
    expect(installer).toContain('$servicesToRestart = @(Stop-WakezillaServicesForInstall)');
    expect(installer).toContain('Restart-WakezillaServicesAfterInstall -ServiceNames $servicesToRestart');
  });

  it('leaves protected Windows services running during user installer updates', () => {
    expect(installer).toContain('function Test-WakezillaServiceUsesProtectedBinary');
    expect(installer).toContain('if (Test-WakezillaServiceUsesProtectedBinary -ServiceName $serviceName)');
  });
});
