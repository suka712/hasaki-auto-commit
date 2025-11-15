#!/usr/bin env node
import { execSync } from 'node:child_process';

const run = (command: string) => {
  return execSync(command, { stdio: 'inherit' });
};

run ('ls')