import React from "react";
import {expect} from 'chai';
import {spy} from 'sinon';
import TestUtils from "react-addons-test-utils";
import Dropzone from "./index";

describe('Dropzone', () => {

  let files = [];

  beforeEach(() => {
    files = [{
      name: "file1.pdf",
      size: 1111
    }];
  });

  it('renders the content', () => {
    let dropzone = TestUtils.renderIntoDocument(<Dropzone><div className="dropzone-content">some content</div></Dropzone>);
    //
    let content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');
    expect(content.textContent).to.equal("some content");
  });

  it('returns the url of the preview', () => {
    let dropSpy = spy();
    let dropzone = TestUtils.renderIntoDocument(<Dropzone onDrop={dropSpy}><div className="dropzone-content">some content</div></Dropzone>);
    let content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

    TestUtils.Simulate.drop(content, { dataTransfer: { files } });
    expect(dropSpy.callCount).to.equal(1);
    expect(dropSpy.firstCall.args[0][0]).to.have.property('preview');
  });

  it('uses the disablePreview property', () => {
    let dropSpy = spy();
    let dropzone = TestUtils.renderIntoDocument(<Dropzone disablePreview={true} onDrop={dropSpy}><div className="dropzone-content">some content</div></Dropzone>);
    let content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

    TestUtils.Simulate.drop(content, { dataTransfer: { files } });
    expect(dropSpy.callCount).to.equal(1);
    expect(dropSpy.firstCall.args[0][0]).to.not.have.property('preview');
  });
});
