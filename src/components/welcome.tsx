import React, { useEffect, useState } from 'react';
import { Box, Text, Newline } from 'ink';
import chalk from 'chalk';
import Conf from 'conf';
import boxen from 'boxen';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';

interface WelcomeScreenProps {
  topic?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ topic }) => {
  const config = new Conf<{ hasRunBefore: boolean; userName?: string }>({ projectName: 'yoda-cli' });
  const hasRunBefore = config.get('hasRunBefore');
  const userName = config.get('userName');

  const [input, setInput] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [mode, setState] = useState<'name' | 'prompt'>(!hasRunBefore ? 'name' : 'prompt');
  const [menuActive, setMenuActive] = useState(true);

  useEffect(() => {
    if (!hasRunBefore) {
      setState('name');
    } else {
      setState('prompt');
    }
  }, [hasRunBefore]);

  const handleInputSubmit = (value: string) => {
    if (mode === 'name') {
      if (value.trim()) {
        config.set('userName', value.trim());
        config.set('hasRunBefore', true);
        setState('prompt');
        setInput('');
      }
    } else {
      setLastCommand(value);
      setInput('');
      // Add prompt handling logic here
    }
  };

  const yodaAscii = `
██╗   ██╗ █████╗ ██████╗  █████╗             ██████╗██╗     ██╗
╚██╗ ██╔╝██╔══██╗██╔══██╗██╔══██╗           ██╔════╝██║     ██║
 ╚████╔╝ ██║  ██║██║  ██║███████║ ██║██║██║ ██║     ██║     ██║
  ╚██╔╝  ██║  ██║██║  ██║██╔══██║           ██║     ██║     ██║
   ██║   ╚█████╔╝██████╔╝██║  ██║           ╚██████╗███████╗██║
   ╚═╝    ╚════╝ ╚═════╝ ╚═╝  ╚═╝            ╚═════╝╚══════╝╚═╝
`;

  const welcomeMessage = topic 
    ? `Learn about ${topic}, you wish to? Wise choice, young padawan.`
    : userName
      ? `Young padawan ${userName}, ready to learn more, are you?`
      : '';

  // Menu options for the main prompt
  const menuItems = [
    {
      label: 'Learn a new topic',
      value: 'learn',
    },
    {
      label: 'Continue previous topic',
      value: 'continue',
    },
    {
      label: 'Exit',
      value: 'exit',
    },
  ];

  const handleMenuSelect = (item: { label: string; value: string }) => {
    setLastCommand(item.label);
    setMenuActive(false);
    // You can add logic here to handle each menu action and set mode as needed
    // For example, if item.value === 'learn', setMode('input')
    if (item.value === 'exit') {
      process.exit(0);
    }
  };

  // Custom menu item for colored menu
  const MenuItem = ({ isSelected = false, label }: { isSelected?: boolean; label: string }) => (
    <Text color={isSelected ? 'yellow' : 'gray'} bold={isSelected}>
      {label}
    </Text>
  );

  return (
    <Box flexDirection="column" padding={1}>
      <Box justifyContent="flex-start" marginBottom={1}>
        <Text color="yellow">{yodaAscii}</Text>
      </Box>
      <Box justifyContent="flex-start" marginBottom={2}>
        <Text color="yellow">
          {welcomeMessage}
        </Text>
      </Box>
      {!userName && mode === 'name' && (
        <Box justifyContent="flex-start" marginBottom={1}>
          <Text color="yellow">
            {boxen(
              `🌟 Welcome, you are. Help you learn, I shall.\nBut tell me your name you must, young one:`, {
                padding: 1,
                borderColor: 'yellow',
                borderStyle: 'round',
                backgroundColor: 'black',
                title: 'Yoda Asks',
                titleAlignment: 'center',
              }
            )}
          </Text>
        </Box>
      )}
      {!userName && mode === 'name' && lastCommand && (
        <Box justifyContent="center" marginBottom={1}>
          <Text color="red">Please enter a valid name.</Text>
        </Box>
      )}
      {/* Menu instead of usage text */}
      {!topic && mode === 'prompt' && menuActive && (
        <Box justifyContent="flex-start" flexDirection="column" marginBottom={1}>
          <Box justifyContent='flex-start' marginBottom={1}>
            <Text color="gray">Select an action:</Text>
          </Box>
          <Box alignItems="center">
            <SelectInput
              items={menuItems}
              onSelect={handleMenuSelect}
              itemComponent={MenuItem}
              indicatorComponent={({ isSelected }) => (isSelected ? <Text color="yellow">👉 </Text> : <Text>  </Text>)}
            />
          </Box>
        </Box>
      )}
      {/* Persistent input box at the bottom for both name and prompt, only if menu is not active */}
      {!topic && (!menuActive || mode === 'name') && (
        <Box flexDirection="column" marginTop={2}>
          {mode === 'prompt' && lastCommand && (
            <Box marginBottom={1}>
              <Text color="white">👤: {lastCommand}</Text>
            </Box>
          )}
          <Box borderStyle="round" borderColor={'yellow'} paddingX={1}>
            <Text color={mode === 'name' ? 'yellow' : 'magenta'}>
              {mode === 'name' ? '👤 ' : '> '}
            </Text>
            <TextInput
              value={input}
              onChange={setInput}
              onSubmit={handleInputSubmit}
              placeholder={mode === 'name' ? 'Enter your name...' : 'Type your message or @path/to/file'}
              focus
            />
          </Box>
        </Box>
      )}
      {topic && (
        <Box justifyContent="center" marginTop={1}>
          <Text color="magenta">
            🚀 Preparing to teach you about {chalk.bold(topic)}...
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default WelcomeScreen;