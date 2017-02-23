import React from 'react';

export default class FileDialog extends React.Component {
  onMyClick = () => {
    this.dropzone.open(); // You can programmatically open file dialog
  }

  handleRef = (node) => {
    this.dropzone = node;
  }

  render = () => (
    <div>
      <Dropzone
        disableClick
        ref={this.handleRef}
        onFileDialogCancel={() => { alert('Canceled!'); }}
      >
        <p>Dropzone Content</p>
      </Dropzone>
      <button onClick={this.onMyClick}>Open file dialog...</button>
    </div>
    )
}
