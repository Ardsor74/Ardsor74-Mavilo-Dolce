module.exports = function(eleventyConfig) {

  // File statici copiati in _site/
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("uploads");
  eleventyConfig.addPassthroughCopy("atelier.jpg");
  eleventyConfig.addPassthroughCopy("index.html");

  // Foto gallery (9 foto)
  for (let i = 1; i <= 9; i++) {
    eleventyConfig.addPassthroughCopy(`foto${i}.jpg`);
  }

  // Video (2 video)
  for (let i = 1; i <= 2; i++) {
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
