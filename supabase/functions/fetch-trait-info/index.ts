
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trait } = await req.json();
    
    if (!trait) {
      throw new Error('No trait provided');
    }

    // Build a search query for the trait
    const query = `${trait} neurodivergent trait description`;
    
    // Make a request to a search API or website to get information
    // This is a simple implementation that fetches from DuckDuckGo
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    // Process the search results to extract relevant information
    let description = '';
    let source = '';
    
    // If we have relevant information in the search results
    if (searchData.AbstractText && searchData.AbstractText.length > 10) {
      description = searchData.AbstractText;
      source = searchData.AbstractSource || searchData.AbstractURL || '';
    } else {
      // Fallback descriptions for common neurodivergent traits
      const fallbackDescriptions = {
        "ADHD": {
          description: "Attention-deficit/hyperactivity disorder is a neurodevelopmental condition characterized by difficulty focusing, hyperactivity, and impulsivity. It affects executive function and can present differently across individuals. Many with ADHD also experience hyperfocus on topics of interest.",
          source: "https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd"
        },
        "Autism": {
          description: "Autism Spectrum Disorder affects how people communicate and interact with others. It includes a range of strengths and challenges in social skills, repetitive behaviors, speech and nonverbal communication. Many autistic individuals have exceptional abilities in visual, music and academic skills.",
          source: "https://www.autismspeaks.org/what-autism"
        },
        "Dyslexia": {
          description: "Dyslexia is a learning disorder affecting reading ability due to problems identifying speech sounds and learning how they relate to letters and words. Despite normal intelligence, people with dyslexia often have exceptional problem-solving and creative thinking skills.",
          source: "https://www.mayoclinic.org/diseases-conditions/dyslexia/symptoms-causes/syc-20353552"
        },
        "Hyperfocus": {
          description: "Hyperfocus is an intense form of mental concentration or visualization where a person becomes completely immersed in a task. Common in ADHD and autism, it allows exceptional productivity and creativity when engaged with topics of interest, though it can make switching tasks difficult.",
          source: "https://www.additudemag.com/understanding-adhd-hyperfocus/"
        },
        "Sensory Sensitivity": {
          description: "Sensory sensitivity involves heightened reactivity to sensory stimuli like sounds, lights, textures, or smells. It's common in autism and ADHD. While it can cause discomfort in overstimulating environments, it can also enable enhanced perception and attention to detail.",
          source: "https://www.autism.org.uk/advice-and-guidance/topics/sensory-differences/sensory-differences/all-audiences"
        },
        "Dyscalculia": {
          description: "Dyscalculia is a learning disability that affects a person's ability to understand number-related concepts, perform accurate math calculations, and reason with numbers. People with dyscalculia often have strong creative thinking and verbal skills.",
          source: "https://www.understood.org/en/learning-thinking-differences/child-learning-disabilities/dyscalculia/what-is-dyscalculia"
        },
        "Dyspraxia": {
          description: "Dyspraxia (Developmental Coordination Disorder) affects physical coordination and motor skills. It can impact fine motor control, balance, and spatial awareness. Many with dyspraxia develop strong problem-solving, creative thinking, and verbal communication skills.",
          source: "https://dyspraxiafoundation.org.uk/about-dyspraxia/"
        },
        "Pattern Recognition": {
          description: "Enhanced pattern recognition is common in many neurodivergent conditions. It allows individuals to detect patterns, connections, and details others might miss. This ability can translate to strengths in mathematics, music, art, programming, and problem-solving.",
          source: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4635484/"
        },
        "Creative Thinking": {
          description: "Many neurodivergent individuals exhibit exceptional creative thinking abilities. They often approach problems from unique perspectives, make unexpected connections between ideas, and generate innovative solutions that may not be apparent to neurotypical thinkers.",
          source: "https://www.frontiersin.org/articles/10.3389/fpsyg.2018.01750/full"
        },
        "Hyperlexia": {
          description: "Hyperlexia is characterized by an intense early interest in letters and words and an advanced reading ability. Often associated with autism, it involves exceptional word recognition skills, though reading comprehension may develop at a different pace.",
          source: "https://www.readandspell.com/us/hyperlexia"
        },
        "Synesthesia": {
          description: "Synesthesia is a perceptual phenomenon where stimulation of one sense triggers automatic, involuntary experiences in another sense. For example, seeing colors when hearing music or associating numbers with specific colors. It's more common in autistic and neurodivergent individuals.",
          source: "https://www.psychologytoday.com/us/basics/synesthesia"
        }
      };

      // Check if we have a fallback for this trait
      const lowercaseTrait = trait.toLowerCase();
      for (const [key, value] of Object.entries(fallbackDescriptions)) {
        if (key.toLowerCase() === lowercaseTrait) {
          description = value.description;
          source = value.source;
          break;
        }
      }

      // If no fallback is found, provide a generic response
      if (!description) {
        description = `${trait} is a neurodivergent characteristic that affects how individuals process information and interact with the world. Each person experiences this trait differently, with potential benefits and challenges that vary by individual and context.`;
        source = "https://www.understood.org/";
      }
    }

    return new Response(
      JSON.stringify({
        description,
        source
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fetch-trait-info function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
