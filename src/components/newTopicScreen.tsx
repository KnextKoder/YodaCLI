import { useState } from 'react';
import { Box, Text } from 'ink';
import InkTextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import SelectInput from 'ink-select-input';
import { getAIResponse } from '../funcs/AI.js';
import { decrypt } from '../funcs/crypto.js';
import { CoreMessage } from 'ai';



type Provider = 'openai' | 'google' | 'anthropic' | 'groq';

const NewTopicScreen = ({ AI }: { AI: { provider: Provider; apiKeyEnc: string }[] }) => {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState('');
  const [isYodaTyping, setIsYodaTyping] = useState(false);
  const [showProviderSelection, setShowProviderSelection] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const callAI = async (provider: Provider, currentMessages: CoreMessage[]) => {
    setIsYodaTyping(true);
    const apiKeyEnc = AI.find(ai => ai.provider === provider)?.apiKeyEnc;

    if (!apiKeyEnc) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'An API key for the selected provider, I could not find. Hrmm.' }]);
      setIsYodaTyping(false);
      return;
    }

    const apiKey = decrypt(apiKeyEnc);

    try {
      const { text } = await getAIResponse(provider, apiKey, currentMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Mmm, an error occurred: ${error.message}` }]);
    } finally {
      setIsYodaTyping(false);
    }
  };

	const handleProviderSelect = (item: { value: Provider }) => {
    setShowProviderSelection(false);
    setSelectedProvider(item.value);
    callAI(item.value, messages);
  };

  const handleSubmit = (value: string) => {
    if (value.trim() === '' || isYodaTyping) return;

    const userMessage: CoreMessage = { role: 'user', content: value };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    if (!selectedProvider) {
      setShowProviderSelection(true);
    } else {
      callAI(selectedProvider, newMessages);
    }
  };

  const MenuItem = ({ isSelected = false, label }: { isSelected?: boolean; label: string }) => (
    <Text color={isSelected ? 'yellow' : 'gray'} bold={isSelected}>
      {label}
    </Text>
  );

  return (
    <Box flexDirection="column" padding={1} width="100%">
      <Box flexDirection="column" flexGrow={1} marginBottom={1}>
        {messages.length === 0 && !isYodaTyping && (
          <Box justifyContent="center">
            <Text color="gray">There are no messages yet.</Text>
          </Box>
        )}
        {messages.map((msg, index) => (
          <Box key={index} flexDirection="column" marginBottom={1}>
            <Box>
              <Text color={msg.role === 'user' ? 'green' : 'yellow'} bold>
                {msg.role === 'user' ? 'Padawan (You)' : 'Yoda'}
              </Text>
            </Box>
            <Box marginLeft={2}>
              <Text>{String(msg.content)}</Text>
            </Box>
          </Box>
        ))}
        {isYodaTyping && (
          <Box marginLeft={2} gap={1}>
            <Spinner type="star" />
            <Text color="yellow">
              Yoda is thinking...
            </Text>
          </Box>
        )}
      </Box>
      {showProviderSelection ? (
				<Box flexDirection='column'>
					<Text>A provider, you must choose:</Text>
					<SelectInput
						items={AI.map((ai) => ({ label: ai.provider, value: ai.provider }))}
						onSelect={(item) => handleProviderSelect({ value: item.value as Provider })}
            itemComponent={MenuItem} 
            indicatorComponent={({ isSelected }) => (isSelected ? <Text color="yellow">👉 </Text> : <Text>  </Text>)}
					/>
				</Box>
			) : (
				<Box borderStyle="round" borderColor="yellow" paddingX={1}>
					<Text color="yellow">{'> '}</Text>
					<InkTextInput
						value={input}
						onChange={setInput}
						onSubmit={() => {
							handleSubmit(input);
						}}
						placeholder="Listening to you I am..."
					/>
				</Box>
			)}
    </Box>
  );
};

export default NewTopicScreen;