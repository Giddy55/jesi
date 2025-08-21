import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context } = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Perplexity API key from Supabase secrets
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
    
    if (!perplexityApiKey) {
      console.warn('Perplexity API key not found, using fallback response')
      
      // Fallback educational responses
      const fallbackResponses = [
        `Great question! ${message.includes('math') || message.includes('number') ? 'Math can be fun when you break it down step by step. What specific part would you like me to explain?' : message.includes('science') ? 'Science is all about discovering how things work! What would you like to explore?' : message.includes('read') || message.includes('write') ? 'Reading and writing help us share ideas! What are you working on?' : 'Learning is an adventure! Tell me more about what you\'re curious about.'} 🌟`,
        `I love helping with learning! ${message.includes('help') ? 'I\'m here to guide you through any topic step by step.' : message.includes('difficult') || message.includes('hard') ? 'Don\'t worry, every expert was once a beginner. We can tackle this together!' : message.includes('practice') ? 'Practice makes progress! What would you like to work on?' : 'What specific topic can I help you understand better?'} 💪`,
        `That's a smart question! ${message.includes('why') ? 'Asking "why" shows you\'re thinking deeply. Here\'s how I\'d explain it...' : message.includes('how') ? 'Great "how" question! Let me break this down for you...' : message.includes('what') ? 'Good question! Let me help you understand this concept...' : 'I can see you\'re really thinking about this!'} 🧠`,
      ]
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      
      return new Response(
        JSON.stringify({ response: randomResponse }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Call Perplexity API
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: context || 'You are Jesi AI, a friendly and helpful learning assistant for students. Keep responses simple, encouraging, and educational. Use emojis appropriately and maintain an enthusiastic but supportive tone.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 500,
        return_images: false,
        return_related_questions: false,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    })

    if (!perplexityResponse.ok) {
      throw new Error(`Perplexity API error: ${perplexityResponse.status}`)
    }

    const data = await perplexityResponse.json()
    const aiResponse = data.choices?.[0]?.message?.content || "I'm here to help! Can you tell me more about what you're learning?"

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Chat function error:', error)
    
    // Return helpful fallback response even on error
    return new Response(
      JSON.stringify({ 
        response: "I'm having trouble connecting right now, but I'm still here to help! Can you try asking your question in a different way? 🤖✨" 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

/* To use this function, you need to add your Perplexity API key to your Supabase project secrets:
 * 1. Go to your Supabase project dashboard
 * 2. Navigate to Settings > Edge Functions
 * 3. Add a new secret with the key: PERPLEXITY_API_KEY
 * 4. Set the value to your Perplexity API key
 */