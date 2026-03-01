const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy("global.css");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addCollection("publishedArticles", function (collectionApi) {
    return collectionApi.getFilteredByTag("articles").filter(item => !item.data.draft);
  });
};
