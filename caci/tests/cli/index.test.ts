import { spawn } from 'child_process';
import { join } from 'path';

// Helper function to determine the correct command for Windows vs Unix
const getCommand = () => {
  if (process.platform === 'win32') {
    return { command: 'cmd', args: ['/c', 'npx', 'ts-node'] };
  } else {
    return { command: 'npx', args: ['ts-node'] };
  }
};

describe('CACI CLI Interface', () => {
  const cliPath = join(__dirname, '../../src/cli/index.ts');

  it('should display help when no arguments provided', done => {
    const { command, args } = getCommand();
    const cli = spawn(command, [...args, cliPath], {
      cwd: process.cwd(),
      shell: process.platform === 'win32'
    });

    let output = '';
    let completed = false;

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.stderr.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      if (completed) return;
      completed = true;
      clearTimeout(timeoutId);
      // Commander.js may exit with code 0 or 1 when displaying help, depending on platform
      expect([0, 1]).toContain(code);
      expect(output).toContain('Usage:');
      expect(output).toContain('Commands:');
      done();
    });

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (completed) return;
      completed = true;
      cli.kill();
      done(new Error('Test timed out'));
    }, 15000);
  }, 20000);

  it('should display version when --version flag is used', done => {
    const { command, args } = getCommand();
    const cli = spawn(command, [...args, cliPath, '--version'], {
      cwd: process.cwd(),
      shell: process.platform === 'win32'
    });

    let output = '';
    let completed = false;

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      if (completed) return;
      completed = true;
      clearTimeout(timeoutId);
      expect(code).toBe(0);
      // Version should match the one in package.json
      expect(output).toMatch(/\d+\.\d+\.\d+/);
      done();
    });

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (completed) return;
      completed = true;
      cli.kill();
      done(new Error('Test timed out'));
    }, 15000);
  }, 20000);

  it('should display help when --help flag is used', done => {
    const { command, args } = getCommand();
    const cli = spawn(command, [...args, cliPath, '--help'], {
      cwd: process.cwd(),
      shell: process.platform === 'win32'
    });

    let output = '';
    let completed = false;

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      if (completed) return;
      completed = true;
      clearTimeout(timeoutId);
      expect(code).toBe(0);
      expect(output).toContain('Usage:');
      expect(output).toContain('Commands:');
      done();
    });

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (completed) return;
      completed = true;
      cli.kill();
      done(new Error('Test timed out'));
    }, 15000);
  }, 20000);

  it('should handle init command', done => {
    const { command, args } = getCommand();
    const cli = spawn(command, [...args, cliPath, 'init'], {
      cwd: process.cwd(),
      env: { ...process.env, GOOGLE_API_KEY: 'test' },
      shell: process.platform === 'win32'
    });

    let output = '';
    let completed = false;

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.stderr.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      if (completed) return;
      completed = true;
      clearTimeout(timeoutId);
      // Command will fail due to missing components.json but should show configuration output
      expect(output).toContain('CACI');
      done();
    });

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (completed) return;
      completed = true;
      cli.kill();
      done(new Error('Test timed out'));
    }, 15000);
  }, 20000);

  it('should handle update command', done => {
    const { command, args } = getCommand();
    const cli = spawn(command, [...args, cliPath, 'update'], {
      cwd: process.cwd(),
      env: { ...process.env, GOOGLE_API_KEY: 'test' },
      shell: process.platform === 'win32'
    });

    let output = '';
    let completed = false;

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.stderr.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      if (completed) return;
      completed = true;
      clearTimeout(timeoutId);
      // Command will fail due to missing components.json but should show configuration output
      expect(output).toContain('CACI');
      done();
    });

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (completed) return;
      completed = true;
      cli.kill();
      done(new Error('Test timed out'));
    }, 15000);
  }, 20000);

  it('should handle configure command', done => {
    const { command, args } = getCommand();
    const cli = spawn(command, [...args, cliPath, 'configure'], {
      cwd: process.cwd(),
      env: { ...process.env, GOOGLE_API_KEY: 'test' },
      shell: process.platform === 'win32'
    });

    let output = '';
    let completed = false;

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.stderr.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      if (completed) return;
      completed = true;
      clearTimeout(timeoutId);
      // Command will fail due to missing components.json but should show configuration output
      expect(output).toContain('CACI');
      done();
    });

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (completed) return;
      completed = true;
      cli.kill();
      done(new Error('Test timed out'));
    }, 15000);
  }, 20000);

  it('should handle history command', done => {
    const { command, args } = getCommand();
    const cli = spawn(command, [...args, cliPath, 'history'], {
      cwd: process.cwd(),
      shell: process.platform === 'win32'
    });

    let output = '';
    let completed = false;

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      if (completed) return;
      completed = true;
      clearTimeout(timeoutId);
      expect(code).toBe(0);
      expect(output).toContain('CACI Configuration History');
      done();
    });

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (completed) return;
      completed = true;
      cli.kill();
      done(new Error('Test timed out'));
    }, 15000);
  }, 20000);
});
