/**
 * Image Generation Script using Hugging Face Stable Diffusion API
 * Generates images for Duat website based on duat_visual_assets_guide.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_TOKEN = "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";
const API_BASE = "https://router.huggingface.co/hf-inference";
const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../public/images/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Generate an image using Hugging Face API
 */
async function generateImage(prompt, filename, width = 1024, height = 1024) {
  console.log(`\n🎨 Generating: ${filename}`);
  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

  try {
    const response = await fetch(`${API_BASE}/models/${MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width,
          height,
          num_inference_steps: 50,
          guidance_scale: 7.5,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, Buffer.from(buffer));

    console.log(`✅ Saved: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    throw error;
  }
}

/**
 * Image prompts from duat_visual_assets_guide.md
 */
const imagePrompts = {
  // IMAGE 1: Hero Background
  heroBackground: {
    prompt: `Abstract supply chain network visualization, dark navy blue background #0A1628, glowing teal nodes and connections #00BCD4, particles flowing along pathways, isometric perspective, subtle depth of field, professional tech aesthetic, clean modern style, nodes representing factories and warehouses connected by illuminated supply routes, minimal but sophisticated, 4K resolution, suitable for website hero background, no text, modern style`,
    filename: 'hero-background.png',
    width: 1920,
    height: 1080
  },

  // IMAGE 2: Supply Chain Flow Diagram
  supplyChainFlow: {
    prompt: `Isometric infographic showing supply chain tiers, labeled stages: Raw Materials mining extraction, Processing factory, Components manufacturing, Assembly production line, Distribution logistics, clean modern illustration style, teal and blue color scheme, white background, professional technical illustration, arrows showing flow between stages, each tier has representative icon, suitable for business presentation, no text labels, clean style`,
    width: 1920,
    height: 1080,
    filename: 'supply-chain-flow.png'
  },

  // IMAGE 3: Disruption Detection Timeline
  disruptionTimeline: {
    prompt: `Infographic timeline comparison, split screen showing two scenarios: TOP traditional methods timeline with warning symbol appearing late minimal time to react ending in red disruption burst, BOTTOM advanced platform timeline with early detection symbol appearing much earlier longer preparation time ending in green checkmark, clean modern infographic style, teal and navy blue color scheme, professional business illustration, clear visual hierarchy, no text, no photo`,
    filename: 'disruption-timeline.png',
    width: 1920,
    height: 1080
  },

  // IMAGE 4: SAR Intelligence Visualization
  sarIntelligence: {
    prompt: `Technical diagram showing satellite in space beaming radar signals to Earth, signals analyzing industrial facilities and supply chain infrastructure, data flowing into AI processing nodes, outputting to supply chain risk dashboard, clean technical illustration style, teal and navy color scheme, modern SaaS platform aesthetic, annotations showing subsurface SAR data and AI analytics engine, professional corporate style, technical style, no text`,
    filename: 'sar-intelligence.png',
    width: 1920,
    height: 1080
  },

  // IMAGE 5: CASCADE Risk Domino Effect
  cascadeRisk: {
    prompt: `Domino effect illustration showing supply chain cascade, five dominoes labeled tier 4 supplier tier 3 tier 2 tier 1 your production, first domino falling with warning symbol, subsequent dominoes showing progressive impact, clean modern infographic style, orange to red gradient showing escalating risk, professional business illustration, teal highlighted shield icon showing early detection stopping the cascade, no photo`,
    filename: 'cascade-risk.png',
    width: 1920,
    height: 1080
  },

  // IMAGE 6: Platform Dashboard Mockup
  platformDashboard: {
    prompt: `Modern SaaS platform dashboard mockup, dark mode interface, supply chain risk management analytics, heat map showing global supplier risk levels, timeline chart showing disruption predictions, KPI cards showing metrics, clean professional UI design, teal and navy color scheme, futuristic but professional aesthetic, data visualization charts and graphs, suitable for SaaS product page, modern style, no text`,
    filename: 'platform-dashboard.png',
    width: 1920,
    height: 1080
  },

  // Alternative Hero Background (static version)
  heroBackgroundAlt: {
    prompt: `Minimalist supply chain network illustration, dark blue gradient background, geometric nodes and lines forming interconnected web, glowing points of light, sense of depth and dimension, professional corporate style, suitable for SaaS platform hero section, no text, modern clean aesthetic`,
    filename: 'hero-background-alt.png',
    width: 1920,
    height: 1080
  },

  // Reactive vs Proactive comparison
  reactiveVsProactive: {
    prompt: `Split-screen infographic comparing two business scenarios: LEFT SIDE reactive management chaotic scene with fire-fighting red alert symbols broken supply chain links stressed businessman increasing cost charts inventory pile-ups, RIGHT SIDE proactive management calm organized scene green checkmarks smooth supply chain flow confident executive decreasing cost charts optimized inventory, professional business illustration style, teal and navy color scheme, clean modern infographic design, no photo, no text`,
    filename: 'reactive-vs-proactive.png',
    width: 1920,
    height: 1080
  }
};

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Duat Image Generation');
  console.log('📁 Output directory:', outputDir);
  console.log('🎯 Generating images for landing page...\n');

  // Generate images for landing page first
  const landingPageImages = [
    'heroBackground',
    'supplyChainFlow',
    'disruptionTimeline',
    'sarIntelligence'
  ];

  for (const key of landingPageImages) {
    const imageConfig = imagePrompts[key];
    try {
      await generateImage(
        imageConfig.prompt,
        imageConfig.filename,
        imageConfig.width,
        imageConfig.height
      );

      // Add delay to avoid rate limiting
      console.log('⏳ Waiting 3 seconds before next generation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Failed to generate ${key}:`, error);
    }
  }

  console.log('\n✨ Landing page image generation complete!');
  console.log(`📂 Images saved to: ${outputDir}`);
}

// Run the script
main().catch(console.error);
