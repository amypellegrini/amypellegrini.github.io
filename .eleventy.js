module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("bundle.css");
  eleventyConfig.addPassthroughCopy("global.css");
  eleventyConfig.addPassthroughCopy("home.css");
  eleventyConfig.addPassthroughCopy("images");
};
