import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  LinearProgress,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Copy as CopyIcon,
  AutoAwesome as GrokIcon,
  Code as CodeIcon,
  RocketLaunch as LaunchIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Psychology as AIIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useApp } from '../../contexts/AppContext';
import { useSocket } from '../../contexts/SocketContext';
import { formatDistanceToNow } from 'date-fns';

const ChatInterface = () => {
  const { state, actions } = useApp();
  const { connected, sendMessage, createGrokProject, generateGrokOutline } = useSocket();
  const [input, setInput] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showSessions, setShowSessions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    actions.setCurrentPage('chat');
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.chat.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || !connected) return;

    const message = input.trim();
    setInput('');
    
    // Check for special commands
    if (message.startsWith('/grok-project ')) {
      const projectDescription = message.replace('/grok-project ', '');
      createGrokProject(projectDescription);
      return;
    }
    
    if (message.startsWith('/grok-outline ')) {
      const outlineDescription = message.replace('/grok-outline ', '');
      generateGrokOutline(outlineDescription);
      return;
    }

    // Send regular message
    sendMessage(message);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    actions.clearMessages();
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // toast.success('Message copied to clipboard');
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const isAssistant = message.role === 'assistant';

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            mb: 2,
            px: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: isSystem ? '100%' : '80%',
              display: 'flex',
              flexDirection: isUser ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            {/* Avatar */}
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: isUser 
                  ? 'primary.main' 
                  : isSystem 
                  ? 'warning.main' 
                  : 'secondary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {isUser ? 'U' : isSystem ? 'S' : 'AI'}
            </Avatar>

            {/* Message Content */}
            <Paper
              elevation={isSystem ? 0 : 2}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: isUser
                  ? 'primary.main'
                  : isSystem
                  ? 'warning.light'
                  : 'background.paper',
                color: isUser
                  ? 'primary.contrastText'
                  : isSystem
                  ? 'warning.contrastText'
                  : 'text.primary',
                border: isSystem ? 1 : 0,
                borderColor: isSystem ? 'warning.main' : 'transparent',
                position: 'relative',
                '&:hover .message-actions': {
                  opacity: 1,
                },
              }}
            >
              {/* Message Actions */}
              <Box
                className="message-actions"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleCopyMessage(message.content)}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                    color: 'inherit',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Message Type Indicator */}
              {message.type && message.type !== 'text' && (
                <Chip
                  label={message.type.toUpperCase()}
                  size="small"
                  sx={{
                    mb: 1,
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                  color={
                    message.type === 'error' ? 'error' :
                    message.type === 'code_output' ? 'info' :
                    message.type === 'outline' ? 'secondary' :
                    'default'
                  }
                />
              )}

              {/* Message Content */}
              <Box>
                {message.type === 'code_output' || message.type === 'error' ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language="bash"
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: 4,
                      fontSize: '0.875rem',
                    }}
                  >
                    {message.content}
                  </SyntaxHighlighter>
                ) : (
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: '8px 0',
                              borderRadius: 4,
                              fontSize: '0.875rem',
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                      p: ({ children }) => (
                        <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
                          {children}
                        </Typography>
                      ),
                      h1: ({ children }) => (
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {children}
                        </Typography>
                      ),
                      h2: ({ children }) => (
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                          {children}
                        </Typography>
                      ),
                      h3: ({ children }) => (
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          {children}
                        </Typography>
                      ),
                      ul: ({ children }) => (
                        <Box component="ul" sx={{ pl: 2, mb: 1 }}>
                          {children}
                        </Box>
                      ),
                      ol: ({ children }) => (
                        <Box component="ol" sx={{ pl: 2, mb: 1 }}>
                          {children}
                        </Box>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </Box>

              {/* Timestamp */}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  opacity: 0.7,
                  fontSize: '0.7rem',
                }}
              >
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </Typography>

              {/* Special Actions for Grok Messages */}
              {message.type === 'outline' && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<LaunchIcon />}
                    onClick={() => {
                      // Implement with Cursor
                      console.log('Implement with Cursor:', message.content);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Implement with Cursor
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      // Download outline
                      const blob = new Blob([message.content], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'project-outline.md';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </motion.div>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Main Chat Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 0,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
              }}
            >
              <AIIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                AI Chat Assistant
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {connected ? `Connected • ${state.models.selected}` : 'Disconnected'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Chat Sessions">
              <IconButton
                onClick={() => setShowSessions(!showSessions)}
                color={showSessions ? 'primary' : 'default'}
              >
                <HistoryIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="More options">
              <IconButton onClick={handleMenuOpen}>
                <MoreIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Connection Status */}
        {!connected && (
          <Alert severity="warning" sx={{ m: 2 }}>
            Not connected to Open Interpreter backend. Please check your connection.
          </Alert>
        )}

        {/* Quick Commands */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Quick Commands:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<GrokIcon />}
              label="/grok-project [description]"
              size="small"
              onClick={() => setInput('/grok-project ')}
              sx={{ cursor: 'pointer' }}
            />
            <Chip
              icon={<CodeIcon />}
              label="/grok-outline [description]"
              size="small"
              onClick={() => setInput('/grok-outline ')}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        </Paper>

        {/* Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            bgcolor: 'background.default',
            py: 2,
          }}
        >
          <AnimatePresence>
            {state.chat.messages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  px: 4,
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      mb: 3,
                      fontSize: '2rem',
                    }}
                  >
                    <AIIcon sx={{ fontSize: '2rem' }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Start a conversation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                    Ask me anything! I can help you generate projects, write code, 
                    explain concepts, or chat about technology.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<GrokIcon />}
                      onClick={() => setInput('/grok-project Create a modern React dashboard')}
                    >
                      Create Project
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CodeIcon />}
                      onClick={() => setInput('Help me understand React hooks')}
                    >
                      Ask Question
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            ) : (
              state.chat.messages.map(renderMessage)
            )}
          </AnimatePresence>

          {/* Typing Indicator */}
          {state.chat.isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'secondary.main',
                      fontSize: '0.875rem',
                    }}
                  >
                    AI
                  </Avatar>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        AI is typing
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 1, 2].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'text.secondary',
                              animation: 'pulse 1.5s infinite',
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 0,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Use /grok-project or /grok-outline for special commands)"
              variant="outlined"
              disabled={!connected}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Tooltip title="Send message">
                <IconButton
                  onClick={handleSend}
                  disabled={!input.trim() || !connected}
                  color="primary"
                  size="large"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '&:disabled': {
                      bgcolor: 'action.disabled',
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Chat Sessions Sidebar */}
      <Collapse
        in={showSessions}
        orientation="horizontal"
        sx={{ width: showSessions ? 300 : 0 }}
      >
        <Paper
          elevation={2}
          sx={{
            width: 300,
            height: '100%',
            borderLeft: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Chat Sessions
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <List>
              {state.chat.history.map((session, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton>
                    <ListItemText
                      primary={session.title || `Session ${index + 1}`}
                      secondary={formatDistanceToNow(new Date(session.timestamp), { addSuffix: true })}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              {state.chat.history.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No chat history"
                    secondary="Start a conversation to see your chat sessions here"
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Paper>
      </Collapse>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClearChat}>
          <ClearIcon sx={{ mr: 1 }} />
          Clear Chat
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} />
          Export Chat
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon sx={{ mr: 1 }} />
          Chat Settings
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ChatInterface;