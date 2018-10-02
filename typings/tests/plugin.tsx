import React, {Component} from "react";
import Dropzone from "../../";

export class TestReactEvt extends Component {
  getFiles = async (evt: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(evt.dataTransfer.files);
    return files;
  }

  render() {
    return (
      <div>
        <Dropzone getDataTransferItems={this.getFiles}>
          Hi
        </Dropzone>
      </div>
    );
  }
}

export class TestDataTransferItems extends Component {
  getFiles = async (evt: React.DragEvent<HTMLDivElement>) => {
    const items = Array.from(evt.dataTransfer.items);
    return items;
  }

  render() {
    return (
      <div>
        <Dropzone getDataTransferItems={this.getFiles}>
          Hi
        </Dropzone>
      </div>
    );
  }
}

export class TestNativeEvt extends Component {
  getFiles = async (evt: DragEvent) => {
    const files = Array.from(evt.dataTransfer.files);
    return files;
  }

  render() {
    return (
      <div>
        <Dropzone getDataTransferItems={this.getFiles}>
          Hi
        </Dropzone>
      </div>
    );
  }
}
