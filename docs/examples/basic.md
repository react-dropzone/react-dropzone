---
title: Basic
---

# Basic

The `useDropzone` hook just binds the necessary handlers to create a drag 'n' drop zone.
Use the `getRootProps()` function to get the props required for drag 'n' drop and use them on any element.
For click and keydown behavior, use the `getInputProps()` function and use the returned props on an `<input>`.

> [!NOTE]
> The hook supports folder drag 'n' drop by default. See [file-selector](https://github.com/react-dropzone/file-selector) for more info about supported browsers.

<<< @/examples/basic-dropzone.jsx

<div ref="dropzone" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Dropzone from './basic-dropzone'

const dropzone = ref()
onMounted(() => {
  const root = createRoot(dropzone.value)
  root.render(createElement(Dropzone, {}, null))
})
</script>
