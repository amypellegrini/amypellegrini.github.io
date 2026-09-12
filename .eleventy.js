const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  const markdown = require("markdown-it")({ html: false, linkify: true });
  markdown.core.ruler.push("library-heading-levels", state => {
    for (const token of state.tokens) {
      if (token.type === "heading_open" || token.type === "heading_close") {
        token.tag = "h" + Math.min(6, Number(token.tag.slice(1)) + 2);
      }
    }
  });
  eleventyConfig.addFilter("skillMarkdown", value => markdown.render(value));
  eleventyConfig.addFilter("skillInline", value => markdown.renderInline(value));
  eleventyConfig.addPassthroughCopy("registry");
  eleventyConfig.addPassthroughCopy("skills");
  eleventyConfig.addPassthroughCopy("agents");
  eleventyConfig.addPassthroughCopy("library/library.css");
  eleventyConfig.addPassthroughCopy("library/library.js");
  eleventyConfig.addPassthroughCopy("global.css");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addCollection("publishedArticles", function (collectionApi) {
    return collectionApi.getFilteredByTag("articles").filter(item => !item.data.draft);
  });
};
