You can open file dialog programmatically from your app. To do that you'll need to get the reference to the Dropzone.

`onFileDialogCancel` callback will be called if user will decides to cancel uploading.

```
<FileDialog />
```

```jsx
import React from 'react';

export default class FileDialog extends React.Component {
  onMyClick = () => {
    this.dropzone.open(); // You can programmatically open file dialog
  }

  handleRef = (node) => {
    this.dropzone = node;
  }

  render = () => {
    return (
      <div>
        <Dropzone
          disableClick
          ref={this.handleRef}
        >
          <p>Dropzone Content</p>
        </Dropzone>
        <button onClick={this.onMyClick}>Open file dialog...</button>
      </div>
    );
  }
}
```
