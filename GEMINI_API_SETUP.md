# 🔑 Gemini API Key Setup Guide

## ⚠️ IMPORTANT: Security Best Practice

**DO NOT** add your API key directly in code files. Always use Shopify theme settings to store sensitive information like API keys.

---

## 📝 How to Add Your Gemini API Key

### Step 1: Upload Theme to Shopify
```bash
shopify theme push --development --store=YOUR-STORE.myshopify.com
```

### Step 2: Access Theme Settings
1. Go to **Shopify Admin**
2. Navigate to: **Online Store** → **Themes**
3. Click **"Customize"** on your MysticAura theme

### Step 3: Add API Key
1. In the theme customizer, look for **"Theme Settings"** (usually at the bottom left)
2. Click on **"Theme Settings"**
3. Find the **"Chatbot"** section
4. Paste your API key in the **"Gemini API Key"** field:
   ```
   AIzaSyAZuJeTUJDxWzkAWQY8FvHj1CElRNuT4Tw
   ```
5. Make sure **"Enable Chatbot"** is checked ✅
6. Click **"Save"**

### Step 4: Test Chatbot
1. Go to your storefront
2. Look for the chatbot button in the bottom-right corner
3. Click it to open the chat window
4. Type a message and test if Gemini API responds

---

## 🔒 Security Notes

✅ **Correct Way (Current Implementation):**
- API key stored in Shopify theme settings
- Accessed via `settings.gemini_api_key` in Liquid
- Passed to JavaScript securely
- Never exposed in source code

❌ **Wrong Way (Don't Do This):**
- Hardcoding API key in `.js` files
- Committing API key to Git
- Exposing API key in HTML source

---

## 🧪 Testing

### Without API Key:
- Chatbot uses intelligent mock responses
- Works perfectly for demonstration
- No API calls made

### With API Key:
- Chatbot uses real Gemini AI
- More intelligent, contextual responses
- Real-time AI conversation

---

## 📍 Where API Key is Used

1. **Storage:** `config/settings_schema.json` (setting definition)
2. **Access:** `layout/theme.liquid` (passes to JavaScript)
3. **Usage:** `assets/chatbot.js` (makes API calls)

**Current Code Flow:**
```
Shopify Settings → Liquid Template → JavaScript → Gemini API
```

---

## ✅ Your API Key is Ready!

Once you add it in Shopify theme settings, the chatbot will automatically use it. No code changes needed!

---

## 🐛 Troubleshooting

**Chatbot not using API?**
- Check API key is saved in theme settings
- Verify "Enable Chatbot" is checked
- Check browser console for errors
- Make sure API key is correct (no extra spaces)

**API errors?**
- Verify API key is valid
- Check Gemini API quota/limits
- Ensure API key has proper permissions

