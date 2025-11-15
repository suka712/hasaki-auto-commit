#!/usr/bin/env node
import { execSync } from 'node:child_process';

const runShellCommand = (command: string) => {
  return execSync(command, { stdio: 'inherit' });
};

const generateMessage = () => {

}

const files = execSync('git diff --name-only').toString().trim()

console.log(files)