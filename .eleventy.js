const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  // Passa tutti i file statici invariati
  eleventyConfig.addPassthroughCopy("uploads");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("atelier.jpg");
  eleventyConfig.addPassthroughCopy({ "*.mp4": "." });
  eleventyConfig.addPassthroughCopy({ "*.jpg": "." });
  eleventyConfig.addPassthroughCopy({ "*.png": "." });

  // Parsa i file YAML/Markdown del CMS
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

  // Collection gallery dal CMS
  eleventyConfig.addCollection("gallery", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_gallery/*.md")
      .sort((a, b) => {
        // In evidenza prima, poi per data decrescente
        if (b.data.evidenza && !a.data.evidenza) return 1;
        if (a.data.evidenza && !b.data.evidenza) return -1;
        return new Date(b.data.date || 0) - new Date(a.data.date || 0);
      });
  });

  // Collection stampe
  eleventyConfig.addCollection("stampe", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_stampe/*.md");
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    // Non processare questi file come template
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: false,
    markdownTemplateEngine: false
  };
};
