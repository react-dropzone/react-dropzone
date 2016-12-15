/* eslint no-unused-expressions: 0 */

import React from 'react';
import { mount, render } from 'enzyme';
import { spy } from 'sinon';

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
    const dropzone = mount(
      <Dropzone>
        <p>some content</p>
      </Dropzone>
    );
    expect(dropzone.text()).toEqual('some content');
  });

  it('renders the input element', () => {
    const dropzone = mount(
      <Dropzone>
        <div>some content</div>
      </Dropzone>
    );
    expect(dropzone.find('input').length).toEqual(1);
  });

  it('returns the url of the preview', () => {
    const dropSpy = spy();
    const dropzone = mount(
      <Dropzone onDrop={dropSpy} />
    );
    dropzone.simulate('drop', { dataTransfer: { files } });
    expect(dropSpy.callCount).toEqual(1);
    expect(Object.keys(dropSpy.firstCall.args[0][0])).toContain('preview');
  });

  it('does not throw an error when html is dropped instead of files and multiple is false', () => {
    const dropzone = mount(
      <Dropzone multiple={false} />
    );

    const fn = () => dropzone.simulate('drop', { dataTransfer: { files: [] } });
    expect(fn).not.toThrow();
  });

  describe('ref', () => {
    it('sets ref properly', () => {
      const dropzone = mount(
        <Dropzone />
      );
      expect(dropzone.instance().fileInputEl).not.toBeUndefined();
      expect(dropzone.instance().fileInputEl.tagName).toEqual('INPUT');
    });
  });

  describe('props', () => {

    it('uses the disablePreview property', () => {
      const dropSpy = spy();
      const dropzone = mount(
        <Dropzone disablePreview onDrop={dropSpy} />
      );

      dropzone.simulate('drop', { dataTransfer: { files } });
      expect(dropSpy.callCount).toEqual(1);
      expect(Object.keys(dropSpy.firstCall.args[0][0])).not.toContain('preview');
    });

    it('uses the disableClick property', () => {
      const dropzone = mount(
        <Dropzone disableClick />
      );
      spy(dropzone.instance(), 'open');
      dropzone.simulate('click');
      expect(dropzone.instance().open.callCount).toEqual(0);
    });

    it('calls `open` if disableClick is not provided', () => {
      const dropzone = mount(
        <Dropzone />
      );
      spy(dropzone.instance(), 'open');
      dropzone.simulate('click');
      expect(dropzone.instance().open.callCount).toEqual(1);
    });

    it('renders dynamic props on the root element', () => {
      const component = mount(
        <Dropzone hidden aria-hidden title="Dropzone" />
      );
      expect(component.html()).toContain('aria-hidden="true"');
      expect(component.html()).toContain('hidden=""');
      expect(component.html()).toContain('title="Dropzone"');
    });

    it('renders dynamic props on the input element', () => {
      const component = mount(
        <Dropzone inputProps={{ id: 'hiddenFileInput' }} />
      );
      expect(component.find('input').html()).toContain('id="hiddenFileInput"');
    });

    it('applies the accept prop to the child input', () => {
      const component = render(
        <Dropzone className="my-dropzone" accept="image/jpeg" />
      );
      expect(component.find('.my-dropzone')[0].attribs).not.toContain('accept');
      expect(Object.keys(component.find('input')[0].attribs)).toContain('accept');
      expect(component.find('input')[0].attribs.accept).toEqual('image/jpeg');
    });

    it('applies the name prop to the child input', () => {
      const component = render(
        <Dropzone className="my-dropzone" name="test-file-input" />
      );
      expect(component.find('.my-dropzone')[0].attribs).not.toContain('name');
      expect(Object.keys(component.find('input')[0].attribs)).toContain('name');
      expect(component.find('input')[0].attribs.name).toEqual('test-file-input');
    });

    it('overrides onClick', () => {
      const clickSpy = spy();
      const component = mount(
        <Dropzone id="example" onClick={clickSpy} />
      );
      component.simulate('click');
      expect(clickSpy.callCount).toEqual(0);
    });

    it('overrides onDragStart', () => {
      const dragStartSpy = spy();
      const component = mount(
        <Dropzone id="drag-example" onDragStart={dragStartSpy} />
      );
      component.simulate('dragStart');
      expect(dragStartSpy.callCount).toEqual(1);
    });

    it('overrides onDragEnter', () => {
      const dragEnterSpy = spy();
      const component = mount(
        <Dropzone id="drag-example" onDragEnter={dragEnterSpy} />
      );
      component.simulate('dragEnter', { dataTransfer: { items: files } });
      expect(dragEnterSpy.callCount).toEqual(1);
    });
  });

  describe('accept', () => {

    let dropSpy;
    let dropAcceptedSpy;
    let dropRejectedSpy;

    beforeEach(() => {
      dropSpy = spy();
      dropAcceptedSpy = spy();
      dropRejectedSpy = spy();
    });

    afterEach(() => {
      dropSpy.reset();
      dropAcceptedSpy.reset();
      dropRejectedSpy.reset();
    });

    it('applies the accept prop to the dropped files', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
          accept="image/*"
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(0);
      expect(dropSpy.firstCall.args[1]).toHaveLength(1);
      expect(dropAcceptedSpy.callCount).toEqual(0);
      expect(dropRejectedSpy.callCount).toEqual(1);
      expect(dropRejectedSpy.firstCall.args[0]).toHaveLength(1);
    });

    it('applies the accept prop to the dropped images', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
          accept="image/*"
        />
      );

      dropzone.simulate('drop', { dataTransfer: { files: images } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(2);
      expect(dropSpy.firstCall.args[1]).toHaveLength(0);
      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.firstCall.args[0]).toHaveLength(2);
      expect(dropRejectedSpy.callCount).toEqual(0);
    });

    it('accepts all dropped files and images when no accept prop is specified', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files: files.concat(images) } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(3);
      expect(dropSpy.firstCall.args[1]).toHaveLength(0);
      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.firstCall.args[0]).toHaveLength(3);
      expect(dropRejectedSpy.callCount).toEqual(0);
    });

    it('applies the maxSize prop to the dropped files', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
          maxSize={1111}
        />
      );

      dropzone.simulate('drop', { dataTransfer: { files } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(1);
      expect(dropSpy.firstCall.args[1]).toHaveLength(0);
      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.firstCall.args[0]).toHaveLength(1);
      expect(dropRejectedSpy.callCount).toEqual(0);
    });

    it('applies the maxSize prop to the dropped images', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
          maxSize={1111}
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files: images } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(0);
      expect(dropSpy.firstCall.args[1]).toHaveLength(2);
      expect(dropAcceptedSpy.callCount).toEqual(0);
      expect(dropRejectedSpy.callCount).toEqual(1);
      expect(dropRejectedSpy.firstCall.args[0]).toHaveLength(2);
    });

    it('applies the minSize prop to the dropped files', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
          minSize={1112}
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(0);
      expect(dropSpy.firstCall.args[1]).toHaveLength(1);
      expect(dropAcceptedSpy.callCount).toEqual(0);
      expect(dropRejectedSpy.callCount).toEqual(1);
      expect(dropRejectedSpy.firstCall.args[0]).toHaveLength(1);
    });

    it('applies the minSize prop to the dropped images', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
          minSize={1112}
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files: images } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(2);
      expect(dropSpy.firstCall.args[1]).toHaveLength(0);
      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.firstCall.args[0]).toHaveLength(2);
      expect(dropRejectedSpy.callCount).toEqual(0);
    });

    it('accepts all dropped files and images when no size prop is specified', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files: files.concat(images) } });
      expect(dropSpy.callCount).toEqual(1);
      expect(dropSpy.firstCall.args[0]).toHaveLength(3);
      expect(dropSpy.firstCall.args[1]).toHaveLength(0);
      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.firstCall.args[0]).toHaveLength(3);
      expect(dropRejectedSpy.callCount).toEqual(0);
    });
  });

  describe('behavior', () => {
    it('do not invoke onCancel prop everytime document body receives focus', (done) => {
      const onCancelSpy = spy();
      mount(
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
      const component = mount(
        <Dropzone className="dropzone-content" onFileDialogCancel={onCancelSpy} />
      );

      // Test / invoke the click event
      spy(component.instance(), 'open');
      component.simulate('click');
      expect(component.instance().open.callCount).toEqual(1);

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
