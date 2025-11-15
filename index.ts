#!/usr/bin/env node
import { execSync } from 'node:child_process';

const numberOfFilesChanged = execSync('git diff --name-only').toString().trim().split('\n').length;

const runShellCommand = (command: string) => {
  return execSync(command, { stdio: 'inherit' });
};

const runAutoCommit = () => {
  console.log('Files changed:', numberOfFilesChanged);
  runShellCommand('git add .');
  runShellCommand(`git commit -m "Auto-generated message: changed ${numberOfFilesChanged} file(s)"`);
  console.log('Command ran successfully.');
};

runAutoCommit();
