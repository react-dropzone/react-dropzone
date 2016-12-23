```
class MyDropzone extends React.Component {
  constructor() {
    this.onDropAccepted = this.onDropAccepted.bind(this)
    this.onDropRejected = this.onDropRejected.bind(this)
  }
  onDropAccepted() {
    this.setState({
      showError: false
    })
  }

  onDropRejected() {
    this.setState({
      showError: true
    })
  }

  render() {
    return (
      <Dropzone 
        onDropAccepted={this.onDropAccepted} 
        onDropRejected={this.onDropRejected} 
        maxSize={10 * 1024}
      >
        <p>
          This dropzone will not accept files bigger than 10KB
        </p>
      </Dropzone>
    )
  }
}

<MyDropzone />
```
