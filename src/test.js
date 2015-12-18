import React from "react";
import {expect} from 'chai';
import {spy} from 'sinon';
import TestUtils from "react-testutils-additions";
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

  describe('props', () => {

    it('uses the disablePreview property', () => {
      let dropSpy = spy();
      let dropzone = TestUtils.renderIntoDocument(<Dropzone disablePreview={true} onDrop={dropSpy}><div className="dropzone-content">some content</div></Dropzone>);
      let content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files } });
      expect(dropSpy.callCount).to.equal(1);
      expect(dropSpy.firstCall.args[0][0]).to.not.have.property('preview');
    });

    it('renders dynamic props on the root element', () => {
      let component = TestUtils.renderIntoDocument(<Dropzone hidden={true} aria-hidden="hidden" title="Dropzone" />);
      expect(TestUtils.find(component, '[hidden][aria-hidden="hidden"][title="Dropzone"]')).to.have.length(1);
    });

    it('renders dynamic props on the input element', () => {
      let component = TestUtils.renderIntoDocument(<Dropzone inputProps={{ id: 'hiddenFileInput'} } />);
      expect(TestUtils.find(component, '#hiddenFileInput')).to.have.length(1);
    });

    it('applies the accept prop to the child input', () => {
      let component = TestUtils.renderIntoDocument(<Dropzone className="my-dropzone" accept="image/jpeg" />);
      expect(TestUtils.find(component, 'input[type="file"][accept="image/jpeg"]')).to.have.length(1);
      expect(TestUtils.find(component, '[class="my-dropzone"][accept="image/jpeg"]')).to.have.length(0);
    });

    it('applies the name prop to the child input', () => {
      let component = TestUtils.renderIntoDocument(<Dropzone className="my-dropzone" name="test-file-input" />);
      expect(TestUtils.find(component, 'input[type="file"][name="test-file-input"]')).to.have.length(1);
      expect(TestUtils.find(component, '[class="my-dropzone"][name="test-file-input"]')).to.have.length(0);
    });

    it('does not apply the name prop if name is falsey', () => {
      let component = TestUtils.renderIntoDocument(<Dropzone className="my-dropzone" name="" />);
      expect(TestUtils.find(component, 'input[type="file"][name]')).to.have.length(0);
    });

    it('overrides onClick', () => {
      let clickSpy = spy();
      let component = TestUtils.renderIntoDocument(<Dropzone id="example" onClick={clickSpy} />);
      let content = TestUtils.find(component, '#example')[0];

      TestUtils.Simulate.click(content);
      expect(clickSpy).to.not.be.called;
    });

  });

});
