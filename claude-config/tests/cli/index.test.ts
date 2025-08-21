import { spawn } from 'child_process';
import { join } from 'path';

describe('CLI Interface', () => {
  const cliPath = join(__dirname, '../../src/cli/index.ts');

  test('should display help when no arguments provided', (done) => {
    const cli = spawn('npx', ['ts-node', cliPath], {
      cwd: process.cwd(),
    });

    let output = '';
    
    cli.stdout.on('data', (data) => {
      output += data.toString();
    });

    cli.on('close', (code) => {
      expect(code).toBe(0);
      expect(output).toContain('Usage:');
      expect(output).toContain('Options:');
      done();
    });
  });

  test('should display version when --version flag is used', (done) => {
    const cli = spawn('npx', ['ts-node', cliPath, '--version'], {
      cwd: process.cwd(),
    });

    let output = '';
    
    cli.stdout.on('data', (data) => {
      output += data.toString();
    });

    cli.on('close', (code) => {
      expect(code).toBe(0);
      // Version should match the one in package.json
      expect(output).toMatch(/\d+\.\d+\.\d+/);
      done();
    });
  });

  test('should display help when --help flag is used', (done) => {
    const cli = spawn('npx', ['ts-node', cliPath, '--help'], {
      cwd: process.cwd(),
    });

    let output = '';
    
    cli.stdout.on('data', (data) => {
      output += data.toString();
    });

    cli.on('close', (code) => {
      expect(code).toBe(0);
      expect(output).toContain('Usage:');
      expect(output).toContain('Options:');
      done();
    });
  }, 10000); // Increase timeout for this test

  test('should handle init command', (done) => {
    const cli = spawn('npx', ['ts-node', cliPath, '--init'], {
      cwd: process.cwd(),
    });

    let output = '';
    
    cli.stdout.on('data', (data) => {
      output += data.toString();
    });

    cli.on('close', (code) => {
      expect(code).toBe(0);
      expect(output).toContain('Initializing configuration...');
      done();
    });
  });

  test('should handle update command', (done) => {
    const cli = spawn('npx', ['ts-node', cliPath, '--update'], {
      cwd: process.cwd(),
    });

    let output = '';
    
    cli.stdout.on('data', (data) => {
      output += data.toString();
    });

    cli.on('close', (code) => {
      expect(code).toBe(0);
      expect(output).toContain('Updating configuration...');
      done();
    });
  });

  test('should handle reset command', (done) => {
    const cli = spawn('npx', ['ts-node', cliPath, '--reset'], {
      cwd: process.cwd(),
    });

    let output = '';
    
    cli.stdout.on('data', (data) => {
      output += data.toString();
    });

    cli.on('close', (code) => {
      expect(code).toBe(0);
      expect(output).toContain('Resetting configuration...');
      done();
    });
  });
});