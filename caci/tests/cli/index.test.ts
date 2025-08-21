import { spawn } from 'child_process';
import { join } from 'path';

describe('CACI CLI Interface', () => {
  const cliPath = join(__dirname, '../../src/cli/index.ts');

  it('should display help when no arguments provided', done => {
    const cli = spawn('npx', ['ts-node', cliPath], {
      cwd: process.cwd(),
    });

    let output = '';

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.stderr.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      // Commander.js exits with code 1 when no command is provided but displays help
      expect(code).toBe(1);
      expect(output).toContain('Usage:');
      expect(output).toContain('Commands:');
      done();
    });
  }, 10000);

  it('should display version when --version flag is used', done => {
    const cli = spawn('npx', ['ts-node', cliPath, '--version'], {
      cwd: process.cwd(),
    });

    let output = '';

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      expect(code).toBe(0);
      // Version should match the one in package.json
      expect(output).toMatch(/\d+\.\d+\.\d+/);
      done();
    });
  });

  it('should display help when --help flag is used', done => {
    const cli = spawn('npx', ['ts-node', cliPath, '--help'], {
      cwd: process.cwd(),
    });

    let output = '';

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      expect(code).toBe(0);
      expect(output).toContain('Usage:');
      expect(output).toContain('Commands:');
      done();
    });
  }, 10000); // Increase timeout for this test

  it('should handle init command', done => {
    const cli = spawn('npx', ['ts-node', cliPath, 'init'], {
      cwd: process.cwd(),
      env: { ...process.env, GOOGLE_API_KEY: 'test' },
    });

    let output = '';

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.stderr.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      // Command will fail due to missing components.json but should show configuration output
      expect(output).toContain('CACI');
      done();
    });
  }, 10000);

  it('should handle update command', done => {
    const cli = spawn('npx', ['ts-node', cliPath, 'update'], {
      cwd: process.cwd(),
      env: { ...process.env, GOOGLE_API_KEY: 'test' },
    });

    let output = '';

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.stderr.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      // Command will fail due to missing components.json but should show configuration output
      expect(output).toContain('CACI');
      done();
    });
  }, 10000);

  it('should handle configure command', done => {
    const cli = spawn('npx', ['ts-node', cliPath, 'configure'], {
      cwd: process.cwd(),
      env: { ...process.env, GOOGLE_API_KEY: 'test' },
    });

    let output = '';

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.stderr.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      // Command will fail due to missing components.json but should show configuration output
      expect(output).toContain('CACI');
      done();
    });
  }, 10000);

  it('should handle history command', done => {
    const cli = spawn('npx', ['ts-node', cliPath, 'history'], {
      cwd: process.cwd(),
    });

    let output = '';

    cli.stdout.on('data', data => {
      output += data.toString();
    });

    cli.on('close', code => {
      expect(code).toBe(0);
      expect(output).toContain('CACI Configuration History');
      done();
    });
  }, 10000);
});
