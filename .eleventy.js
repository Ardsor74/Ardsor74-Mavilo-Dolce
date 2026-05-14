const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {

  // ── File statici: copiati invariati in _site/ ──
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("uploads");
  eleventyConfig.addPassthroughCopy("atelier.jpg");

  // Foto gallery (foto1.jpg ... foto20.jpg)
  for (let i = 1; i <= 20; i++) {
    eleventyConfig.addPassthroughCopy(`foto${i}.jpg`);
  }

  // Video (video1.mp4 ... video6.mp4)
  for (let i = 1; i <= 6; i++) {
    eleventyConfig.addPassthroughCopy(`video${i}.mp4`);
  }

  // YAML nei _data/
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

  // Collection: creazioni dal CMS (_gallery/*.md)
  eleventyConfig.addCollection("gallery", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_gallery/*.md")
      .sort((a, b) => {
        if (b.data.evidenza && !a.data.evidenza) return 1;
        if (a.data.evidenza && !b.data.evidenza) return -1;
        return new Date(b.date || 0) - new Date(a.date || 0);
      });
  });

  // Collection: stampe (_stampe/*.md)
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
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: false,
    markdownTemplateEngine: false
  };
};
