# isDragGlobal Example

The `isDragGlobal` state is `true` when files are being dragged anywhere on the document, before they reach the dropzone. This allows you to show visual feedback (like a full-page overlay) to indicate where files can be dropped.

## Simple Example

```jsx harmony
import React from 'react';
import {useDropzone} from 'react-dropzone';

function DragOverlay() {
  const {
    getRootProps,
    getInputProps,
    isDragGlobal,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles
  } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      {/* Global overlay shown when dragging anywhere on the page */}
      {isDragGlobal && !isDragActive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          border: '3px dashed #007bff',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <h2 style={{ color: '#007bff' }}>Drop files anywhere on this page...</h2>
        </div>
      )}

      <section className="container">
        <div {...getRootProps({
          className: 'dropzone',
          style: {
            border: '2px dashed #ccc',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            backgroundColor: isDragAccept ? '#d4edda' : isDragReject ? '#f8d7da' : 'white',
            transition: 'all 0.2s',
          }
        })}>
          <input {...getInputProps()} />
          
          {/* Status indicators */}
          {isDragGlobal && !isDragActive && (
            <p style={{ color: '#007bff', fontWeight: 'bold' }}>
              🌐 Drag detected on page!
            </p>
          )}
          
          {isDragActive && !isDragAccept && !isDragReject && (
            <p style={{ color: '#6c757d' }}>Drop files here...</p>
          )}
          
          {isDragAccept && (
            <p style={{ color: '#28a745', fontWeight: 'bold' }}>
              ✅ Drop to upload these files
            </p>
          )}
          
          {isDragReject && (
            <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
              ❌ Some files will be rejected
            </p>
          )}
          
          {!isDragGlobal && !isDragActive && (
            <p>Drag 'n' drop images here, or click to select files</p>
          )}
        </div>

        <aside>
          <h4>Accepted files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    </div>
  );
}

<DragOverlay />
```

## State Transitions

The `isDragGlobal` state provides early feedback about drag operations:

1. **`isDragGlobal: false`** - No drag operation detected
2. **`isDragGlobal: true`** - Files are being dragged anywhere on the document
   - This is set when `dragenter` fires on the document with files
3. **`isDragActive: true`** - Files are being dragged over the dropzone
   - Takes precedence when you want to show different feedback
4. **`isDragAccept: true`** / **`isDragReject: true`** - Files are validated
   - Indicates whether the dragged files meet the dropzone criteria

## Use Cases

- **Full-page overlays**: Show a visual indicator across the entire page when drag starts
- **Multi-dropzone highlighting**: Highlight all available dropzones when files are detected
- **Early user feedback**: Provide immediate visual feedback before users reach the target dropzone
- **Improved UX**: Make it clear that the application accepts drag and drop

## Events

`isDragGlobal` is reset to `false` when:
- Drag leaves the document (`dragleave` on all elements)
- Files are dropped anywhere (`drop` event)
- Drag operation is cancelled (`dragend` event, e.g., user presses ESC)
