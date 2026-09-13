module.exports = function(eleventyConfig) {

  // ── File statici copiati invariati in _site/ ──
  eleventyConfig.addPassthroughCopy("index.html");  // <-- FONDAMENTALE
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("uploads");
  eleventyConfig.addPassthroughCopy("atelier.jpg");
  eleventyConfig.addPassthroughCopy("logo-mavilo-dolce.png");
  eleventyConfig.addPassthroughCopy("preview-nuovo-sito.html");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("google35da35e9160079eb.html");
  eleventyConfig.addPassthroughCopy("grazie.html");
  eleventyConfig.addPassthroughCopy("stampa-biglietti.html");
  eleventyConfig.addPassthroughCopy("qr-grazie.svg");

  // Video (solo quelli effettivamente presenti)
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
