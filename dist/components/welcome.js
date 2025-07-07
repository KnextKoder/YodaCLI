import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import Conf from 'conf';
import boxen from 'boxen';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
const WelcomeScreen = ({ topic }) => {
    const config = new Conf({ projectName: 'yoda-cli' });
    const hasRunBefore = config.get('hasRunBefore');
    const userName = config.get('userName');
    const [input, setInput] = useState('');
    const [lastCommand, setLastCommand] = useState(null);
    const [mode, setState] = useState(!hasRunBefore ? 'name' : 'prompt');
    const [menuActive, setMenuActive] = useState(true);
    useEffect(() => {
        if (!hasRunBefore) {
            setState('name');
        }
        else {
            setState('prompt');
        }
    }, [hasRunBefore]);
    const handleInputSubmit = (value) => {
        if (mode === 'name') {
            if (value.trim()) {
                config.set('userName', value.trim());
                config.set('hasRunBefore', true);
                setState('prompt');
                setInput('');
            }
        }
        else {
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
    const handleMenuSelect = (item) => {
        setLastCommand(item.label);
        setMenuActive(false);
        // You can add logic here to handle each menu action and set mode as needed
        // For example, if item.value === 'learn', setMode('input')
        if (item.value === 'exit') {
            process.exit(0);
        }
    };
    // Custom menu item for colored menu
    const MenuItem = ({ isSelected = false, label }) => (_jsx(Text, { color: isSelected ? 'yellow' : 'gray', bold: isSelected, children: label }));
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsx(Box, { justifyContent: "flex-start", marginBottom: 1, children: _jsx(Text, { color: "yellow", children: yodaAscii }) }), _jsx(Box, { justifyContent: "flex-start", marginBottom: 2, children: _jsx(Text, { color: "yellow", children: welcomeMessage }) }), !userName && mode === 'name' && (_jsx(Box, { justifyContent: "flex-start", marginBottom: 1, children: _jsx(Text, { color: "yellow", children: boxen(`🌟 Welcome, you are. Help you learn, I shall.\nBut tell me your name you must, young one:`, {
                        padding: 1,
                        borderColor: 'yellow',
                        borderStyle: 'round',
                        backgroundColor: 'black',
                        title: 'Yoda Asks',
                        titleAlignment: 'center',
                    }) }) })), !userName && mode === 'name' && lastCommand && (_jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsx(Text, { color: "red", children: "Please enter a valid name." }) })), !topic && mode === 'prompt' && menuActive && (_jsxs(Box, { justifyContent: "flex-start", flexDirection: "column", marginBottom: 1, children: [_jsx(Box, { justifyContent: 'flex-start', marginBottom: 1, children: _jsx(Text, { color: "gray", children: "Select an action:" }) }), _jsx(Box, { alignItems: "center", children: _jsx(SelectInput, { items: menuItems, onSelect: handleMenuSelect, itemComponent: MenuItem, indicatorComponent: ({ isSelected }) => (isSelected ? _jsx(Text, { color: "yellow", children: "\uD83D\uDC49 " }) : _jsx(Text, { children: "  " })) }) })] })), !topic && (!menuActive || mode === 'name') && (_jsxs(Box, { flexDirection: "column", marginTop: 2, children: [mode === 'prompt' && lastCommand && (_jsx(Box, { marginBottom: 1, children: _jsxs(Text, { color: "white", children: ["\uD83D\uDC64: ", lastCommand] }) })), _jsxs(Box, { borderStyle: "round", borderColor: 'yellow', paddingX: 1, children: [_jsx(Text, { color: mode === 'name' ? 'yellow' : 'magenta', children: mode === 'name' ? '👤 ' : '> ' }), _jsx(TextInput, { value: input, onChange: setInput, onSubmit: handleInputSubmit, placeholder: mode === 'name' ? 'Enter your name...' : 'Type your message or @path/to/file', focus: true })] })] })), topic && (_jsx(Box, { justifyContent: "center", marginTop: 1, children: _jsxs(Text, { color: "magenta", children: ["\uD83D\uDE80 Preparing to teach you about ", chalk.bold(topic), "..."] }) }))] }));
};
export default WelcomeScreen;
//# sourceMappingURL=welcome.js.map