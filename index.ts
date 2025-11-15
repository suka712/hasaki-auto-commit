#!/usr/bin/env node
import { execSync } from 'node:child_process';

const runShellCommand = (command: string) => {
  return execSync(command, { stdio: 'inherit' });
};

runShellCommand('ls');