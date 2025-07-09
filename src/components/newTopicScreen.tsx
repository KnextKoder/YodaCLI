import { useState } from 'react';
import { Box, Text } from 'ink';
import InkTextInput from 'ink-text-input';
import Spinner from 'ink-spinner';

interface Message {
  sender: 'user' | 'yoda';
  text: string;
}

const NewTopicScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isYodaTyping, setIsYodaTyping] = useState(false);

  const handleSubmit = (value: string) => {
    if (value.trim() === '' || isYodaTyping) return;

    const userMessage: Message = { sender: 'user', text: value };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsYodaTyping(true);

    setTimeout(() => {
      const yodaReply: Message = { sender: 'yoda', text: `Echo: "${value}"` };
      setMessages(prevMessages => [...prevMessages, yodaReply]);
      setIsYodaTyping(false);
    }, 2000);
  };

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
              <Text color={msg.sender === 'user' ? 'green' : 'yellow'} bold>
                {msg.sender === 'user' ? 'Padawan (You)' : 'Yoda'}
              </Text>
            </Box>
            <Box marginLeft={2}>
              <Text>{msg.text}</Text>
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
      <Box borderStyle="round" borderColor='yellow' paddingX={1}>
        <Text color='yellow'>{"> "}</Text>
        <InkTextInput
          value={input}
          onChange={setInput}
          onSubmit={()=>{
            handleSubmit(input);
          }}
          placeholder="Listening to you I am..."
        />
      </Box>
    </Box>
  );
};

export default NewTopicScreen;