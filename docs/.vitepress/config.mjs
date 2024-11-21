import { defineConfig } from 'vitepress'
import react from '@vitejs/plugin-react';


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "React Dropzone",
  description: "React Dropzone docs",
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  vite: {
    plugins: [react()],
  },
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Get Started', link: '/get-started' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Get Started', link: '/get-started' },
          { text: 'Usage', link: '/usage' },
          { text: 'Troubleshooting', link: '/troubleshooting' },
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Basic', link: '/examples/basic' },
          { text: 'Event Propagation', link: '/examples/event-propagation' },
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Read File Contents', link: '/guides/read-file-contents' },
          { text: 'Refs', link: '/guides/refs' },
          { text: 'Testing', link: '/guides/testing' },
        ]
      },
      {
        text: "Integrations",
        items: [
          { text: "Pintura", link: "/integrations/pintura"},
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/react-dropzone/react-dropzone' }
    ],
    footer: {
      message: 'Released under the <a target="_blank" href="https://github.com/react-dropzone/react-dropzone/blob/master/LICENSE">MIT</a> License. <a target="_blank" href="https://react-dropzone.js.org/">react-dropzone.js.org</a> hosting provided by <a target="_blank" href="https://www.netlify.com/">netlify</a>.',
    },
  },
})
