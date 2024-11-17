---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "React Dropzone"
  # text: "React Dropzone docs"
  tagline: Simple React hook and component to create a HTML5-compliant drag 'n' drop zone for files.
  actions:
    - theme: brand
      text: Get Started
      link: /get-started
    - theme: alt
      text: Examples
      link: /examples/basic

features:
  - title: Headless
    details: You can use the library as a hook and BYOS (Bring Your Own Styles).
    link: /guides/styling
    linkText: See more
  - title: Feature B
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Extensible
    details: Bring your own file getter if ours doesn't suit you.
    link: /guides/extend
    linkText: See more
---
<!-- 
<div ref="dropzone" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import FooBar from './examples/basic-dropzone'

const dropzone = ref()
onMounted(() => {
  const root = createRoot(dropzone.value)
  root.render(createElement(FooBar, {}, null))
})
</script> -->
