/**
 * Gemini AI Chatbot
 *
 * Features:
 * - Real-time AI responses via Google Gemini API
 * - Intelligent mock responses when API unavailable
 * - Chat history persistence in localStorage
 * - Smooth UI interactions
 * - Error handling and fallbacks
 *
 * @author MysticAura Theme
 * @version 1.0.0
 */
(function () {
  'use strict';

  // Gemini API endpoint - using gemini-1.5-flash (available model)
  // Alternative: gemini-1.5-pro for more advanced responses
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  // Get API key from theme settings or use default
  function getApiKey() {
    // Check if settings are available
    if (window.chatbotSettings && window.chatbotSettings.geminiApiKey) {
      const key = window.chatbotSettings.geminiApiKey.trim();
      if (key && key !== '') {
        return key;
      }
    }
    // Fallback to default key
    return 'AIzaSyAZuJeTUJDxWzkAWQY8FvHj1CElRNuT4Tw';
  }

  const API_KEY = getApiKey();

  // Mock responses if API key not set
  const MOCK_RESPONSES = {
    hello: 'Hello! How can I help you today?',
    hi: 'Hi there! What can I do for you?',
    help: "I'm here to help! You can ask me about our products, shipping, returns, or anything else.",
    products:
      'We have amazing spiritual products including 7 Horses on Raw Pyrite Frame and Dhan Yog Bracelet. Would you like to know more?',
    shipping: 'We offer fast and secure shipping worldwide. Standard shipping takes 5-7 business days.',
    return: "We have a 30-day return policy. If you're not satisfied, you can return your purchase.",
    price: 'Please check our product pages for current pricing. All prices are listed there.',
    about:
      'MysticAura is a spiritual products store offering authentic items like 7 Horses on Raw Pyrite Frame and Dhan Yog Bracelet. We bring positive energy and prosperity into your life.',
    store:
      'MysticAura is a spiritual products store offering authentic items like 7 Horses on Raw Pyrite Frame and Dhan Yog Bracelet. We bring positive energy and prosperity into your life.',
    more: 'MysticAura is a spiritual products store offering authentic items like 7 Horses on Raw Pyrite Frame and Dhan Yog Bracelet. We bring positive energy and prosperity into your life.',
    tell: 'MysticAura is a spiritual products store offering authentic items like 7 Horses on Raw Pyrite Frame and Dhan Yog Bracelet. We bring positive energy and prosperity into your life.',
    offers:
      'We currently have special offers on our spiritual products! Check out our 7 Horses on Raw Pyrite Frame and Dhan Yog Bracelet for amazing deals. Visit our product pages for current promotions.',
    discount:
      'We have special discounts available! Check our product pages for current offers on 7 Horses on Raw Pyrite Frame and Dhan Yog Bracelet.',
    sale: 'We have special sales running! Check our product pages for current offers on 7 Horses on Raw Pyrite Frame and Dhan Yog Bracelet.',
    date: "I'm a chatbot assistant and don't have access to the current date. Please check your device or calendar for today's date.",
    today:
      "I'm a chatbot assistant and don't have access to the current date. Please check your device or calendar for today's date.",
    default: "Thank you for your message! I'm here to help. Could you provide more details?",
  };

  function initChatbot() {
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
      const toggleBtn = document.getElementById('chatbot-toggle');
      const closeBtn = document.getElementById('chatbot-close');
      const chatWindow = document.getElementById('chatbot-window');
      const sendBtn = document.getElementById('chatbot-send');
      const input = document.getElementById('chatbot-input');
      const messages = document.getElementById('chatbot-messages');

      // Check if elements exist
      if (!toggleBtn || !chatWindow) {
        console.error('Chatbot elements not found');
        return;
      }

      // Load chat history (but don't clear welcome message if no history)
      loadChatHistory();

      // Debug: Log that chatbot initialized
      console.log('Chatbot initialized successfully');

      // Toggle chat window
      toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
          input?.focus();
        }
      });

      // Close chat window
      if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          chatWindow.classList.remove('active');
        });
      }

      // Send message on button click
      if (sendBtn) {
        sendBtn.addEventListener('click', function (e) {
          e.preventDefault();
          sendMessage();
        });
      }

      // Send message on Enter key
      if (input) {
        input.addEventListener('keypress', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
          }
        });
      }

      function sendMessage() {
        if (!input || !messages) {
          console.error('Input or messages element not found');
          return;
        }

        const userMessage = input.value.trim();
        if (!userMessage) return;

        console.log('Sending message:', userMessage);

        // Display user message
        addMessage(userMessage, 'user');
        input.value = '';

        // Show typing indicator
        const typingId = showTypingIndicator();

        // Get bot response
        getBotResponse(userMessage)
          .then((botResponse) => {
            console.log('Bot response received:', botResponse);
            console.log('Response type:', typeof botResponse);
            console.log('Response length:', botResponse ? botResponse.length : 0);

            if (!botResponse || botResponse.trim() === '') {
              console.error('Empty bot response received');
              botResponse = "Sorry, I didn't get a response. Please try again.";
            }

            removeTypingIndicator(typingId);
            addMessage(botResponse, 'bot');
            saveChatHistory();
          })
          .catch((error) => {
            console.error('Error getting bot response:', error);
            console.error('Error stack:', error.stack);
            removeTypingIndicator(typingId);
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
          });
      }

      function addMessage(text, type) {
        if (!messages) {
          console.error('Messages container not found');
          return;
        }

        if (!text || text.trim() === '') {
          console.warn('Empty message text, skipping');
          return;
        }

        console.log('Adding message:', type, text.substring(0, 50));

        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message chatbot-message-${type}`;
        messageDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
      }

      function showTypingIndicator() {
        if (!messages) return null;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message chatbot-message-bot typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<p>...</p>';
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
        return 'typing-indicator';
      }

      function removeTypingIndicator(id) {
        const indicator = document.getElementById(id);
        if (indicator) {
          indicator.remove();
        }
      }

      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
    }, 100);
  }

  async function getBotResponse(userMessage) {
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
      return 'Please provide a valid message.';
    }

    const currentApiKey = getApiKey();
    console.log('Getting bot response for:', userMessage);
    console.log('API Key:', currentApiKey ? currentApiKey.substring(0, 10) + '...' : 'Not set');

    // Try Gemini API first if API key is available
    if (currentApiKey && currentApiKey !== 'YOUR_API_KEY' && currentApiKey.trim() !== '') {
      try {
        console.log('Calling Gemini API...');
        const response = await fetch(`${GEMINI_API_URL}?key=${currentApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a helpful assistant for MysticAura, a spiritual products store specializing in authentic spiritual items. Our products include: 7 Horses on Raw Pyrite Frame and Dhan Yog Bracelet. Be friendly, helpful, and provide accurate information about our store and products. User message: ${userMessage}`,
                  },
                ],
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API error:', response.status, errorText);
          // Try to parse error for better message
          try {
            const errorData = JSON.parse(errorText);
            console.error('Error details:', errorData);
          } catch (e) {
            // Ignore parse error
          }
          // Fall back to mock only if API fails
          console.log('Falling back to mock response');
          return getMockResponse(userMessage);
        }

        const data = await response.json();
        console.log('Gemini API response received');

        const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!botText || botText.trim() === '') {
          console.warn('Empty response from Gemini, using mock');
          return getMockResponse(userMessage);
        }

        console.log('Using Gemini API response');
        return botText.trim();
      } catch (error) {
        console.error('Gemini API request failed:', error);
        // Fall back to mock only on network/parsing errors
        return getMockResponse(userMessage);
      }
    }

    // Use mock responses only if no API key
    console.log('No API key, using mock response');
    return getMockResponse(userMessage);
  }

  function getMockResponse(userMessage) {
    if (!userMessage || typeof userMessage !== 'string') {
      return MOCK_RESPONSES.default;
    }

    const lowerMessage = userMessage.toLowerCase().trim();
    console.log('Getting mock response for:', lowerMessage);

    // Check for exact matches first
    if (MOCK_RESPONSES[lowerMessage]) {
      console.log('Found exact match:', lowerMessage);
      return MOCK_RESPONSES[lowerMessage];
    }

    // Simple keyword matching - check if message contains any keyword
    // Priority order: longer/more specific keywords first
    const keywords = [
      'offers',
      'discount',
      'sale',
      'products',
      'shipping',
      'return',
      'price',
      'about',
      'store',
      'more',
      'tell',
      'date',
      'today',
      'help',
      'hello',
      'hi',
    ];

    // Check each keyword (in priority order)
    for (const keyword of keywords) {
      // Use word boundary to match whole words only
      const regex = new RegExp('\\b' + keyword + '\\b', 'i');
      if (regex.test(lowerMessage) && MOCK_RESPONSES[keyword]) {
        console.log('Found keyword match:', keyword);
        return MOCK_RESPONSES[keyword];
      }
    }

    // Fallback to default
    console.log('Using default response');
    return MOCK_RESPONSES.default;
  }

  function saveChatHistory() {
    const messages = document.getElementById('chatbot-messages');
    if (messages) {
      const history = Array.from(messages.children)
        .filter((msg) => !msg.id || msg.id !== 'typing-indicator')
        .map((msg) => ({
          text: msg.querySelector('p')?.textContent || '',
          type: msg.classList.contains('chatbot-message-user') ? 'user' : 'bot',
        }));
      localStorage.setItem('chatbot-history', JSON.stringify(history));
    }
  }

  function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('chatbot-history') || '[]');
    const messages = document.getElementById('chatbot-messages');

    // Only load history if there are saved messages
    // Don't clear the welcome message if no history exists
    if (history.length > 0 && messages) {
      // Clear all messages including welcome message
      messages.innerHTML = '';

      // Load history
      history.forEach((item) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message chatbot-message-${item.type}`;
        messageDiv.innerHTML = `<p>${escapeHtml(item.text)}</p>`;
        messages.appendChild(messageDiv);
      });
    }
    // If no history, keep the welcome message that's already in the HTML
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize chatbot when DOM is ready
  function initialize() {
    // Check if chatbot container exists
    const chatbotContainer = document.querySelector('.chatbot-container');
    if (!chatbotContainer) {
      console.warn('Chatbot container not found. Make sure chatbot is enabled in theme settings.');
      return;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
      initChatbot();
    }
  }

  // Start initialization
  initialize();
})();
