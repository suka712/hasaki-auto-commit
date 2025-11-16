#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const drawLogBox = (commitMessage: string, filesChanged: string[]) => {
  const maxBoxWidth = 70;
  const messageLength = maxBoxWidth - 20;
  const contentSpace = maxBoxWidth - 4;

  const commitMessagePrint = `Message: ${
    commitMessage.length < messageLength
      ? commitMessage
      : commitMessage.substring(0, messageLength) + '...'
  }`;
  const fileChangedPrint = `Files changed: ${
    filesChanged.join(', ').length < messageLength
      ? filesChanged.join(', ')
      : filesChanged.join(', ').substring(0, messageLength) + '...'
  }`;

  const padLine = (text: string) => {
    const paddingLength = Math.max(0, contentSpace - text.length);
    return text + ' '.repeat(paddingLength);
  };

  const horizontalLine = '─'.repeat(maxBoxWidth - 2);

  console.log('┌' + horizontalLine + '┐');
  console.log(`│ ${padLine(commitMessagePrint)} │`);
  console.log(`│ ${padLine(fileChangedPrint)} │`);
  console.log('└' + horizontalLine + '┘');
};

const runShellCommand = (command: string) => {
  return execSync(command, { stdio: 'inherit' });
};

const getFilesChanged = (): string[] => {
  const output = execSync('git diff --cached --name-only').toString().trim();
  if (output === '') {
    return [];
  }
  return output.split('\n');
};

const getGitDiffOutput = () => {
  return execSync('git --no-pager diff --staged').toString();
};

const ai = new GoogleGenAI({});

const generateCommitMessage = async (gitDiffOutput: string) => {
  try {
    console.log('Generating commit message...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a 10 word or less message for the following git commit: ${gitDiffOutput}`,
    });
    return response.text?.trim().replace(/"/g, '\\"');
  } catch (error) {
    console.log('Error generating commit message:', error);
    return;
  }
};

const main = async () => {
  // Add every changes including unstaged files
  runShellCommand('git add .');

  const filesChanged = getFilesChanged();

  if (filesChanged.length === 0) {
    console.log('No file change. No commit made.');
    return;
  }

  const gitDiffOutput = getGitDiffOutput();

  if (gitDiffOutput.length === 0) {
    console.log('Diff output is empty. No commit made.'); // TODO: needs testing
    return;
  }

  const commitMessage = await generateCommitMessage(gitDiffOutput);

  if (!commitMessage?.trim()) {
    console.log('Empty commit message. No commit made.'); // TODO: test also. Never ran before
    return;
  }

  // Performs the commit
  runShellCommand(`git commit -m "${commitMessage}"`);

  drawLogBox(commitMessage, filesChanged);
};

// Runs the app
main();
