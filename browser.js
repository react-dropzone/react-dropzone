import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';

const style = {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'dashed',
    borderRadius: 4,
    margin: 30,
    padding: 30,
    width: 200,
    transition: 'all 0.5s'
};

const activeStyle = {
    borderStyle: 'solid',
    backgroundColor: '#eee',
    borderRadius: 8
};

class DropzoneDemo extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            files: []
        };
    }

    onDrop(files) {
        console.log('Received files: ', files);
        this.setState({
            files: files
        });
    }

    showFiles() {
        const { files } = this.state;

        if (!files.length) {
            return null;
        }

        return (
            <div>
                <h3>Dropped files: </h3>
                <ul>
                    {
                        files.map((file, idx) => {
                            return (
                                <li key={idx}>
                                    <img src={file.preview} width={100}/>
                                    <div>{file.name + ' : ' + file.size + ' bytes.'}</div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }

    render() {
        return (
            <div>
                <Dropzone onDrop={this.onDrop.bind(this)}
                          style={style}
                          activeStyle={activeStyle}>
                    Try dropping some files here, or click to select files to upload.
                </Dropzone>
                {this.showFiles()}
            </div>
        );
    }
}

ReactDOM.render(<DropzoneDemo />, document.getElementById('example'));

module.exports = DropzoneDemo;
