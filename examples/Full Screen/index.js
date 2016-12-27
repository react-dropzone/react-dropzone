import React from 'react';

export default class FullScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      accept: '',
      files: [],
      dropzoneActive: false
    };
    this.onDrop = this.onDrop.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.applyMimeTypes = this.applyMimeTypes.bind(this);
  }

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(files) {
    this.setState({
      files,
      dropzoneActive: false
    });
  }

  onClick() {
    // You can programmatically open file dialog
    this.dropzone.open();
  }

  applyMimeTypes(event) {
    this.setState({
      accept: event.target.value
    });
  }

  render() {
    const { accept, files, dropzoneActive } = this.state;
    const style = {
      position: 'relative'
    };
    const overlayStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      padding: '2.5em 0',
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      color: '#fff'
    };
    return (
      <Dropzone
        disableClick
        ref={(node) => { this.dropzone = node; }}
        style={style}
        accept={accept}
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      >
        { dropzoneActive && <p style={overlayStyle}>Drop files...</p> }
        <div>
          <h1>My awesome app</h1>
          <label htmlFor="mimetypes">Enter mime types you want to accept: </label>
          <input
            type="text"
            id="mimetypes"
            onChange={this.applyMimeTypes}
          />
          <button onClick={this.onClick}>Upload files...</button>

          <h2>Dropped files</h2>
          <ul>
            {
              files.map(f => <li>{f.name} - {f.size} bytes</li>)
            }
          </ul>

        </div>
      </Dropzone>
    );
  }
}
