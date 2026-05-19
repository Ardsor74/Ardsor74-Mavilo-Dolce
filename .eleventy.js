module.exports = function(eleventyConfig) {

  // ── File statici copiati invariati in _site/ ──
  eleventyConfig.addPassthroughCopy("index.html");  // <-- FONDAMENTALE
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("uploads");
  eleventyConfig.addPassthroughCopy("atelier.jpg");

  // Foto gallery
  for (let i = 1; i <= 20; i++) {
    eleventyConfig.addPassthroughCopy(`foto${i}.jpg`);
  }

  // Video
  for (let i = 1; i <= 6; i++) {
    eleventyConfig.addPassthroughCopy(`video${i}.mp4`);
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
