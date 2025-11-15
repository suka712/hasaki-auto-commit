#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const runShellCommand = (command: string) => {
  return execSync(command, { stdio: 'inherit' });
};

const getFilesChanged = () => {
  return execSync('git diff --name-only').toString().trim().split('\n').join(', ');
};

const ai = new GoogleGenAI({});

const generateCommitMessage = async () => {
  const gitDiffOutput = execSync('git --no-pager diff').toString();
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
  console.log('Files changed:', filesChanged);
  console.log('Commit message:', commitMessage);
  runShellCommand('git add .');
  runShellCommand(`git commit -m "${commitMessage}"`);
};

const filesChanged = getFilesChanged();

if (filesChanged.length === 0) {
  console.log('No file changes. No commit made.');
} else {
  const generatedMessage = await generateCommitMessage();
  if (generatedMessage) {
    runAutoCommit(generatedMessage);
  }
}
