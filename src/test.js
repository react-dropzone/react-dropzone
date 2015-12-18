/* eslint no-unused-expressions: 0 */

import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import TestUtils from 'react-testutils-additions';
import Dropzone from './index';

describe('Dropzone', () => {

  let files = [];

  beforeEach(() => {
    files = [{
      name: 'file1.pdf',
      size: 1111
    }];
  });

  it('renders the content', () => {
    const dropzone = TestUtils.renderIntoDocument(<Dropzone><div className="dropzone-content">some content</div></Dropzone>);
    //
    const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');
    expect(content.textContent).to.equal('some content');
  });

  it('renders the input element', () => {
    const dropzone = TestUtils.renderIntoDocument(<Dropzone><div className="dropzone-content">some content</div></Dropzone>);
    const input = TestUtils.find(dropzone, 'input');
    expect(input.length).to.equal(1);
  });

  it('returns the url of the preview', () => {
    const dropSpy = spy();
    const dropzone = TestUtils.renderIntoDocument(<Dropzone onDrop={dropSpy}><div className="dropzone-content">some content</div></Dropzone>);
    const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

    TestUtils.Simulate.drop(content, { dataTransfer: { files } });
    expect(dropSpy.callCount).to.equal(1);
    expect(dropSpy.firstCall.args[0][0]).to.have.property('preview');
  });

  describe('ref', () => {
    it('sets ref properly', () => {
      const dropzone = TestUtils.renderIntoDocument(<Dropzone/>);
      const input = TestUtils.find(dropzone, 'input')[0];

      expect(dropzone.fileInputEl).to.not.be.undefined;
      expect(dropzone.fileInputEl).to.eql(input);
    });
  });

  describe('props', () => {

    it('uses the disablePreview property', () => {
      const dropSpy = spy();
      const dropzone = TestUtils.renderIntoDocument(<Dropzone disablePreview onDrop={dropSpy}><div className="dropzone-content">some content</div></Dropzone>);
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files } });
      expect(dropSpy.callCount).to.equal(1);
      expect(dropSpy.firstCall.args[0][0]).to.not.have.property('preview');
    });

    it('renders dynamic props on the root element', () => {
      const component = TestUtils.renderIntoDocument(<Dropzone hidden aria-hidden="hidden" title="Dropzone" />);
      expect(TestUtils.find(component, '[hidden][aria-hidden="hidden"][title="Dropzone"]')).to.have.length(1);
    });

    it('renders dynamic props on the input element', () => {
      const component = TestUtils.renderIntoDocument(<Dropzone inputProps={{ id: 'hiddenFileInput' } } />);
      expect(TestUtils.find(component, '#hiddenFileInput')).to.have.length(1);
    });

    it('applies the accept prop to the child input', () => {
      const component = TestUtils.renderIntoDocument(<Dropzone className="my-dropzone" accept="image/jpeg" />);
      expect(TestUtils.find(component, 'input[type="file"][accept="image/jpeg"]')).to.have.length(1);
      expect(TestUtils.find(component, '[class="my-dropzone"][accept="image/jpeg"]')).to.have.length(0);
    });

    it('applies the name prop to the child input', () => {
      const component = TestUtils.renderIntoDocument(<Dropzone className="my-dropzone" name="test-file-input" />);
      expect(TestUtils.find(component, 'input[type="file"][name="test-file-input"]')).to.have.length(1);
      expect(TestUtils.find(component, '[class="my-dropzone"][name="test-file-input"]')).to.have.length(0);
    });

    it('does not apply the name prop if name is falsey', () => {
      const component = TestUtils.renderIntoDocument(<Dropzone className="my-dropzone" name="" />);
      expect(TestUtils.find(component, 'input[type="file"][name]')).to.have.length(0);
    });

    it('overrides onClick', () => {
      const clickSpy = spy();
      const component = TestUtils.renderIntoDocument(<Dropzone id="example" onClick={clickSpy} />);
      const content = TestUtils.find(component, '#example')[0];

      TestUtils.Simulate.click(content);
      expect(clickSpy).to.not.be.called;
    });

  });

});
