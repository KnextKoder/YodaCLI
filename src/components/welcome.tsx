import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import boxen from 'boxen';

interface WelcomeScreenProps {
  topic?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ topic }) => {
  const yodaAscii = `


██╗░░░██╗░█████╗░██████╗░░█████╗░
╚██╗░██╔╝██╔══██╗██╔══██╗██╔══██╗
░╚████╔╝░██║░░██║██║░░██║███████║
░░╚██╔╝░░██║░░██║██║░░██║██╔══██║
░░░██║░░░╚█████╔╝██████╔╝██║░░██║
░░░╚═╝░░░░╚════╝░╚═════╝░╚═╝░░╚═╝

  `;

  const welcomeMessage = topic 
    ? `Learn about ${topic}, you wish to? Wise choice, young padawan.`
    : 'Welcome, you are. Help you learn, I will. Specify a topic, you must.';

  return (
    <Box flexDirection="column" padding={1}>
      <Box justifyContent="center" marginBottom={1}>
        <Text color="green">{yodaAscii}</Text>
      </Box>
      
      <Box justifyContent="center" marginBottom={1}>
        <Text color="cyan" bold>
          🌟 YodaCLI - Learn Everything, You Will 🌟
        </Text>
      </Box>
      
      <Box justifyContent="center" marginBottom={2}>
        <Text color="yellow">
          {welcomeMessage}
        </Text>
      </Box>
      
      {!topic && (
        <Box justifyContent="center">
          <Text color="gray">
            Usage: {chalk.bold('yoda learn <topic>')} or just {chalk.bold('yoda')} for help
          </Text>
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
