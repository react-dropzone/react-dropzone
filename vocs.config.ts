import {defineConfig} from "vocs/config";

export default defineConfig({
  srcDir: "docs",
  // Keep the docs site output separate from the library build (dist/).
  outDir: "site",
  // Emit static HTML (for GitHub Pages / any static host), like the old docs site.
  renderStrategy: "static",
  title: "react-dropzone",
  description: "Simple HTML5 drag 'n' drop zone with React.js",
  // Favicon + header logo (assets live in /public, served at the site root).
  iconUrl: "/favicon.svg",
  logoUrl: {light: "/dropzone-lockup.svg", dark: "/dropzone-lockup-dark.svg"},
  // Global CSS tweaks injected into every page:
  // 1. The copy button is absolutely positioned inside the horizontally-scrolling <pre>,
  //    so it rides the scroll; anchor it to the non-scrolling code-block wrapper instead.
  // 2. Hide the floating "Ask AI" widget (showAskAi is frontmatter-only, so this disables it globally).
  head: {
    style: [
      {
        innerHTML:
          "[data-v-code-container]{position:relative}[data-v-code-container]>pre.shiki{position:static}[data-v-ask-ai-container]{display:none}"
      }
    ]
  },
  socials: [{icon: "github", link: "https://github.com/react-dropzone/react-dropzone"}],
  topNav: [
    {text: "Guide", link: "/guide/getting-started"},
    {text: "Examples", link: "/examples/basic"}
  ],
  sidebar: [
    {
      text: "Guide",
      collapsed: false,
      items: [{text: "Getting Started", link: "/guide/getting-started"}]
    },
    {
      text: "Examples",
      collapsed: false,
      items: [
        {text: "Basic", link: "/examples/basic"},
        {text: "Event propagation", link: "/examples/events"},
        {text: "Forms", link: "/examples/forms"},
        {text: "Styling", link: "/examples/styling"},
        {text: "Drag overlay", link: "/examples/drag-overlay"},
        {text: "Accepting file types", link: "/examples/accept"},
        {text: "Max files", link: "/examples/max-files"},
        {text: "Custom validation", link: "/examples/validator"},
        {text: "Opening file dialog", link: "/examples/file-dialog"},
        {text: "Previews", link: "/examples/previews"},
        {text: "Class components", link: "/examples/class-component"},
        {text: "No JSX", link: "/examples/no-jsx"},
        {text: "Plugins", link: "/examples/plugins"},
        {text: "Pintura", link: "/examples/pintura"}
      ]
    }
  ]
});
