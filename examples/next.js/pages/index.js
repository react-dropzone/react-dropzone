import React from 'react'
import Dropzone from 'react-dropzone'

const Home = () => (
  <div>
    <Dropzone>
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          Drag &lsquo;n&lsquo; drop some files here or click to select
          <ul>
            {acceptedFiles.map(file => (
              <li key={file.path} className="file">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Dropzone>

    <style jsx>{`
      .dropzone {
        width: 100vw;
        height: 100vh;
      }
    `}</style>
  </div>
)

export default Home
