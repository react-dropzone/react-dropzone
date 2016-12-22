import React from 'react';
import { mount, render } from 'enzyme';
import { spy, stub } from 'sinon';

const Dropzone = require(process.env.NODE_ENV === 'production' ? '../dist/index' : './index'); // eslint-disable-line import/no-dynamic-require

let files;
let images;

describe('Dropzone', () => {

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

  describe('basics', () => {
    it('should render children', () => {
      const dropzone = mount(
        <Dropzone>
          <p>some content</p>
        </Dropzone>
      );
      expect(dropzone.html()).toMatchSnapshot();
    });

    it('should render an input HTML element', () => {
      const dropzone = mount(
        <Dropzone>
          <p>some content</p>
        </Dropzone>
      );
      expect(dropzone.find('input').length).toEqual(1);
    });

    it('sets ref properly', () => {
      const dropzone = mount(
        <Dropzone />
      );
      expect(dropzone.instance().fileInputEl).not.toBeUndefined();
      expect(dropzone.instance().fileInputEl.tagName).toEqual('INPUT');
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
      expect(component.find('.my-dropzone').attr()).not.toContain('accept');
      expect(Object.keys(component.find('input').attr())).toContain('accept');
      expect(component.find('input').attr('accept')).toEqual('image/jpeg');
    });

    it('applies the name prop to the child input', () => {
      const component = render(
        <Dropzone className="my-dropzone" name="test-file-input" />
      );
      expect(component.find('.my-dropzone').attr()).not.toContain('name');
      expect(Object.keys(component.find('input').attr())).toContain('name');
      expect(component.find('input').attr('name')).toEqual('test-file-input');
    });
  });

  describe('onClick', () => {
    it('should call `open` method', () => {
      const dropzone = mount(
        <Dropzone />
      );
      spy(dropzone.instance(), 'open');
      dropzone.simulate('click');
      expect(dropzone.instance().open.callCount).toEqual(1);
    });

    it('should not call `open` if disableClick prop is true', () => {
      const dropzone = mount(
        <Dropzone disableClick />
      );
      spy(dropzone.instance(), 'open');
      dropzone.simulate('click');
      expect(dropzone.instance().open.callCount).toEqual(0);
    });

    it('should call `onClick` callback if provided', () => {
      const clickSpy = spy();
      const dropzone = mount(
        <Dropzone onClick={clickSpy} />
      );
      spy(dropzone.instance(), 'open');
      dropzone.simulate('click');
      expect(dropzone.instance().open.callCount).toEqual(1);
      expect(clickSpy.callCount).toEqual(1);
    });

    it('should reset the value of input', () => {
      const dropzone = mount(
        <Dropzone />
      );
      expect(dropzone.render().find('input').attr('value')).toBeUndefined();
      expect(dropzone.render().find('input').attr('value', 10)).not.toBeUndefined();
      dropzone.simulate('click');
      expect(dropzone.render().find('input').attr('value')).toBeUndefined();
    });

    it('should trigger click even on the input', () => {
      const dropzone = mount(
        <Dropzone />
      );
      const clickSpy = spy(dropzone.instance().fileInputEl, 'click');
      dropzone.simulate('click');
      dropzone.simulate('click');
      expect(clickSpy.callCount).toEqual(2);
    });

    it('should not invoke onClick on the wrapper', () => {
      const onClickOuterSpy = spy();
      const onClickInnerSpy = spy();
      const component = mount(
        <div onClick={onClickOuterSpy}>
          <Dropzone onClick={onClickInnerSpy} />
        </div>
      );

      component.simulate('click');
      expect(onClickOuterSpy.callCount).toEqual(1);
      expect(onClickInnerSpy.callCount).toEqual(0);

      onClickOuterSpy.reset();
      onClickInnerSpy.reset();

      component.find('Dropzone').simulate('click');
      expect(onClickOuterSpy.callCount).toEqual(0);
      expect(onClickInnerSpy.callCount).toEqual(1);
    });
  });

  describe('drag-n-drop', () => {
    it('should override onDrag* methods', () => {
      const dragStartSpy = spy();
      const dragEnterSpy = spy();
      const dragLeaveSpy = spy();
      const component = mount(
        <Dropzone
          onDragStart={dragStartSpy}
          onDragEnter={dragEnterSpy}
          onDragLeave={dragLeaveSpy}
        />
      );
      component.simulate('dragStart');
      component.simulate('dragEnter', { dataTransfer: { items: files } });
      component.simulate('dragLeave', { dataTransfer: { items: files } });
      expect(dragStartSpy.callCount).toEqual(1);
      expect(dragEnterSpy.callCount).toEqual(1);
      expect(dragLeaveSpy.callCount).toEqual(1);
    });

    it('should guard dropEffect in onDragOver for IE', () => {
      const dragStartSpy = spy();
      const dragEnterSpy = spy();
      const dragLeaveSpy = spy();
      const component = mount(
        <Dropzone
          onDragStart={dragStartSpy}
          onDragEnter={dragEnterSpy}
          onDragLeave={dragLeaveSpy}
        />
      );

      // Using Proxy we'll emulate IE throwing when setting dataTransfer.dropEffect
      const eventProxy = new Proxy({}, {
        get: (target, prop) => {
          switch (prop) {
            case 'dataTransfer':
              throw new Error('IE does not support rrror');
            default:
              return function () {};
          }
        }
      });

      // And using then we'll call the onDragOver with the proxy instead of event
      const dragOverSpy = stub(
        component.instance(),
        'onDragOver',
        component.instance().onDragOver(eventProxy)
      );

      component.simulate('dragStart', { dataTransfer: { items: files } });
      component.simulate('dragEnter', { dataTransfer: { items: files } });
      component.simulate('dragOver', { dataTransfer: { items: files } });
      component.simulate('dragLeave', { dataTransfer: { items: files } });
      expect(dragStartSpy.callCount).toEqual(1);
      expect(dragEnterSpy.callCount).toEqual(1);
      expect(dragLeaveSpy.callCount).toEqual(1);
      // It should not throw the error
      expect(dragOverSpy).not.toThrow();
      dragOverSpy.restore();
    });

    it('should set proper dragActive state on dragEnter', () => {
      const dropzone = mount(
        <Dropzone />
      );
      dropzone.simulate('dragEnter', { dataTransfer: { files } });
      expect(dropzone.state().isDragActive).toEqual(true);
      expect(dropzone.state().isDragReject).toEqual(false);
    });

    it('should set proper dragReject state on dragEnter', () => {
      const dropzone = mount(
        <Dropzone accept="image/*" />
      );
      dropzone.simulate('dragEnter', { dataTransfer: { files: files.concat(images) } });
      expect(dropzone.state().isDragActive).toEqual(false);
      expect(dropzone.state().isDragReject).toEqual(true);
    });

    it('should set proper dragActive state if multiple is false', () => {
      const dropzone = mount(
        <Dropzone
          accept="image/*"
          multiple={false}
        />
      );
      dropzone.simulate('dragEnter', { dataTransfer: { files } });
      expect(dropzone.state().isDragActive).toEqual(false);
      expect(dropzone.state().isDragReject).toEqual(true);
    });

    it('should set proper dragActive state if multiple is false', () => {
      const dropzone = mount(
        <Dropzone
          accept="image/*"
          multiple={false}
        />
      );
      dropzone.simulate('dragEnter', { dataTransfer: { files: images } });
      expect(dropzone.state().isDragActive).toEqual(true);
      expect(dropzone.state().isDragReject).toEqual(false);
    });
  });

  describe('onDrop', () => {
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

    it('should reset the dragActive/dragReject state', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
        />
      );
      dropzone.simulate('dragEnter', { dataTransfer: { files } });
      expect(dropzone.state().isDragActive).toEqual(true);
      expect(dropzone.state().isDragReject).toEqual(false);
      dropzone.simulate('drop', { dataTransfer: { files } });
      expect(dropzone.state().isDragActive).toEqual(false);
      expect(dropzone.state().isDragReject).toEqual(false);
    });

    it('should take all dropped files if multiple is true', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          multiple
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files: images } });
      expect(dropSpy.firstCall.args[0]).toHaveLength(2);
      expect(dropSpy.firstCall.args[0][0].name).toEqual(images[0].name);
      expect(dropSpy.firstCall.args[0][1].name).toEqual(images[1].name);
    });

    it('should take first file out of dropped files if multiple is false', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          multiple={false}
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files: images } });
      expect(dropSpy.firstCall.args[0]).toHaveLength(1);
      expect(dropSpy.firstCall.args[0][0].name).toEqual(images[0].name);
    });

    it('should set this.isFileDialogActive to false', () => {
      const dropzone = mount(
        <Dropzone />
      );
      dropzone.instance().isFileDialogActive = true;
      dropzone.simulate('drop', { dataTransfer: { files } });
      expect(dropzone.instance().isFileDialogActive).toEqual(false);
    });

    it('should always call onDrop callback with accepted and rejected arguments', () => {
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
      expect(dropSpy.firstCall.args[0]).toEqual([], [...files]);
      dropzone.simulate('drop', { dataTransfer: { files: images } });
      expect(dropSpy.callCount).toEqual(2);
      expect(dropSpy.lastCall.args[0]).toEqual([...images], []);
      dropzone.simulate('drop', { dataTransfer: { files: files.concat(images) } });
      expect(dropSpy.callCount).toEqual(3);
      expect(dropSpy.lastCall.args[0]).toEqual([...images], [...files]);
    });

    it('should call onDropAccepted callback if some files were accepted', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
          accept="image/*"
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files } });
      expect(dropAcceptedSpy.callCount).toEqual(0);
      dropzone.simulate('drop', { dataTransfer: { files: images } });
      expect(dropAcceptedSpy.callCount).toEqual(1);
      expect(dropAcceptedSpy.lastCall.args[0]).toEqual([...images]);
      dropzone.simulate('drop', { dataTransfer: { files: files.concat(images) } });
      expect(dropAcceptedSpy.callCount).toEqual(2);
      expect(dropAcceptedSpy.lastCall.args[0]).toEqual([...images]);
    });

    it('should call onDropRejected callback if some files were rejected', () => {
      const dropzone = mount(
        <Dropzone
          onDrop={dropSpy}
          onDropAccepted={dropAcceptedSpy}
          onDropRejected={dropRejectedSpy}
          accept="image/*"
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files } });
      expect(dropRejectedSpy.callCount).toEqual(1);
      expect(dropRejectedSpy.lastCall.args[0]).toEqual([...files]);
      dropzone.simulate('drop', { dataTransfer: { files: images } });
      expect(dropRejectedSpy.callCount).toEqual(1);
      dropzone.simulate('drop', { dataTransfer: { files: files.concat(images) } });
      expect(dropRejectedSpy.callCount).toEqual(2);
      expect(dropRejectedSpy.lastCall.args[0]).toEqual([...files]);
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

  describe('preview', () => {
    it.skip('should not generate previews for non-images', () => {
      const dropSpy = spy();
      const dropzone = mount(
        <Dropzone onDrop={dropSpy} />
      );
      dropzone.simulate('drop', { dataTransfer: { files } });
      expect(Object.keys(dropSpy.firstCall.args[0][0])).not.toContain('preview');
    });

    it('should generate previews for images', () => {
      const dropSpy = spy();
      const dropzone = mount(
        <Dropzone onDrop={dropSpy} />
      );
      dropzone.simulate('drop', { dataTransfer: { files: images } });
      expect(Object.keys(dropSpy.firstCall.args[0][0])).toContain('preview');
      expect(dropSpy.firstCall.args[0][0].preview).toContain('data://cats.gif');
    });

    it('should not generate previews if disablePreview is true', () => {
      const dropSpy = spy();
      const dropzone = mount(
        <Dropzone
          disablePreview
          onDrop={dropSpy}
        />
      );
      dropzone.simulate('drop', { dataTransfer: { files: images } });
      dropzone.simulate('drop', { dataTransfer: { files } });
      expect(dropSpy.callCount).toEqual(2);
      expect(Object.keys(dropSpy.firstCall.args[0][0])).not.toContain('preview');
      expect(Object.keys(dropSpy.lastCall.args[0][0])).not.toContain('preview');
    });
  });

  describe('onClick', () => {});

  describe('onCancel', () => {
    it('should not invoke onFileDialogCancel everytime window receives focus', (done) => {
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

    it('should invoke onFileDialogCancel when window receives focus via cancel button', (done) => {
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

  describe('behavior', () => {
    it('does not throw an error when html is dropped instead of files and multiple is false', () => {
      const dropzone = mount(
        <Dropzone multiple={false} />
      );

      const fn = () => dropzone.simulate('drop', { dataTransfer: { files: [] } });
      expect(fn).not.toThrow();
    });
  });

});
