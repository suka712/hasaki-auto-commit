#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const runShellCommand = (command: string) => {
  return execSync(command, { stdio: 'inherit' });
};

const getFilesChanged = (): string[] => {
  return execSync('git diff --name-only').toString().trim().split('\n');
};

const getGitDiffOutput = () => {
  return execSync('git --no-pager diff').toString();
};

const ai = new GoogleGenAI({});

const generateCommitMessage = async (gitDiffOutput: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a 10 word or less message for the following git commit: ${gitDiffOutput}`,
    });
    return response.text;
  } catch (error) {
    console.log('Error generating commit message:', error);
    return 'Error generating commit message';
  }
};

const runAutoCommit = async (commitMessage: string) => {
  runShellCommand('git add .');
  runShellCommand(`git commit -m "${commitMessage}"`);
};

const main = async () => {
  const filesChanged = getFilesChanged();

  if (filesChanged.length === 0) {
    console.log('No file changes. No commit made.');
    return;
  }

  const gitDiffOutput = getGitDiffOutput();
  const commitMessage = await generateCommitMessage(gitDiffOutput);

  if (!commitMessage) {
    console.log('Empty commit message. No commit made.');
    return;
  }

  runAutoCommit(commitMessage);
};

main();
