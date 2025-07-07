import React, { useState } from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import Conf from 'conf';
import boxen from 'boxen';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import crypto from 'crypto';

interface WelcomeScreenProps {
  topic?: string;
}

// --- Simple encryption helpers ---
const ENCRYPTION_KEY = crypto.createHash('sha256').update('yoda-cli-secret').digest(); // 32 bytes
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
}

function decrypt(text: string): string {
  const [ivBase64, encrypted] = text.split(':');
  if (!ivBase64 || !encrypted) return '';
  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const config = new Conf<{ hasRunBefore: boolean; userName?: string; apiKeys?: { provider: string; apiKeyEnc: string }[] }>({ projectName: 'yoda-cli' });
const hasRunBefore = config.get('hasRunBefore');
const userName = config.get('userName');
const storedApiKeys = config.get('apiKeys') || [];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ topic }) => {
  const [input, setInput] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [mode, setMode] = useState<'provider' | 'apiKey' | 'name' | 'prompt'>(storedApiKeys.length === 0 ? 'provider' : !hasRunBefore ? 'name' : 'prompt');
  const [menuActive, setMenuActive] = useState(true);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(storedApiKeys.length > 0 ? storedApiKeys[0].provider : null);

  // Decrypt API key for the currently selected provider only when needed
  const apiKey = selectedProvider ? storedApiKeys.find(key => key.provider === selectedProvider)?.apiKeyEnc : undefined;
  const decryptedApiKey = apiKey ? decrypt(apiKey) : undefined;

  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // Simple API key validation by provider
  function validateApiKey(key: string, provider: string | null): string | null {
    if (!key.trim()) return 'API key cannot be empty.';
    if (!provider) return 'No provider selected.';
    if (provider === 'openai') {
      if (!key.startsWith('sk-') || key.length < 40) return 'OpenAI keys start with sk- and are at least 40 characters.';
    } else if (provider === 'google') {
      if (key.length < 30) return 'Google API keys are at least 30 characters.';
    } else if (provider === 'anthropic') {
      if (!key.startsWith('sk-ant-') || key.length < 40) return 'Anthropic keys start with sk-ant- and are at least 40 characters.';
    } else if (provider === 'groq') {
      if (!key.startsWith('gsk_') || key.length < 30) return 'Groq keys start with gsk_ and are at least 30 characters.';
    }
    return null;
  }

  const handleInputSubmit = (value: string) => {
    if (mode === 'name') {
      if (value.trim()) {
        config.set('userName', value.trim());
        config.set('hasRunBefore', true);
        setMode('prompt');
        setInput('');
      }
    } else if (mode === 'apiKey') {
      if (selectedProvider) {
        const validationError = validateApiKey(value.trim(), selectedProvider);
        if (validationError) {
          setApiKeyError(validationError);
          return;
        }
        // Encrypt API key before saving
        const apiKeyEnc = encrypt(value.trim());
        const existingKeyIndex = storedApiKeys.findIndex(key => key.provider === selectedProvider);
        if (existingKeyIndex !== -1) {
          // Update existing key
          storedApiKeys[existingKeyIndex].apiKeyEnc = apiKeyEnc;
        } else {
          // Add new key
          storedApiKeys.push({ provider: selectedProvider, apiKeyEnc });
        }
        config.set('apiKeys', storedApiKeys);
        setMode(!hasRunBefore ? 'name' : 'prompt');
        setApiKeyInput('');
        setApiKeyError(null);
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

  const providerItems = [
    { label: 'OpenAI', value: 'openai' },
    { label: 'Google', value: 'google' },
    { label: 'Anthropic', value: 'anthropic' },
    { label: 'Groq', value: 'groq' },
    { label: 'Exit', value: 'exit' },
  ];

  const handleProviderSelect = (item: { value: string }) => {
    if (item.value === 'exit') {
      process.exit(0);
    }
    setSelectedProvider(item.value);
    // Check if API key for selected provider exists and pre-fill input
    const existingKey = storedApiKeys.find(key => key.provider === item.value);
    if (existingKey) {
      setApiKeyInput(decrypt(existingKey.apiKeyEnc));
    } else {
      setApiKeyInput('');
    }
    setMode('apiKey');
  };

  const menuItems = [
    { label: 'Learn a new topic', value: 'learn' },
    { label: 'Continue previous topic', value: 'continue' }, // TODO: Implement continue logic
    { label: 'Change API Provider', value: 'provider' },
    { label: 'Exit', value: 'exit' },
  ];

  const handleMenuSelect = (item: { label: string; value: string }) => {
    setLastCommand(item.label);
    setMenuActive(false);
    if (item.value === 'exit') {
      process.exit(0);
    } else if (item.value === 'provider') {
      setMode('provider');
    } else if (item.value === 'learn') {
      // TODO: Implement learn logic
      setMode('prompt'); // Temporarily go to prompt mode for input
    } else if (item.value === 'continue') {
      // TODO: Implement continue logic
      setMode('prompt'); // Temporarily go to prompt mode for input
    }
  };

  const MenuItem = ({ isSelected = false, label }: { isSelected?: boolean; label: string }) => (
    <Text color={isSelected ? 'yellow' : 'gray'} bold={isSelected}>
      {label}
    </Text>
  );

  if (mode === 'provider') {
    return (
      <Box flexDirection="column" padding={1}>
        <Box justifyContent="flex-start" marginBottom={1}>
          <Text color="yellow">{yodaAscii}</Text>
        </Box>
        <Box justifyContent='flex-start' marginBottom={1}>
          <Text color="gray">A provider, you must choose:</Text>
        </Box>
        <SelectInput
          items={providerItems}
          onSelect={handleProviderSelect}
          itemComponent={MenuItem}
          indicatorComponent={({ isSelected }) => (isSelected ? <Text color="yellow">👉 </Text> : <Text>  </Text>)}
        />
      </Box>
    );
  }

  if (mode === 'apiKey') {
    return (
      <Box flexDirection="column" padding={1}>
        <Box justifyContent="flex-start" marginBottom={1}>
          <Text color="yellow">{yodaAscii}</Text>
        </Box>
        <Box justifyContent="flex-start" marginBottom={2}>
          <Text color="yellow">
            {boxen(
              `For ${selectedProvider}, an API key you need. To learn, you must provide one.\n\n` +
              `⚠️  Your API key will be stored encrypted on disk, but may still be accessible to someone with access to your files.\n` +
              `For maximum security, use a dedicated key and rotate it regularly.`,
              {
                padding: 1,
                borderColor: 'yellow',
                borderStyle: 'round',
                backgroundColor: 'black',
                title: 'Yoda Requires',
                titleAlignment: 'center',
              }
            )}
          </Text>
        </Box>
        {apiKeyError && (
          <Box marginBottom={1}>
            <Text color="red">{apiKeyError}</Text>
          </Box>
        )}
        <Box flexDirection="column" marginTop={2}>
          <Box borderStyle="round" borderColor={'yellow'} paddingX={1}>
            <Text color={'magenta'}>{'> '}</Text>
            <TextInput
              value={apiKeyInput}
              onChange={setApiKeyInput}
              onSubmit={() => handleInputSubmit(apiKeyInput)}
              placeholder={'Enter your API key...'}
              focus
              mask="*"
            />
          </Box>
          <Box marginTop={1}>
            <Text color="gray">Press Enter to submit, or Ctrl+C to quit.</Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box justifyContent="flex-start" marginBottom={1}>
        <Text color="yellow">{yodaAscii}</Text>
      </Box>
      <Box justifyContent="flex-start" marginBottom={2}>
        <Text color="yellow">{welcomeMessage}</Text>
      </Box>
      {!userName && mode === 'name' && (
        <Box justifyContent="flex-start" marginBottom={1}>
          <Text color="yellow">
            {boxen(
              `🌟 Welcome, you are. Help you learn, I shall.\nBut your name I know not, young one:`,
              {
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
              placeholder={mode === 'name' ? 'Enter your name...' : 'Type your message'}
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
