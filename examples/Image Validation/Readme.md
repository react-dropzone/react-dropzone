Dropzone for images validating dimensions and type of dropped images

```
class BasicValidatedImage extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop(accepted, rejected, dropZoneRef) => {
    let errors = [];

    var acceptedImg = accepted[0];
    if (acceptedImg.type !== 'image/jpeg') {
      errors.push('This image is not a jpg and is therefore rejected.');
    }
    if (acceptedImg.size > 10000000) {
      errors.push('This image is over 10MB and is therefore rejected.');
    }
    
    var image  = new Image();
    image.addEventListener('load', () => {
      if (image.width !== 2500) {
        errors.push('This image must be exactly 2500 pixels wide.');
      } else if (image.height !== 3000) {
        errors.push('This image must be exactly 3000 pixels wide.');
      }

      // display errors or do success thing
      if (errors.length > 0) {
        alert(errors.join(', '));
      } else {
        alert('these images are valid!');
        //this will depend on what your app does so this part will potentially cause problems
        this.setState({
          files: [acceptedImg]
        });
      }
    });
    //make the instantiated image variable the acceptedImg blob, for ex:
    // blob:http://localhost:3000/19230c37-944c-4088-9096-ef1cd54f7a2d
    image.src = acceptedImg.preview;
  };


  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone 
            onDrop={this.onDrop.bind(this)}
          >
            <p>Drop a .jpg here, exactly 2500 pixels wide and 300 pixels tall, and less than 10MB in size</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {
              this.state.files.map(f => <li>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>
      </section>
    );
  }
}

<BasicValidatedImage />
```
