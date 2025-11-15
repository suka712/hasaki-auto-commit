#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config'

const numberOfFilesChanged = execSync('git diff --name-only').toString().trim().split('\n').length;
const gitDiffOutput = execSync('git --no-pager diff').toString();
const ai = new GoogleGenAI({});

const generateMessage = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate a 10 word or less message for the following git commit: ${gitDiffOutput}`,
  });

  return response.text;
};

const aiGeneratedMessage = await generateMessage();

console.log(aiGeneratedMessage);

const runShellCommand = (command: string) => {
  return execSync(command, { stdio: 'inherit' });
};

const runAutoCommit = () => {
  console.log('Files changed:', numberOfFilesChanged);
  runShellCommand('git add .');
  runShellCommand(`git commit -m "${aiGeneratedMessage} - AI generated message"`);
  console.log('Command ran successfully.');
};

runAutoCommit();
