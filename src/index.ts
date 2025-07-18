#!/usr/bin/env node
import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';
import WelcomeScreen from './components/welcome.js';
import process from 'process';

const program = new Command();

program
  .name('yoda')
  .description('A Yoda themed CLI tool that helps you learn everything about anything')
  .version('0.1.0');

program
  .command('learn')
  .description('Start learning about a topic')
  .argument('[topic]', 'topic to learn about')
  .action((topic) => {
    render(React.createElement(WelcomeScreen, { topic }), {
      stdin: process.stdin,
      stdout: process.stdout,
    });
  });

// Default action - show welcome screen
program.action(() => {
  render(React.createElement(WelcomeScreen, {}), {
    stdin: process.stdin,
    stdout: process.stdout,
  });
});

program.parse();
