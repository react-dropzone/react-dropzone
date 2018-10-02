import React, {
  Component,
  createRef,
  RefObject
} from "react";
import Dropzone from "../../";

export default class Test extends Component {
  ref: RefObject<Dropzone> = createRef();

  open() {
    const dz = this.ref.current;
    if (dz) {
      dz.open();
    }
  }

  render() {
    return (
      <div>
        <Dropzone ref={this.ref}>
          Hi
        </Dropzone>
      </div>
    );
  }
}
