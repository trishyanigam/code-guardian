import config from '../../config/env.config.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * Generate AI Code Review using OpenAI API
 *
 * @param {string} prompt - Comprehensive code review prompt text
 * @param {Object} [options] - Optional parameters (apiKey, model, maxTokens, temperature)
 * @returns {Promise<Object>} Parsed JSON review output from OpenAI
 */
export const generateReview = async (prompt, options = {}) => {
  try {
    const apiKey =
      options.apiKey ||
      process.env.OPENAI_API_KEY ||
      config?.openai?.apiKey ||
      '';

    if (!apiKey) {
      throw new ApiError(
        500,
        'OPENAI_API_KEY is missing in environment variables'
      );
    }

    const model = options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const temperature = options.temperature !== undefined ? options.temperature : 0.2;
    const maxTokens = options.maxTokens || 2500;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are Code Guardian, an expert senior AI Code Reviewer & Application Security Engineer. You MUST respond strictly in valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.error?.message || `OpenAI API returned HTTP status ${response.status}`;
      throw new ApiError(response.status || 500, `OpenAI API Error: ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new ApiError(500, 'Received empty response from OpenAI API');
    }

    // Safely parse JSON response
    try {
      return JSON.parse(content);
    } catch (parseErr) {
      const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      return JSON.parse(cleaned);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `AI Review Generation Failed: ${error.message}`);
  }
};

export default {
  generateReview,
};
