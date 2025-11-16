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
  let gitDiffOutput = execSync('git --no-pager diff').toString();

  if (gitDiffOutput.length > 0) {
    return gitDiffOutput;
  }

  return execSync('git --no-pager diff --staged').toString();
};

const ai = new GoogleGenAI({});

const generateCommitMessage = async (gitDiffOutput: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a 10 word or less message for the following git commit: ${gitDiffOutput}`,
    });
    return response.text?.trim().replace(/"/g, '\\"');
  } catch (error) {
    console.log('Error generating commit message:', error);
    return 'Error generating commit message';
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
};


// Runs the app
main();
