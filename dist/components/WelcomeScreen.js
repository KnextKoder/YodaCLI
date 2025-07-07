import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import chalk from 'chalk';
const WelcomeScreen = ({ topic }) => {
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
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsx(Text, { color: "green", children: yodaAscii }) }), _jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsx(Text, { color: "cyan", bold: true, children: "\uD83C\uDF1F YodaCLI - Learn Everything, You Will \uD83C\uDF1F" }) }), _jsx(Box, { justifyContent: "center", marginBottom: 2, children: _jsx(Text, { color: "yellow", children: welcomeMessage }) }), !topic && (_jsx(Box, { justifyContent: "center", children: _jsxs(Text, { color: "gray", children: ["Usage: ", chalk.bold('yoda learn <topic>'), " or just ", chalk.bold('yoda'), " for help"] }) })), topic && (_jsx(Box, { justifyContent: "center", marginTop: 1, children: _jsxs(Text, { color: "magenta", children: ["\uD83D\uDE80 Preparing to teach you about ", chalk.bold(topic), "..."] }) }))] }));
};
export default WelcomeScreen;
//# sourceMappingURL=WelcomeScreen.js.map