import fs from "fs";
import path from "path";

export default function (eleventyConfig, options = {}) {
  const defaultConfig = {
    theme: {
      foreground: '#fff',
      background: '#000'
    }
  };

  const config = {
    ...defaultConfig,
    ...options
  };

  const blocksDir = path.resolve("src/_includes/partials/blocks/");
  const blockFiles = fs.readdirSync(blocksDir).filter((file) => file.endsWith(".njk"));

  // Map block files to sample data
  const blockData = blockFiles.map((file) => {
    const blockName = file.replace(".njk", ""); // Strip `.njk` extension
    return {
      name: blockName,
      ...config.content[blockName]
    };
  });

  // Generate the content
  const content = `
  <div class="space-y-400 bg-[${config.theme.background}]">
    <section class="pt-[calc(var(--size-900)+5rem)] text-[${config.theme.foreground}]">
      <div class="wrapper">
        <h1 class="text-center">Blocks</h1>
      </div>
    </section>

    {% for block in blocks %}
      <section class="px-400">
        <div class="p-400 space-y-400 rounded-3xl overflow-hidden bg-[#000]/10">
          <h2 class="text-700 text-center text-[${config.theme.foreground}]">{{ block.name | capitalize }}</h2>
          
          <div class="bg-[#fff]">
            {% include 'src/_includes/partials/blocks/' + block.name + '.njk' %}
          </div>
        </div>
      </section>
    {% endfor %}
  </div>
  `;

  // Add template with dynamic content
  eleventyConfig.addTemplate("blocks.njk", content, {
    layout: "layouts/default.njk",
    title: "Blocks",
    sitemapIgnore: true,
    blocks: blockData, // Pass mapped block data
  });
}