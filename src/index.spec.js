/* eslint no-unused-expressions: 0 */

import React from 'react';
import { spy } from 'sinon';
import TestUtils from 'react-testutils-additions';

const Dropzone = require(process.env.NODE_ENV === 'production' ? '../dist/index' : './index'); // eslint-disable-line import/no-dynamic-require

describe('Dropzone', () => {

  let files = [];
  let images = [];

  beforeEach(() => {
    files = [{
      name: 'file1.pdf',
      size: 1111,
      type: 'application/pdf'
    }];
    images = [{
      name: 'cats.gif',
      size: 1234,
      type: 'image/gif'
    }, {
      name: 'dogs.jpg',
      size: 2345,
      type: 'image/jpeg'
    }];
  });

  it('renders the content', () => {
    const dropzone = TestUtils.renderIntoDocument(
      <Dropzone>
        <div className="dropzone-content">some content</div>
      </Dropzone>
    );
    const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');
    expect(content.textContent).toEqual('some content');
  });

  it('renders the input element', () => {
    const dropzone = TestUtils.renderIntoDocument(
      <Dropzone>
        <div className="dropzone-content">some content</div>
      </Dropzone>
    );
    const input = TestUtils.find(dropzone, 'input');
    expect(input.length).toEqual(1);
  });

  it('renders dropzone in anywhere mode', () => {
    const dropzone = TestUtils.renderIntoDocument(
      <Dropzone className="test" dropAnywhere>
        <div className="dropzone-content">some content</div>
      </Dropzone>
    );
    const input = TestUtils.find(dropzone, 'input');
    const testClass = TestUtils.find(dropzone, '.test');
    const children = TestUtils.find(dropzone, '.dropzone-content');

    expect(input.length).toEqual(0);
    expect(testClass.length).toEqual(1);
    expect(children.length).toEqual(1);
  });

  it('returns the url of the preview', () => {
    const dropSpy = spy();
    const dropzone = TestUtils.renderIntoDocument(
      <Dropzone onDrop={dropSpy}>
        <div className="dropzone-content">some content</div>
      </Dropzone>
    );
    const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

    TestUtils.Simulate.drop(content, { dataTransfer: { files } });
    expect(dropSpy.callCount).toEqual(1);
    expect(Object.keys(dropSpy.firstCall.args[0][0])).toContain('preview');
  });

  it('does not throw an error when html is dropped instead of files and multiple is false', () => {
    const dropzone = TestUtils.renderIntoDocument(
      <Dropzone multiple={false}>
        <div className="dropzone-content">some content</div>
      </Dropzone>
    );
    const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

    const fn = () => TestUtils.Simulate.drop(content, { dataTransfer: { files: [] } });
    expect(fn).not.toThrow();
  });

  describe('ref', () => {
    it('sets ref properly', () => {
      const dropzone = TestUtils.renderIntoDocument(<Dropzone />);
      const input = TestUtils.find(dropzone, 'input')[0];

      expect(dropzone.fileInputEl).not.toBeUndefined();
      expect(dropzone.fileInputEl).toEqual(input);
    });
  });

  describe('props', () => {

    it('uses the disablePreview property', () => {
      const dropSpy = spy();
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone disablePreview onDrop={dropSpy}>
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files } });
      expect(dropSpy.callCount).toEqual(1);
      expect(Object.keys(dropSpy.firstCall.args[0][0])).not.toContain('preview');
    });

    it('uses the disableClick property', () => {
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone disableClick>
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      spy(dropzone, 'open');
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.click(content);
      expect(dropzone.open.callCount).toEqual(0);
    });

    it('calls `open` if disableClick is not provided', () => {
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone>
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      spy(dropzone, 'open');
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.click(content);
      expect(dropzone.open.callCount).toEqual(1);
    });

    it('renders dynamic props on the root element', () => {
      const component = TestUtils.renderIntoDocument(
        <Dropzone hidden aria-hidden title="Dropzone" />
      );
      expect(TestUtils.find(component, '[hidden][aria-hidden][title="Dropzone"]'))
        .toHaveLength(1);
    });

    it('renders dynamic props on the input element', () => {
      const component = TestUtils.renderIntoDocument(
        <Dropzone inputProps={{ id: 'hiddenFileInput' }} />
      );
      expect(TestUtils.find(component, '#hiddenFileInput')).toHaveLength(1);
    });

    it('applies the accept prop to the child input', () => {
      const component = TestUtils.renderIntoDocument(
        <Dropzone className="my-dropzone" accept="image/jpeg" />
      );
      expect(TestUtils.find(component, 'input[type="file"][accept="image/jpeg"]'))
        .toHaveLength(1);
      expect(TestUtils.find(component, '[class="my-dropzone"][accept="image/jpeg"]'))
        .toHaveLength(0);
    });

    it('applies the accept prop to the dropped files', () => {
      const dropSpy = spy();
      const dropAcceptedSpy = spy();
      const dropRejectedSpy = spy();
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone onDrop={dropSpy} onDropAccepted={dropAcceptedSpy} onDropRejected={dropRejectedSpy} accept="image/*">
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(0);
      expect(dropSpy.firstCall.args[1]).toHaveLength(1);

      expect(dropAcceptedSpy.callCount).toEqual(0);

      expect(dropRejectedSpy.callCount).toEqual(1);
      expect(dropRejectedSpy.firstCall.args[0]).toHaveLength(1);
    });

    it('applies the accept prop to the dropped images', () => {
      const dropSpy = spy();
      const dropAcceptedSpy = spy();
      const dropRejectedSpy = spy();
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone onDrop={dropSpy} onDropAccepted={dropAcceptedSpy} onDropRejected={dropRejectedSpy} accept="image/*">
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files: images } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(2);
      expect(dropSpy.firstCall.args[1]).toHaveLength(0);

      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.firstCall.args[0]).toHaveLength(2);

      expect(dropRejectedSpy.callCount).toEqual(0);
    });

    it('accepts all dropped files and images when no accept prop is specified', () => {
      const dropSpy = spy();
      const dropAcceptedSpy = spy();
      const dropRejectedSpy = spy();
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone onDrop={dropSpy} onDropAccepted={dropAcceptedSpy} onDropRejected={dropRejectedSpy}>
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files: files.concat(images) } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(3);
      expect(dropSpy.firstCall.args[1]).toHaveLength(0);

      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.firstCall.args[0]).toHaveLength(3);

      expect(dropRejectedSpy.callCount).toEqual(0);
    });

    it('applies the maxSize prop to the dropped files', () => {
      const dropSpy = spy();
      const dropAcceptedSpy = spy();
      const dropRejectedSpy = spy();
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone onDrop={dropSpy} onDropAccepted={dropAcceptedSpy} onDropRejected={dropRejectedSpy} maxSize={1111}>
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(1);
      expect(dropSpy.firstCall.args[1]).toHaveLength(0);

      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.firstCall.args[0]).toHaveLength(1);

      expect(dropRejectedSpy.callCount).toEqual(0);
    });

    it('applies the maxSize prop to the dropped images', () => {
      const dropSpy = spy();
      const dropAcceptedSpy = spy();
      const dropRejectedSpy = spy();
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone onDrop={dropSpy} onDropAccepted={dropAcceptedSpy} onDropRejected={dropRejectedSpy} maxSize={1111}>
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files: images } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(0);
      expect(dropSpy.firstCall.args[1]).toHaveLength(2);

      expect(dropAcceptedSpy.callCount).toEqual(0);

      expect(dropRejectedSpy.callCount).toEqual(1);
      expect(dropRejectedSpy.firstCall.args[0]).toHaveLength(2);
    });

    it('applies the minSize prop to the dropped files', () => {
      const dropSpy = spy();
      const dropAcceptedSpy = spy();
      const dropRejectedSpy = spy();
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone onDrop={dropSpy} onDropAccepted={dropAcceptedSpy} onDropRejected={dropRejectedSpy} minSize={1112}>
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(0);
      expect(dropSpy.firstCall.args[1]).toHaveLength(1);

      expect(dropAcceptedSpy.callCount).toEqual(0);

      expect(dropRejectedSpy.callCount).toEqual(1);
      expect(dropRejectedSpy.firstCall.args[0]).toHaveLength(1);
    });

    it('applies the minSize prop to the dropped images', () => {
      const dropSpy = spy();
      const dropAcceptedSpy = spy();
      const dropRejectedSpy = spy();
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone onDrop={dropSpy} onDropAccepted={dropAcceptedSpy} onDropRejected={dropRejectedSpy} minSize={1112}>
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files: images } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(2);
      expect(dropSpy.firstCall.args[1]).toHaveLength(0);

      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.firstCall.args[0]).toHaveLength(2);

      expect(dropRejectedSpy.callCount).toEqual(0);
    });

    it('accepts all dropped files and images when no size prop is specified', () => {
      const dropSpy = spy();
      const dropAcceptedSpy = spy();
      const dropRejectedSpy = spy();
      const dropzone = TestUtils.renderIntoDocument(
        <Dropzone onDrop={dropSpy} onDropAccepted={dropAcceptedSpy} onDropRejected={dropRejectedSpy}>
          <div className="dropzone-content">some content</div>
        </Dropzone>
      );
      const content = TestUtils.findRenderedDOMComponentWithClass(dropzone, 'dropzone-content');

      TestUtils.Simulate.drop(content, { dataTransfer: { files: files.concat(images) } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(3);
      expect(dropSpy.firstCall.args[1]).toHaveLength(0);

      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.firstCall.args[0]).toHaveLength(3);

      expect(dropRejectedSpy.callCount).toEqual(0);
    });

    it('applies the name prop to the child input', () => {
      const component = TestUtils.renderIntoDocument(
        <Dropzone className="my-dropzone" name="test-file-input" />
      );
      expect(TestUtils.find(component, 'input[type="file"][name="test-file-input"]'))
        .toHaveLength(1);
      expect(TestUtils.find(component, '[class="my-dropzone"][name="test-file-input"]'))
        .toHaveLength(0);
    });

    it('overrides onClick', () => {
      const clickSpy = spy();
      const component = TestUtils.renderIntoDocument(
        <Dropzone id="example" onClick={clickSpy} />
      );
      const content = TestUtils.find(component, '#example')[0];

      TestUtils.Simulate.click(content);
      expect(clickSpy.callCount).toEqual(0);
    });

    it('overrides onDragStart', () => {
      const dragStartSpy = spy();
      const component = TestUtils.renderIntoDocument(
        <Dropzone id="drag-example" onDragStart={dragStartSpy} />
      );
      const content = TestUtils.find(component, '#drag-example')[0];

      TestUtils.Simulate.dragStart(content);
      expect(dragStartSpy.callCount).toEqual(1);
    });

    it('overrides onDragEnter', () => {
      const dragEnterSpy = spy();
      const component = TestUtils.renderIntoDocument(
        <Dropzone id="drag-example" onDragEnter={dragEnterSpy} />
      );
      const content = TestUtils.find(component, '#drag-example')[0];

      TestUtils.Simulate.dragEnter(content, { dataTransfer: { items: files } });
      expect(dragEnterSpy.callCount).toEqual(1);
    });

    it('do not invoke onCancel prop everytime document body receives focus', (done) => {
      const onCancelSpy = spy();
      TestUtils.renderIntoDocument(
        <Dropzone id="on-cancel-example" onFileDialogCancel={onCancelSpy} />
      );
      // Simulated DOM event - onfocus
      document.body.addEventListener('focus', () => {});
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('focus', false, true);
      document.body.dispatchEvent(evt);
      // setTimeout to match the event callback from actual Component
      setTimeout(() => {
        expect(onCancelSpy.callCount).toEqual(0);
        done();
      }, 300);
    });

    it('invoke onFileDialogCancel prop when document body receives focus via cancel button', (done) => {
      const onCancelSpy = spy();

      const component = TestUtils.renderIntoDocument(
        <Dropzone className="dropzone-content" onFileDialogCancel={onCancelSpy} />
      );

      // Test / invoke the click event
      spy(component, 'open');
      const content = TestUtils.findRenderedDOMComponentWithClass(component, 'dropzone-content');
      TestUtils.Simulate.click(content);
      expect(component.open.callCount).toEqual(1);

      // Simulated DOM event - onfocus
      document.body.addEventListener('focus', () => {});
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('focus', false, true);
      document.body.dispatchEvent(evt);

      // setTimeout to match the event callback from actual Component
      setTimeout(() => {
        expect(onCancelSpy.callCount).toEqual(1);
        done();
      }, 300);
    });

  });

});
