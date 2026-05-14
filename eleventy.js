const fs = require("fs");

module.exports = function(eleventyConfig) {
  eleventyConfig.ignores.add(".netlify/**");

  // File statici copiati in _site/
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("index.html");

  if (fs.existsSync("uploads")) {
    eleventyConfig.addPassthroughCopy("uploads");
  }

  if (fs.existsSync("atelier.jpg")) {
    eleventyConfig.addPassthroughCopy("atelier.jpg");
  }

  // Foto gallery
  for (let i = 1; i <= 20; i++) {
    const file = `foto${i}.jpg`;
    if (fs.existsSync(file)) {
      eleventyConfig.addPassthroughCopy(file);
    }
  }

  // Video
  for (let i = 1; i <= 6; i++) {
    const file = `video${i}.mp4`;
    if (fs.existsSync(file)) {
      eleventyConfig.addPassthroughCopy(file);
    }
  }

  // Collection gallery dal CMS
  eleventyConfig.addCollection("gallery", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_gallery/*.md")
      .sort((a, b) => {
        if (b.data.evidenza && !a.data.evidenza) return 1;
        if (a.data.evidenza && !b.data.evidenza) return -1;
        return new Date(b.date || 0) - new Date(a.date || 0);
      });
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: false,
    markdownTemplateEngine: false
  };
};
