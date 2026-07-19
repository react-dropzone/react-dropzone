import React, {createRef} from "react";
import {act, cleanup, fireEvent, render, renderHook} from "@testing-library/react";
import {fromEvent} from "file-selector";
import * as utils from "./utils";
import Dropzone, {useDropzone} from "./index";

describe("useDropzone() hook", () => {
  let files;
  let images;

  beforeEach(() => {
    files = [createFile("file1.pdf", 1111, "application/pdf")];
    images = [createFile("cats.gif", 1234, "image/gif"), createFile("dogs.gif", 2345, "image/jpeg")];
  });

  afterEach(cleanup);

  describe("behavior", () => {
    it("renders the root and input nodes with the necessary props", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    it("hides the <input> without {position: absolute} (#1413) while keeping it focusable (#1268)", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const input = container.querySelector("input")!;

      // {position: absolute} makes the browser scroll the page to the input when it is
      // focused (e.g. inside a collapsed accordion), which is the regression in #1413.
      expect(input.style.position).not.toBe("absolute");
      expect(input.style.position).not.toBe("fixed");

      // The input must stay focusable so a {required} input still triggers form validation
      // (#1268); {display: none} / {visibility: hidden} would break that.
      expect(input.style.display).not.toBe("none");
      expect(input.style.visibility).not.toBe("hidden");

      // Still visually hidden.
      expect(input.style.opacity).toBe("0");
    });

    it("sets {accept} prop on the <input>", () => {
      const accept = {
        "image/jpeg": []
      };
      const {container} = render(
        <Dropzone accept={accept}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("input")).toHaveAttribute("accept", "image/jpeg");
    });

    it("updates {multiple} prop on the <input> when it changes", () => {
      const {container, rerender} = render(
        <Dropzone
          accept={{
            "image/jpeg": []
          }}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("input")).toHaveAttribute("accept", "image/jpeg");

      rerender(
        <Dropzone
          accept={{
            "image/png": []
          }}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("input")).toHaveAttribute("accept", "image/png");
    });

    it("sets {multiple} prop on the <input>", () => {
      const {container} = render(
        <Dropzone multiple>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("input")).toHaveAttribute("multiple");
    });

    it("updates {multiple} prop on the <input> when it changes", () => {
      const {container, rerender} = render(
        <Dropzone multiple={false}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("input")).not.toHaveAttribute("multiple");

      rerender(
        <Dropzone multiple>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("input")).toHaveAttribute("multiple");
    });

    it("sets any props passed to the input props getter on the <input>", () => {
      const name = "dropzone-input";
      const {container} = render(
        <Dropzone multiple>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps({name})} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("input")).toHaveAttribute("name", name);
    });

    it("labels the hidden file input for accessibility", () => {
      const {container} = render(
        <Dropzone multiple>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("input")).toHaveAttribute("aria-label", "file upload");
    });

    it("sets any props passed to the root props getter on the root node", () => {
      const ariaLabel = "Dropzone area";
      const {container} = render(
        <Dropzone multiple>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps({"aria-label": ariaLabel})}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("div")).toHaveAttribute("aria-label", ariaLabel);
    });

    it("runs the custom callback handlers provided to the root props getter", async () => {
      const event = createDtWithFiles(files);

      const rootProps = {
        onClick: vi.fn(),
        onKeyDown: vi.fn(),
        onFocus: vi.fn(),
        onBlur: vi.fn(),
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps(rootProps)}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);
      expect(rootProps.onClick).toHaveBeenCalled();

      fireEvent.focus(dropzone);
      fireEvent.keyDown(dropzone);
      expect(rootProps.onFocus).toHaveBeenCalled();
      expect(rootProps.onKeyDown).toHaveBeenCalled();

      fireEvent.blur(dropzone);
      expect(rootProps.onBlur).toHaveBeenCalled();

      await act(() => fireEvent.dragEnter(dropzone, event));
      expect(rootProps.onDragEnter).toHaveBeenCalled();

      fireEvent.dragOver(dropzone, event);
      expect(rootProps.onDragOver).toHaveBeenCalled();

      fireEvent.dragLeave(dropzone, event);
      expect(rootProps.onDragLeave).toHaveBeenCalled();

      await act(() => fireEvent.drop(dropzone, event));
      expect(rootProps.onDrop).toHaveBeenCalled();
    });

    it("runs the custom callback handlers provided to the input props getter", async () => {
      const inputProps = {
        onClick: vi.fn(),
        onChange: vi.fn()
      };

      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps(inputProps)} />
            </div>
          )}
        </Dropzone>
      );

      const input = container.querySelector("input");

      fireEvent.click(input);
      expect(inputProps.onClick).toHaveBeenCalled();

      await act(async () => fireEvent.change(input, {target: {files: []}}));
      expect(inputProps.onChange).toHaveBeenCalled();
    });

    it("runs no callback handlers if {disabled} is true", async () => {
      const event = createDtWithFiles(files);

      const rootProps = {
        onClick: vi.fn(),
        onKeyDown: vi.fn(),
        onFocus: vi.fn(),
        onBlur: vi.fn(),
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      const inputProps = {
        onClick: vi.fn(),
        onChange: vi.fn()
      };

      const {container} = render(
        <Dropzone disabled>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps(rootProps)}>
              <input {...getInputProps(inputProps)} />
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);
      expect(rootProps.onClick).not.toHaveBeenCalled();

      fireEvent.focus(dropzone);
      fireEvent.keyDown(dropzone);
      expect(rootProps.onFocus).not.toHaveBeenCalled();
      expect(rootProps.onKeyDown).not.toHaveBeenCalled();

      fireEvent.blur(dropzone);
      expect(rootProps.onBlur).not.toHaveBeenCalled();

      await act(() => fireEvent.dragEnter(dropzone, event));
      expect(rootProps.onDragEnter).not.toHaveBeenCalled();

      fireEvent.dragOver(dropzone, event);
      expect(rootProps.onDragOver).not.toHaveBeenCalled();

      fireEvent.dragLeave(dropzone, event);
      expect(rootProps.onDragLeave).not.toHaveBeenCalled();

      await act(() => fireEvent.drop(dropzone, event));
      expect(rootProps.onDrop).not.toHaveBeenCalled();

      const input = container.querySelector("input");

      fireEvent.click(input);
      expect(inputProps.onClick).not.toHaveBeenCalled();

      await act(() => fireEvent.change(input));
      expect(inputProps.onChange).not.toHaveBeenCalled();
    });

    test("{rootRef, inputRef} are exposed", () => {
      const {result} = renderHook(() => useDropzone());
      const {rootRef, inputRef, getRootProps, getInputProps} = result.current;

      const {container} = render(
        <div {...getRootProps()}>
          <input {...getInputProps()} />
        </div>
      );

      expect(container.querySelector("div")).toEqual(rootRef.current);
      expect(container.querySelector("input")).toEqual(inputRef.current);
    });

    test("<Dropzone> exposes and sets the ref if using a ref object", () => {
      const dropzoneRef = createRef();
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

      const ui = (
        <Dropzone ref={dropzoneRef}>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const {rerender} = render(ui);

      expect(dropzoneRef.current).not.toBeNull();
      expect(typeof dropzoneRef.current.open).toEqual("function");

      act(() => dropzoneRef.current.open());
      expect(onClickSpy).toHaveBeenCalled();

      rerender(null);

      expect(dropzoneRef.current).toBeNull();
    });

    test("<Dropzone> exposes and sets the ref if using a ref fn", () => {
      let dropzoneRef;
      const setRef = ref => (dropzoneRef = ref);
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

      const ui = (
        <Dropzone ref={setRef}>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const {rerender} = render(ui);

      expect(dropzoneRef).not.toBeNull();
      expect(typeof dropzoneRef.open).toEqual("function");

      act(() => dropzoneRef.open());
      expect(onClickSpy).toHaveBeenCalled();

      rerender(null);
      expect(dropzoneRef).toBeNull();
    });

    test("<Dropzone> doesn't invoke the ref fn if it hasn't changed", () => {
      const setRef = vi.fn();

      const {rerender} = render(
        <Dropzone ref={setRef}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      rerender(<Dropzone ref={setRef}>{({getRootProps}) => <div {...getRootProps()} />}</Dropzone>);

      expect(setRef).toHaveBeenCalledTimes(1);
    });

    it("sets {isFocused} to false if {disabled} is true", () => {
      const {container, rerender} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.focus(dropzone);
      expect(dropzone.querySelector("#focus")).not.toBeNull();

      rerender(
        <Dropzone disabled>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      expect(dropzone.querySelector("#focus")).toBeNull();
    });

    test("{tabindex} is 0 if {disabled} is false", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      expect(container.querySelector("div")).toHaveAttribute("tabindex", "0");
    });

    test("{tabindex} is not set if {disabled} is true", () => {
      const {container, rerender} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("div")).toHaveAttribute("tabindex", "0");

      rerender(
        <Dropzone disabled>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("div")).not.toHaveAttribute("tabindex");
    });

    test("{aria-disabled} is true if {disabled} is true", () => {
      const {container} = render(
        <Dropzone disabled>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      expect(container.querySelector("div")).toHaveAttribute("aria-disabled", "true");
    });

    test("{aria-disabled} is not set if {disabled} is false", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      expect(container.querySelector("div")).not.toHaveAttribute("aria-disabled");
    });

    test("{tabindex} is not set if {noKeyboard} is true", () => {
      const {container, rerender} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("div")).toHaveAttribute("tabindex", "0");

      rerender(
        <Dropzone noKeyboard>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(container.querySelector("div")).not.toHaveAttribute("tabindex");
    });

    test("refs are set when {refKey} is set to a different value", async () => {
      const data = createDtWithFiles(files);

      class MyView extends React.Component {
        render() {
          const {children, innerRef, ...rest} = this.props;
          return (
            <div id="dropzone" ref={innerRef} {...rest}>
              <div>{children}</div>
            </div>
          );
        }
      }

      const ui = (
        <Dropzone>
          {({getRootProps}) => (
            <MyView {...getRootProps({refKey: "innerRef"})}>
              <span>Drop some files here ...</span>
            </MyView>
          )}
        </Dropzone>
      );

      const {container, rerender} = render(ui);
      const dropzone = container.querySelector("#dropzone");

      await act(() => fireEvent.drop(dropzone, data));
      rerender(ui);
    });

    test("click events originating from <label> should not trigger file dialog open twice", () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <label {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </label>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("label");

      fireEvent.click(dropzone, {bubbles: true, cancelable: true});

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("document drop protection", () => {
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
    // Collect the list of addEventListener/removeEventListener spy calls into an object keyed by event name
    const collectEventListenerCalls = spy =>
      spy.mock.calls.reduce(
        (acc, [eventName, ...rest]) => ({
          ...acc,
          [eventName]: rest
        }),
        {}
      );

    it("installs hooks to prevent stray drops from taking over the browser window", () => {
      render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      expect(addEventListenerSpy).toHaveBeenCalledTimes(6);

      const addEventCalls = collectEventListenerCalls(addEventListenerSpy);
      const events = Object.keys(addEventCalls);

      expect(events).toContain("dragover");
      expect(events).toContain("drop");
      expect(events).toContain("dragenter");
      expect(events).toContain("dragleave");
      expect(events).toContain("dragend");

      events.forEach(eventName => {
        const [fn, options] = addEventCalls[eventName];
        expect(fn).toBeDefined();
        expect(options).toBe(false);
      });
    });

    it("removes document hooks when unmounted", () => {
      const {unmount} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(6);

      const addEventCalls = collectEventListenerCalls(addEventListenerSpy);
      const removeEventCalls = collectEventListenerCalls(removeEventListenerSpy);
      const events = Object.keys(removeEventCalls);

      expect(events).toContain("dragover");
      expect(events).toContain("drop");
      expect(events).toContain("dragenter");
      expect(events).toContain("dragleave");
      expect(events).toContain("dragend");

      events.forEach(eventName => {
        const [a] = addEventCalls[eventName];
        const [b] = removeEventCalls[eventName];
        expect(a).toEqual(b);
      });
    });

    it("terminates drags and drops on elements outside our dropzone", () => {
      render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dragEvt = new Event("dragover", {bubbles: true});
      const dragEvtPreventDefaultSpy = vi.spyOn(dragEvt, "preventDefault");
      fireEvent(document.body, dragEvt);
      expect(dragEvtPreventDefaultSpy).toHaveBeenCalled();

      const dropEvt = new Event("drop", {bubbles: true});
      const dropEvtPreventDefaultSpy = vi.spyOn(dropEvt, "preventDefault");
      fireEvent(document.body, dropEvt);
      expect(dropEvtPreventDefaultSpy).toHaveBeenCalled();
    });

    it("permits drags and drops on elements inside our dropzone", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropEvt = new Event("drop", {bubbles: true});
      const dropEvtPreventDefaultSpy = vi.spyOn(dropEvt, "preventDefault");

      fireEvent(container.querySelector("div"), dropEvt);
      // A call is from the onDrop handler for the dropzone,
      // but there should be no more than 1
      expect(dropEvtPreventDefaultSpy).toHaveBeenCalled();
    });

    it("does not prevent stray drops when {preventDropOnDocument} is false", () => {
      render(
        <Dropzone preventDropOnDocument={false}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropEvt = new Event("drop", {bubbles: true});
      const dropEvtPreventDefaultSpy = vi.spyOn(dropEvt, "preventDefault");
      fireEvent(document.body, dropEvt);
      expect(dropEvtPreventDefaultSpy).toHaveBeenCalledTimes(0);
    });

    // https://github.com/react-dropzone/react-dropzone/issues/1362
    // When the root has no onDrop handler (disabled/noDrag), the document handler must still
    // prevent the browser from opening a file dropped onto the root.
    it("prevents the browser from opening a file dropped on a {disabled} dropzone", () => {
      const {container} = render(
        <Dropzone disabled>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropEvt = new Event("drop", {bubbles: true, cancelable: true});
      fireEvent(container.querySelector("div"), dropEvt);
      expect(dropEvt.defaultPrevented).toBe(true);
    });

    it("prevents the browser from opening a file dropped on a {noDrag} dropzone", () => {
      const {container} = render(
        <Dropzone noDrag>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropEvt = new Event("drop", {bubbles: true, cancelable: true});
      fireEvent(container.querySelector("div"), dropEvt);
      expect(dropEvt.defaultPrevented).toBe(true);
    });

    it("still lets an enabled dropzone handle its own drops (no double prevent)", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropEvt = new Event("drop", {bubbles: true, cancelable: true});
      const dropEvtPreventDefaultSpy = vi.spyOn(dropEvt, "preventDefault");
      fireEvent(container.querySelector("div"), dropEvt);
      // The instance's own onDrop handler prevents the default; the document handler bails out
      // because the event is already defaultPrevented, so preventDefault runs exactly once.
      expect(dropEvtPreventDefaultSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("event propagation", () => {
    const data = createDtWithFiles(files);

    test("drag events propagate from the inner dropzone to parents", async () => {
      const innerProps = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      const InnerDropzone = () => (
        <Dropzone {...innerProps}>
          {({getRootProps, getInputProps}) => (
            <div id="inner-dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const parentProps = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      const {container} = render(
        <Dropzone {...parentProps}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <InnerDropzone />
            </div>
          )}
        </Dropzone>
      );

      const innerDropzone = container.querySelector("#inner-dropzone");

      await act(() => fireEvent.dragEnter(innerDropzone, data));
      expect(innerProps.onDragEnter).toHaveBeenCalled();
      expect(parentProps.onDragEnter).toHaveBeenCalled();

      fireEvent.dragOver(innerDropzone, data);
      expect(innerProps.onDragOver).toHaveBeenCalled();
      expect(parentProps.onDragOver).toHaveBeenCalled();

      fireEvent.dragLeave(innerDropzone, data);
      expect(innerProps.onDragLeave).toHaveBeenCalled();
      expect(parentProps.onDragLeave).toHaveBeenCalled();

      await act(() => fireEvent.drop(innerDropzone, data));
      expect(innerProps.onDrop).toHaveBeenCalled();
      expect(parentProps.onDrop).toHaveBeenCalled();
    });

    test("drag events do not propagate from the inner dropzone to parent dropzone if user invoked stopPropagation() on the events", async () => {
      const innerProps = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      Object.keys(innerProps).forEach(prop =>
        innerProps[prop].mockImplementation((...args) => {
          const event = prop === "onDrop" ? args.pop() : args.shift();
          event.stopPropagation();
        })
      );

      const InnerDropzone = () => (
        <Dropzone {...innerProps}>
          {({getRootProps, getInputProps}) => (
            <div id="inner-dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const parentProps = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      const {container} = render(
        <Dropzone {...parentProps}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <InnerDropzone />
            </div>
          )}
        </Dropzone>
      );

      const innerDropzone = container.querySelector("#inner-dropzone");

      await act(() => fireEvent.dragEnter(innerDropzone, data));
      expect(innerProps.onDragEnter).toHaveBeenCalled();
      expect(parentProps.onDragEnter).not.toHaveBeenCalled();

      fireEvent.dragOver(innerDropzone, data);
      expect(innerProps.onDragOver).toHaveBeenCalled();
      expect(parentProps.onDragOver).not.toHaveBeenCalled();

      fireEvent.dragLeave(innerDropzone, data);
      expect(innerProps.onDragLeave).toHaveBeenCalled();
      expect(parentProps.onDragLeave).not.toHaveBeenCalled();

      await act(() => fireEvent.drop(innerDropzone, data));
      expect(innerProps.onDrop).toHaveBeenCalled();
      expect(parentProps.onDrop).not.toHaveBeenCalled();
    });

    test("drag events do not propagate from the inner dropzone to parent dropzone if {noDragEventsBubbling} is true", async () => {
      const innerProps = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      const InnerDropzone = () => (
        <Dropzone {...innerProps} noDragEventsBubbling>
          {({getRootProps, getInputProps}) => (
            <div id="inner-dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const parentProps = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      const {container} = render(
        <Dropzone {...parentProps}>
          {({getRootProps, getInputProps}) => (
            <div id="outer-dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
              <InnerDropzone />
            </div>
          )}
        </Dropzone>
      );

      const outerDropzone = container.querySelector("#outer-dropzone");
      const innerDropzone = container.querySelector("#inner-dropzone");

      // Sets drag targets on the outer dropzone
      await act(() => fireEvent.dragEnter(outerDropzone, data));

      await act(() => fireEvent.dragEnter(innerDropzone, data));
      expect(innerProps.onDragEnter).toHaveBeenCalled();
      expect(parentProps.onDragEnter).toHaveBeenCalledTimes(1);

      fireEvent.dragOver(innerDropzone, data);
      expect(innerProps.onDragOver).toHaveBeenCalled();
      expect(parentProps.onDragOver).not.toHaveBeenCalled();

      fireEvent.dragLeave(innerDropzone, data);
      expect(innerProps.onDragLeave).toHaveBeenCalled();
      expect(parentProps.onDragLeave).not.toHaveBeenCalled();

      await act(() => fireEvent.drop(innerDropzone, data));
      expect(innerProps.onDrop).toHaveBeenCalled();
      expect(parentProps.onDrop).not.toHaveBeenCalled();
    });

    test("onDragLeave is not invoked for the parent dropzone if it was invoked for an inner dropzone", async () => {
      const innerDragLeave = vi.fn();
      const InnerDropzone = () => (
        <Dropzone onDragLeave={innerDragLeave}>
          {({getRootProps, getInputProps}) => (
            <div id="inner-dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const parentDragLeave = vi.fn();

      const {container} = render(
        <Dropzone onDragLeave={parentDragLeave}>
          {({getRootProps, getInputProps}) => (
            <div id="parent-dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
              <InnerDropzone />
            </div>
          )}
        </Dropzone>
      );

      const parentDropzone = container.querySelector("#parent-dropzone");

      await act(() => fireEvent.dragEnter(parentDropzone, data));

      const innerDropzone = container.querySelector("#inner-dropzone");
      await act(() => fireEvent.dragEnter(innerDropzone, data));

      fireEvent.dragLeave(innerDropzone, data);
      expect(innerDragLeave).toHaveBeenCalled();
      expect(parentDragLeave).not.toHaveBeenCalled();
    });
  });

  describe("plugin integration", () => {
    it("uses provided getFilesFromEvent()", async () => {
      const data = createDtWithFiles(files);

      const props = {
        getFilesFromEvent: vi.fn().mockImplementation(event => fromEvent(event)),
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      const {container} = render(
        <Dropzone {...props}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, data));
      expect(props.onDragEnter).toHaveBeenCalled();

      fireEvent.dragOver(dropzone, data);
      expect(props.onDragOver).toHaveBeenCalled();

      fireEvent.dragLeave(dropzone, data);
      expect(props.onDragLeave).toHaveBeenCalled();

      await act(() => fireEvent.drop(dropzone, data));
      expect(props.onDrop).toHaveBeenCalled();
      expect(props.getFilesFromEvent).toHaveBeenCalledTimes(2);
    });

    it("calls {onError} when getFilesFromEvent() rejects", async () => {
      const data = createDtWithFiles(files);

      const props = {
        getFilesFromEvent: vi.fn().mockImplementation(() => Promise.reject("oops :(")),
        onDragEnter: vi.fn(),
        onDrop: vi.fn(),
        onError: vi.fn()
      };

      const ui = (
        <Dropzone {...props}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const {container} = render(ui);
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, data));
      expect(props.onDragEnter).not.toHaveBeenCalled();

      await act(() => fireEvent.drop(dropzone, data));
      expect(props.onDrop).not.toHaveBeenCalled();

      expect(props.getFilesFromEvent).toHaveBeenCalledTimes(2);
      expect(props.onError).toHaveBeenCalledTimes(2);
    });
  });

  describe("onFocus", () => {
    it("sets focus state", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.focus(dropzone);
      expect(dropzone.querySelector("#focus")).not.toBeNull();
    });

    it("does not set focus state if user stopped event propagation", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps({onFocus: event => event.stopPropagation()})}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.focus(dropzone);
      expect(dropzone.querySelector("#focus")).toBeNull();
    });

    it("does not set focus state if {noKeyboard} is true", () => {
      const {container} = render(
        <Dropzone noKeyboard>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.focus(dropzone);
      expect(dropzone.querySelector("#focus")).toBeNull();
    });

    it("restores focus behavior if {noKeyboard} is set back to false", () => {
      const {container, rerender} = render(
        <Dropzone noKeyboard>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.focus(dropzone);
      expect(dropzone.querySelector("#focus")).toBeNull();

      rerender(
        <Dropzone noKeyboard={false}>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      fireEvent.focus(dropzone);
      expect(dropzone.querySelector("#focus")).not.toBeNull();
    });

    it("{autoFocus} sets the focus state on render", () => {
      const {container, rerender} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      expect(dropzone.querySelector("#focus")).toBeNull();

      rerender(
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        <Dropzone autoFocus>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      expect(dropzone.querySelector("#focus")).not.toBeNull();

      rerender(
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        <Dropzone autoFocus disabled>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      expect(dropzone.querySelector("#focus")).toBeNull();
    });
  });

  describe("onBlur", () => {
    it("unsets focus state", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.focus(dropzone);
      expect(dropzone.querySelector("#focus")).not.toBeNull();

      fireEvent.blur(dropzone);
      expect(dropzone.querySelector("#focus")).toBeNull();
    });

    it("does not unset focus state if user stopped event propagation", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps({onBlur: event => event.stopPropagation()})}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.focus(dropzone);
      expect(dropzone.querySelector("#focus")).not.toBeNull();
      fireEvent.blur(dropzone);
      expect(dropzone.querySelector("#focus")).not.toBeNull();
    });

    it("does not unset focus state if {noKeyboard} is true", () => {
      const {container, rerender} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.focus(dropzone);
      expect(dropzone.querySelector("#focus")).not.toBeNull();

      rerender(
        <Dropzone noKeyboard>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      fireEvent.blur(dropzone);
      expect(dropzone.querySelector("#focus")).not.toBeNull();
    });

    it("restores blur behavior if {noKeyboard} is set back to false", () => {
      const {container, rerender} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.focus(dropzone);
      expect(dropzone.querySelector("#focus")).not.toBeNull();

      rerender(
        <Dropzone noKeyboard>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      fireEvent.blur(dropzone);
      expect(dropzone.querySelector("#focus")).not.toBeNull();

      rerender(
        <Dropzone noKeyboard={false}>
          {({getRootProps, getInputProps, isFocused}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFocused && <div id="focus" />}
            </div>
          )}
        </Dropzone>
      );

      fireEvent.blur(dropzone);
      expect(dropzone.querySelector("#focus")).toBeNull();
    });
  });

  describe("onClick", () => {
    let currentShowOpenFilePicker;

    beforeEach(() => {
      currentShowOpenFilePicker = window.showOpenFilePicker;
    });

    afterEach(() => {
      if (currentShowOpenFilePicker) {
        window.showOpenFilePicker = currentShowOpenFilePicker;
      } else {
        delete window.showOpenFilePicker;
      }
    });

    it("should proxy the click event to the input", () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);
      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);
      expect(onClickSpy).toHaveBeenCalled();
    });

    it("should not not proxy the click event to the input if event propagation was stopped", () => {
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps({onClick: event => event.stopPropagation()})}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("div"));
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    it("should not not proxy the click event to the input if {noClick} is true", () => {
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container} = render(
        <Dropzone noClick>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("div"));
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    it("restores click behavior if {noClick} is set back to false", () => {
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container, rerender} = render(
        <Dropzone noClick>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);
      expect(onClickSpy).not.toHaveBeenCalled();

      rerender(
        <Dropzone noClick={false}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(dropzone);
      expect(onClickSpy).toHaveBeenCalled();
    });

    // https://github.com/react-dropzone/react-dropzone/issues/783
    it("should continue event propagation if {noClick} is true", () => {
      const btnClickSpy = vi.fn();
      const inputClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container} = render(
        <Dropzone noClick>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button onClick={btnClickSpy} />
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("div"));
      expect(inputClickSpy).not.toHaveBeenCalled();

      fireEvent.click(container.querySelector("button"));
      expect(btnClickSpy).toHaveBeenCalled();
    });

    it("should schedule input click on next tick in Edge", () => {
      vi.useFakeTimers();

      const isIeOrEdgeSpy = vi.spyOn(utils, "isIeOrEdge").mockReturnValueOnce(true);
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("div"));
      drainPendingTimers();

      expect(onClickSpy).toHaveBeenCalled();
      vi.useRealTimers();
      isIeOrEdgeSpy.mockClear();
    });

    it("should not use showOpenFilePicker() if supported and {useFsAccessApi} is not true", () => {
      vi.useFakeTimers();

      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

      const showOpenFilePickerMock = vi.fn();

      window.showOpenFilePicker = showOpenFilePickerMock;

      const onDropSpy = vi.fn();
      const onFileDialogOpenSpy = vi.fn();

      const {container} = render(
        <Dropzone
          onDrop={onDropSpy}
          onFileDialogOpen={onFileDialogOpenSpy}
          accept={{
            "application/pdf": []
          }}
          multiple
        >
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(showOpenFilePickerMock).not.toHaveBeenCalled();
      expect(onClickSpy).toHaveBeenCalled();
      expect(onFileDialogOpenSpy).toHaveBeenCalled();
      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);

      focusWindow();
      drainPendingTimers();

      expect(activeRef.current).toBeNull();
      expect(dropzone).not.toContainElement(activeRef.current);
      expect(onDropSpy).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it("should not use showOpenFilePicker() if supported and {isSecureContext} is not true", () => {
      vi.useFakeTimers();

      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

      const showOpenFilePickerMock = vi.fn();

      window.showOpenFilePicker = showOpenFilePickerMock;
      window.isSecureContext = false;

      const onDropSpy = vi.fn();
      const onFileDialogOpenSpy = vi.fn();

      const {container} = render(
        <Dropzone
          onDrop={onDropSpy}
          onFileDialogOpen={onFileDialogOpenSpy}
          accept={{
            "application/pdf": []
          }}
          multiple
        >
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(showOpenFilePickerMock).not.toHaveBeenCalled();
      expect(onClickSpy).toHaveBeenCalled();
      expect(onFileDialogOpenSpy).toHaveBeenCalled();
      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);

      focusWindow();
      drainPendingTimers();

      expect(activeRef.current).toBeNull();
      expect(dropzone).not.toContainElement(activeRef.current);
      expect(onDropSpy).not.toHaveBeenCalled();

      vi.useRealTimers();

      window.isSecureContext = true;
    });

    it("should use showOpenFilePicker() if supported and {useFsAccessApi} is true, and not trigger click on input", async () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

      const handlers = files.map(f => createFileSystemFileHandle(f));
      const thenable = createThenable();
      const showOpenFilePickerMock = vi.fn().mockReturnValue(thenable.promise);

      window.showOpenFilePicker = showOpenFilePickerMock;

      const onDropSpy = vi.fn();
      const onFileDialogOpenSpy = vi.fn();

      const {container} = render(
        <Dropzone
          onDrop={onDropSpy}
          onFileDialogOpen={onFileDialogOpenSpy}
          accept={{
            "application/pdf": []
          }}
          multiple
          useFsAccessApi
        >
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(showOpenFilePickerMock).toHaveBeenCalledWith({
        multiple: true,
        types: [
          {
            description: "Files",
            accept: {"application/pdf": []}
          }
        ]
      });
      expect(onClickSpy).not.toHaveBeenCalled();
      expect(onFileDialogOpenSpy).toHaveBeenCalled();

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);

      await act(() => thenable.done(handlers));

      expect(activeRef.current).toBeNull();
      expect(dropzone).not.toContainElement(activeRef.current);

      expect(onDropSpy).toHaveBeenCalledWith(files, [], null);
    });

    test("if showOpenFilePicker() is supported and {useFsAccessApi} is true, it should work without the <input>", async () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;

      const handlers = files.map(f => createFileSystemFileHandle(f));
      const thenable = createThenable();
      const showOpenFilePickerMock = vi.fn().mockReturnValue(thenable.promise);

      window.showOpenFilePicker = showOpenFilePickerMock;

      const onDropSpy = vi.fn();
      const onFileDialogOpenSpy = vi.fn();

      const {container} = render(
        <Dropzone onDrop={onDropSpy} onFileDialogOpen={onFileDialogOpenSpy} useFsAccessApi>
          {({getRootProps, isFileDialogActive}) => <div {...getRootProps()}>{isFileDialogActive && active}</div>}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(showOpenFilePickerMock).toHaveBeenCalled();
      expect(onFileDialogOpenSpy).toHaveBeenCalled();

      await act(() => thenable.done(handlers));

      expect(activeRef.current).toBeNull();
      expect(dropzone).not.toContainElement(activeRef.current);
      expect(onDropSpy).toHaveBeenCalledWith(files, [], null);
    });

    test("if showOpenFilePicker() is supported and {useFsAccessApi} is true, and the user cancels it should call onFileDialogCancel", async () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;

      const thenable = createThenable();
      const showOpenFilePickerMock = vi.fn().mockReturnValue(thenable.promise);

      window.showOpenFilePicker = showOpenFilePickerMock;

      const onDropSpy = vi.fn();
      const onFileDialogCancelSpy = vi.fn();

      const {container} = render(
        <Dropzone onDrop={onDropSpy} onFileDialogCancel={onFileDialogCancelSpy} useFsAccessApi>
          {({getRootProps, isFileDialogActive}) => <div {...getRootProps()}>{isFileDialogActive && active}</div>}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(showOpenFilePickerMock).toHaveBeenCalled();

      await act(() => thenable.cancel(new DOMException("user aborted request", "AbortError")));

      expect(activeRef.current).toBeNull();
      expect(dropzone).not.toContainElement(activeRef.current);
      expect(onFileDialogCancelSpy).toHaveBeenCalled();
      expect(onDropSpy).not.toHaveBeenCalled();
    });

    test("window focus evt is not bound if showOpenFilePicker() is supported and {useFsAccessApi} is true", async () => {
      vi.useFakeTimers();

      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onFileDialogCancelSpy = vi.fn();

      const thenable = createThenable();
      const showOpenFilePickerMock = vi.fn().mockReturnValue(thenable.promise);

      window.showOpenFilePicker = showOpenFilePickerMock;

      const {container} = render(
        <Dropzone onFileDialogCancel={onFileDialogCancelSpy} useFsAccessApi>
          {({getRootProps, isFileDialogActive}) => <div {...getRootProps()}>{isFileDialogActive && active}</div>}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);

      await act(() => thenable.cancel(new DOMException("user aborted request", "AbortError")));

      // Try to focus window and run timers
      focusWindow();
      drainPendingTimers();

      expect(activeRef.current).toBeNull();
      expect(dropzone).not.toContainElement(activeRef.current);
      expect(onFileDialogCancelSpy).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it("should try to use showOpenFilePicker() and fallback to input in case of a security error", async () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

      const thenable = createThenable();
      const showOpenFilePickerMock = vi.fn().mockReturnValue(thenable.promise);

      window.showOpenFilePicker = showOpenFilePickerMock;

      const onDropSpy = vi.fn();
      const onFileDialogOpenSpy = vi.fn();

      const {container} = render(
        <Dropzone
          onDrop={onDropSpy}
          onFileDialogOpen={onFileDialogOpenSpy}
          accept={{
            "application/pdf": []
          }}
          multiple
          useFsAccessApi
        >
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);
      expect(onFileDialogOpenSpy).toHaveBeenCalled();

      await act(() => thenable.cancel(new DOMException("Cannot use this API cross-origin", "SecurityError")));

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);
      expect(onClickSpy).toHaveBeenCalled();
    });

    it("should try to use showOpenFilePicker() and fallback to input in case of a not allowed error", async () => {
      // Some browsers/configurations (e.g. Microsoft Edge for Business) block showOpenFilePicker()
      // and reject with a NotAllowedError instead of showing the picker.
      // See https://github.com/react-dropzone/react-dropzone/issues/1429
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

      const thenable = createThenable();
      const showOpenFilePickerMock = vi.fn().mockReturnValue(thenable.promise);

      window.showOpenFilePicker = showOpenFilePickerMock;

      const onDropSpy = vi.fn();
      const onErrorSpy = vi.fn();
      const onFileDialogOpenSpy = vi.fn();

      const {container} = render(
        <Dropzone
          onDrop={onDropSpy}
          onError={onErrorSpy}
          onFileDialogOpen={onFileDialogOpenSpy}
          accept={{
            "application/pdf": []
          }}
          multiple
          useFsAccessApi
        >
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);
      expect(onFileDialogOpenSpy).toHaveBeenCalled();

      await act(() =>
        thenable.cancel(new DOMException("The request is not allowed by the user agent", "NotAllowedError"))
      );

      expect(onClickSpy).toHaveBeenCalled();
      // A blocked picker is not an error the consumer should see - we fall back silently
      expect(onErrorSpy).not.toHaveBeenCalled();
    });

    test("window focus evt is bound if showOpenFilePicker() is supported but errors due to a security error", async () => {
      vi.useFakeTimers();

      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onFileDialogCancelSpy = vi.fn();

      const thenable = createThenable();
      const showOpenFilePickerMock = vi.fn().mockReturnValue(thenable.promise);

      window.showOpenFilePicker = showOpenFilePickerMock;

      const {container} = render(
        <Dropzone onFileDialogCancel={onFileDialogCancelSpy} useFsAccessApi>
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);

      await act(() => thenable.cancel(new DOMException("Cannot use this API cross-origin", "SecurityError")));

      focusWindow();
      drainPendingTimers();

      expect(onFileDialogCancelSpy).toHaveBeenCalled();
      expect(dropzone).not.toContainElement(activeRef.current);

      vi.useRealTimers();
    });

    test("showOpenFilePicker() should call {onError} when an unexpected error occurs", async () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;

      const thenable = createThenable();
      const showOpenFilePickerMock = vi.fn().mockReturnValue(thenable.promise);

      window.showOpenFilePicker = showOpenFilePickerMock;

      const onErrorSpy = vi.fn();
      const onDropSpy = vi.fn();
      const onFileDialogOpenSpy = vi.fn();

      const ui = (
        <Dropzone
          onError={onErrorSpy}
          onDrop={onDropSpy}
          onFileDialogOpen={onFileDialogOpenSpy}
          accept={{
            "application/pdf": []
          }}
          multiple
          useFsAccessApi
        >
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const {container} = render(ui);

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);
      expect(onFileDialogOpenSpy).toHaveBeenCalled();

      const err = new Error("oops :(");
      await act(() => thenable.cancel(err));
      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);
      expect(onErrorSpy).toHaveBeenCalledWith(err);
    });

    test("showOpenFilePicker() should call {onError} when a security error occurs and no <input> was provided", async () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;

      const thenable = createThenable();
      const showOpenFilePickerMock = vi.fn().mockReturnValue(thenable.promise);

      window.showOpenFilePicker = showOpenFilePickerMock;

      const onErrorSpy = vi.fn();
      const onDropSpy = vi.fn();
      const onFileDialogOpenSpy = vi.fn();

      const ui = (
        <Dropzone
          onError={onErrorSpy}
          onDrop={onDropSpy}
          onFileDialogOpen={onFileDialogOpenSpy}
          accept={{
            "application/pdf": []
          }}
          multiple
          useFsAccessApi
        >
          {({getRootProps, isFileDialogActive}) => <div {...getRootProps()}>{isFileDialogActive && active}</div>}
        </Dropzone>
      );

      const {container} = render(ui);

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);
      expect(onFileDialogOpenSpy).toHaveBeenCalled();

      const err = new DOMException("oops :(", "SecurityError");
      await act(() => thenable.cancel(err));
      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);
      expect(onErrorSpy).toHaveBeenCalled();
    });
  });

  describe("onKeyDown", () => {
    it("triggers the click event on the input if the SPACE/ENTER keys are pressed", () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.keyDown(dropzone, {
        keyCode: 32 // Space
      });

      fireEvent.keyDown(dropzone, {
        keyCode: 13 // Enter
      });

      fireEvent.keyDown(dropzone, {
        key: " " // Space
      });

      fireEvent.keyDown(dropzone, {
        key: "Enter"
      });

      const ref = activeRef.current;
      expect(ref).not.toBeNull();
      expect(dropzone).toContainElement(ref);
      expect(onClickSpy).toHaveBeenCalledTimes(4);
    });

    it("does not trigger the click event on the input if the dropzone is not in focus", () => {
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const input = container.querySelector("input");

      fireEvent.keyDown(input, {
        keyCode: 32 // Space
      });

      fireEvent.keyDown(input, {
        key: " " // Space
      });

      expect(onClickSpy).not.toHaveBeenCalled();
    });

    it("does not trigger the click event on the input if event propagation was stopped", () => {
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div
              {...getRootProps({
                onKeyDown: event => event.stopPropagation()
              })}
            >
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.keyDown(dropzone, {
        keyCode: 32 // Space
      });
      fireEvent.keyDown(dropzone, {
        key: " " // Space
      });
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    it("does not trigger the click event on the input if {noKeyboard} is true", () => {
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container} = render(
        <Dropzone noKeyboard>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.keyDown(dropzone, {
        keyCode: 32 // Space
      });
      fireEvent.keyDown(dropzone, {
        key: " " // Space
      });
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    it("restores the keydown behavior when {noKeyboard} is set back to false", () => {
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container, rerender} = render(
        <Dropzone noKeyboard>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.keyDown(dropzone, {
        keyCode: 32 // Space
      });
      fireEvent.keyDown(dropzone, {
        key: " " // Space
      });
      expect(onClickSpy).not.toHaveBeenCalled();

      rerender(
        <Dropzone noKeyboard={false}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      fireEvent.keyDown(dropzone, {
        keyCode: 32 // Space
      });
      fireEvent.keyDown(dropzone, {
        key: " " // Space
      });
      expect(onClickSpy).toHaveBeenCalledTimes(2);
    });

    it("does not trigger the click event on the input for other keys", () => {
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.keyDown(dropzone, {
        keyCode: 97 // Numpad1
      });
      fireEvent.keyDown(dropzone, {
        key: "1"
      });
      expect(onClickSpy).not.toHaveBeenCalled();
    });
  });

  describe("onDrag*", () => {
    it("invokes callbacks for the appropriate events", async () => {
      const data = createDtWithFiles(files);

      const props = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      const {container} = render(
        <Dropzone {...props}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, data));
      expect(props.onDragEnter).toHaveBeenCalled();

      fireEvent.dragOver(dropzone, data);
      expect(props.onDragOver).toHaveBeenCalled();

      fireEvent.dragLeave(dropzone, data);
      expect(props.onDragLeave).toHaveBeenCalled();

      await act(() => fireEvent.drop(dropzone, data));
      expect(props.onDrop).toHaveBeenCalled();
    });

    it("invokes callbacks for the appropriate events even if it cannot access the data", async () => {
      const emptyData = createDtWithFiles([]);

      const props = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn(),
        onDropAccepted: vi.fn(),
        onDropRejected: vi.fn()
      };

      const {container} = render(
        <Dropzone {...props}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, emptyData));
      expect(props.onDragEnter).toHaveBeenCalled();

      fireEvent.dragOver(dropzone, emptyData);
      expect(props.onDragOver).toHaveBeenCalled();

      fireEvent.dragLeave(dropzone, emptyData);
      expect(props.onDragLeave).toHaveBeenCalled();

      const data = createDtWithFiles(files);
      await act(() => fireEvent.drop(dropzone, data));
      expect(props.onDrop).toHaveBeenCalled();
      expect(props.onDropAccepted).toHaveBeenCalledWith(files, expect.any(Object));
      expect(props.onDropRejected).not.toHaveBeenCalled();
    });

    it("does not invoke callbacks if no files are detected", async () => {
      const data = {
        dataTransfer: {
          items: [],
          types: ["text/html", "text/plain"]
        }
      };

      const props = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn(),
        onDropAccepted: vi.fn(),
        onDropRejected: vi.fn()
      };

      const {container} = render(
        <Dropzone {...props}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, data));
      expect(props.onDragEnter).not.toHaveBeenCalled();

      fireEvent.dragOver(dropzone, data);
      expect(props.onDragOver).not.toHaveBeenCalled();

      fireEvent.dragLeave(dropzone, data);
      expect(props.onDragLeave).not.toHaveBeenCalled();

      await act(() => fireEvent.drop(dropzone, data));
      expect(props.onDrop).not.toHaveBeenCalled();
      expect(props.onDropAccepted).not.toHaveBeenCalled();
      expect(props.onDropRejected).not.toHaveBeenCalled();
    });

    it("does not invoke callbacks if {noDrag} is true", async () => {
      const data = createDtWithFiles(files);

      const props = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn(),
        onDropAccepted: vi.fn(),
        onDropRejected: vi.fn()
      };

      const {container} = render(
        <Dropzone {...props} noDrag>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, data));
      expect(props.onDragEnter).not.toHaveBeenCalled();

      fireEvent.dragOver(dropzone, data);
      expect(props.onDragOver).not.toHaveBeenCalled();

      fireEvent.dragLeave(dropzone, data);
      expect(props.onDragLeave).not.toHaveBeenCalled();

      await act(() => fireEvent.drop(dropzone, data));
      expect(props.onDrop).not.toHaveBeenCalled();
      expect(props.onDropAccepted).not.toHaveBeenCalled();
      expect(props.onDropRejected).not.toHaveBeenCalled();
    });

    it("restores drag behavior if {noDrag} is set back to false", async () => {
      const data = createDtWithFiles(files);

      const props = {
        onDragEnter: vi.fn(),
        onDragOver: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn()
      };

      const {container, rerender} = render(
        <Dropzone {...props} noDrag>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, data));
      expect(props.onDragEnter).not.toHaveBeenCalled();

      fireEvent.dragOver(dropzone, data);
      expect(props.onDragOver).not.toHaveBeenCalled();

      fireEvent.dragLeave(dropzone, data);
      expect(props.onDragLeave).not.toHaveBeenCalled();

      await act(() => fireEvent.drop(dropzone, data));
      expect(props.onDrop).not.toHaveBeenCalled();

      rerender(
        <Dropzone {...props} noDrag={false}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      await act(() => fireEvent.dragEnter(dropzone, data));
      expect(props.onDragEnter).toHaveBeenCalled();

      fireEvent.dragOver(dropzone, data);
      expect(props.onDragOver).toHaveBeenCalled();

      fireEvent.dragLeave(dropzone, data);
      expect(props.onDragLeave).toHaveBeenCalled();

      await act(() => fireEvent.drop(dropzone, data));
      expect(props.onDrop).toHaveBeenCalled();
    });

    it("sets {isDragActive} and {isDragAccept} if some files are accepted on dragenter", async () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive && "dragActive"}
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles(files)));

      expect(dropzone).toHaveTextContent("dragActive");
      expect(dropzone).toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");
    });

    it("sets {isDragActive} and {isDragReject} of some files are not accepted on dragenter", async () => {
      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
        >
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive && "dragActive"}
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles([...files, ...images])));

      expect(dropzone).toHaveTextContent("dragActive");
      expect(dropzone).not.toHaveTextContent("dragAccept");
      expect(dropzone).toHaveTextContent("dragReject");
    });

    it("sets {dragFileRejections} with errors while files are dragged", async () => {
      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
        >
          {({getRootProps, getInputProps, dragFileRejections, fileRejections}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <span data-testid="drop-rejections">{fileRejections.length}</span>
              <ul>
                {dragFileRejections.flatMap(({errors}, rejectionIndex) =>
                  errors.map(error => (
                    <li key={`${rejectionIndex}-${error.code}`} data-type="drag-error">
                      {error.code}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles(files)));

      expect(container.querySelector(`[data-testid="drop-rejections"]`)).toHaveTextContent("0");
      expect(container.querySelectorAll(`[data-type="drag-error"]`)).toHaveLength(files.length);
      expect(dropzone).toHaveTextContent("file-invalid-type");

      fireEvent.dragLeave(dropzone, createDtWithFiles(files));

      expect(container.querySelectorAll(`[data-type="drag-error"]`)).toHaveLength(0);
    });

    it("sets {dragFileRejections} for surplus files while dragging", async () => {
      const {container} = render(
        <Dropzone multiple={false}>
          {({getRootProps, getInputProps, dragFileRejections}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {dragFileRejections.map(({errors}, rejectionIndex) =>
                errors.map(error => (
                  <span key={`${rejectionIndex}-${error.code}`} data-type="drag-error">
                    {error.code}
                  </span>
                ))
              )}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles(images)));

      expect(container.querySelectorAll(`[data-type="drag-error"]`)).toHaveLength(1);
      expect(dropzone).toHaveTextContent("too-many-files");
    });

    it("sets {isDragReject} if some files are too large", async () => {
      const {container} = render(
        <Dropzone maxSize={0}>
          {({getRootProps, getInputProps, isDragAccept, isDragReject}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles(files)));

      expect(dropzone).not.toHaveTextContent("dragAccept");
      expect(dropzone).toHaveTextContent("dragReject");
    });

    it("accepts files with empty type during dragenter (Chrome .md file issue)", async () => {
      const markdownFiles = [createFile("README.md", 1234, "text/markdown")];

      const {container} = render(
        <Dropzone
          accept={{
            "text/markdown": [".md"]
          }}
        >
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive && "dragActive"}
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      // Simulate Chrome's behavior: during drag, .md files have empty type
      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles(markdownFiles, {emptyTypes: true})));

      expect(dropzone).toHaveTextContent("dragActive");
      expect(dropzone).toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");
    });

    it("sets {isDragActive, isDragAccept, isDragReject} if any files are rejected and {multiple} is false on dragenter", async () => {
      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
          multiple={false}
        >
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive && "dragActive"}
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles(images)));

      expect(dropzone).toHaveTextContent("dragActive");
      expect(dropzone).not.toHaveTextContent("dragAccept");
      expect(dropzone).toHaveTextContent("dragReject");
    });

    it("keeps {isDragActive} if dragleave is triggered for some arbitrary node", async () => {
      const {container: overlayContainer} = render(<div />);

      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive && "dragActive"}
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles(files)));

      fireEvent.dragLeave(dropzone, {
        bubbles: true,
        target: overlayContainer.querySelector("div")
      });

      expect(dropzone).toHaveTextContent("dragActive");
    });

    it("resets {isDragActive, isDragAccept, isDragReject} on dragleave", async () => {
      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
        >
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive && "dragActive"}
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
              {!isDragActive && <span id="child" data-accept={isDragAccept} data-reject={isDragReject} />}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      const data = createDtWithFiles(images);

      await act(() => fireEvent.dragEnter(container.querySelector("#child"), data));
      await act(() => fireEvent.dragEnter(dropzone, data));

      await act(() => fireEvent.dragEnter(dropzone, data));

      expect(dropzone).toHaveTextContent("dragActive");
      expect(dropzone).toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");

      fireEvent.dragLeave(dropzone, data);
      expect(dropzone).toHaveTextContent("dragActive");
      expect(dropzone).toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");

      fireEvent.dragLeave(dropzone, data);
      expect(dropzone).not.toHaveTextContent("dragActive");
      expect(dropzone).not.toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");

      const child = container.querySelector("#child");
      expect(child).toHaveAttribute("data-accept", "false");
      expect(child).toHaveAttribute("data-reject", "false");
    });
  });

  describe("onDrop", () => {
    test("callback is invoked when <input> change event occurs", async () => {
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone onDrop={onDropSpy}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      await act(async () =>
        fireEvent.change(container.querySelector("input"), {
          target: {files}
        })
      );

      expect(onDropSpy).toHaveBeenCalledWith(files, [], expect.anything());
    });

    it("sets {acceptedFiles, fileRejections, isDragReject}", async () => {
      const FileList = ({files = []}) => (
        <ul>
          {files.map(file => (
            <li key={file.name} data-type={"accepted"}>
              {file.name}
            </li>
          ))}
        </ul>
      );

      const RejectedFileList = ({fileRejections = []}) => (
        <ul>
          {fileRejections.map(({file, errors}) => (
            <li key={file.name}>
              <span data-type={"rejected"}>{file.name}</span>
              <ul>
                {errors.map(e => (
                  <li key={e.code} data-type={"error"}>
                    {e.code}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      );

      const getAcceptedFiles = node => node.querySelectorAll(`[data-type="accepted"]`);
      const getRejectedFiles = node => node.querySelectorAll(`[data-type="rejected"]`);
      const getRejectedFilesErrors = node => node.querySelectorAll(`[data-type="error"]`);

      const matchToFiles = (fileList, files) =>
        Array.from(fileList).every(item => !!files.find(file => file.name === item.textContent));
      const matchToErrorCode = (errorList, code) => Array.from(errorList).every(item => item.textContent === code);

      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
        >
          {({getRootProps, getInputProps, acceptedFiles, fileRejections, isDragReject}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <FileList files={acceptedFiles} />
              <RejectedFileList fileRejections={fileRejections} />
              {isDragReject && "dragReject"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(images)));

      const acceptedFileList = getAcceptedFiles(dropzone);
      expect(acceptedFileList).toHaveLength(images.length);
      expect(matchToFiles(acceptedFileList, images)).toBe(true);
      expect(dropzone).not.toHaveTextContent("dragReject");

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      const rejectedFileList = getRejectedFiles(dropzone);
      expect(rejectedFileList).toHaveLength(files.length);
      expect(matchToFiles(rejectedFileList, files)).toBe(true);
      const rejectedFileErrorList = getRejectedFilesErrors(dropzone);
      expect(rejectedFileErrorList).toHaveLength(files.length);
      expect(matchToErrorCode(rejectedFileErrorList, "file-invalid-type")).toBe(true);
      // After drop, isDragReject should be false even if files were rejected
      expect(dropzone).not.toHaveTextContent("dragReject");
    });

    it("resets {isDragActive, isDragAccept, isDragReject}", async () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive && "dragActive"}
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      const data = createDtWithFiles(files);

      await act(() => fireEvent.dragEnter(dropzone, data));

      expect(dropzone).toHaveTextContent("dragActive");
      expect(dropzone).toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");

      await act(() => fireEvent.drop(dropzone, data));

      expect(dropzone).not.toHaveTextContent("dragActive");
      expect(dropzone).not.toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");
    });

    it("isDragReject is false after rejected drop and updates correctly on new drag", async () => {
      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
        >
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, fileRejections}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive && "dragActive"}
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
              {fileRejections.length > 0 && "hasRejections"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      // Drop rejected files
      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      // After drop, isDragReject should be false but fileRejections should be populated
      expect(dropzone).not.toHaveTextContent("dragActive");
      expect(dropzone).not.toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");
      expect(dropzone).toHaveTextContent("hasRejections");

      // New drag with rejected files should set isDragReject to true
      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles(files)));

      expect(dropzone).toHaveTextContent("dragActive");
      expect(dropzone).not.toHaveTextContent("dragAccept");
      expect(dropzone).toHaveTextContent("dragReject");

      // Drag leave should reset drag state
      await act(() => fireEvent.dragLeave(dropzone, createDtWithFiles(files)));

      expect(dropzone).not.toHaveTextContent("dragActive");
      expect(dropzone).not.toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");
      // But fileRejections should still be there from the previous drop
      expect(dropzone).toHaveTextContent("hasRejections");

      // New drag with accepted files should set isDragAccept
      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles(images)));

      expect(dropzone).toHaveTextContent("dragActive");
      expect(dropzone).toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");
    });

    it("sets {isDragGlobal} to true when drag event is detected on document", async () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isDragGlobal}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragGlobal && "dragGlobal"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(document.body, createDtWithFiles(files)));

      expect(dropzone).toHaveTextContent("dragGlobal");
    });

    it("sets {isDragGlobal} to false when drag leaves document", async () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isDragGlobal}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragGlobal && "dragGlobal"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(document.body, createDtWithFiles(files)));
      expect(dropzone).toHaveTextContent("dragGlobal");

      await act(() => fireEvent.dragLeave(document.body, createDtWithFiles(files)));
      expect(dropzone).not.toHaveTextContent("dragGlobal");
    });

    it("sets {isDragGlobal} to false when drop occurs on document", async () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isDragGlobal}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragGlobal && "dragGlobal"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(document.body, createDtWithFiles(files)));
      expect(dropzone).toHaveTextContent("dragGlobal");

      await act(() => fireEvent.drop(document.body, createDtWithFiles(files)));
      expect(dropzone).not.toHaveTextContent("dragGlobal");
    });

    it("sets {isDragGlobal} to false when dragend occurs on document", async () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isDragGlobal}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragGlobal && "dragGlobal"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(document.body, createDtWithFiles(files)));
      expect(dropzone).toHaveTextContent("dragGlobal");

      fireEvent.dragEnd(document.body, createDtWithFiles(files));
      expect(dropzone).not.toHaveTextContent("dragGlobal");
    });

    it("rejects all files if {multiple} is false and {accept} criteria is not met", async () => {
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
          onDrop={onDropSpy}
          multiple={false}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [],
        [
          {
            file: files[0],
            errors: [
              {
                code: "file-invalid-type",
                message: "File type must be image/*"
              }
            ]
          }
        ],
        expect.anything()
      );
    });

    // https://github.com/react-dropzone/react-dropzone/issues/1220
    describe("wildcard MIME type paired with extensions", () => {
      const accept = {"image/*": [".jpeg", ".png"]};

      it("sets only the extensions on the <input> {accept} attribute", () => {
        const {container} = render(
          <Dropzone accept={accept}>
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
        );

        expect(container.querySelector("input")).toHaveAttribute("accept", ".jpeg,.png");
      });

      it("accepts files whose extension matches and rejects the others on drop", async () => {
        const onDropSpy = vi.fn();
        const png = createFile("cats.png", 1234, "image/png");
        const gif = createFile("cats.gif", 1234, "image/gif");

        const {container} = render(
          <Dropzone accept={accept} onDrop={onDropSpy} multiple>
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
        );
        const dropzone = container.querySelector("div");

        await act(() => fireEvent.drop(dropzone, createDtWithFiles([png, gif])));

        expect(onDropSpy).toHaveBeenCalledWith(
          [png],
          [
            {
              file: gif,
              errors: [
                {
                  code: "file-invalid-type",
                  message: "File type must be one of .jpeg, .png"
                }
              ]
            }
          ],
          expect.anything()
        );
      });

      it("still reacts with {isDragAccept} via the MIME type during a drag", async () => {
        const {container} = render(
          <Dropzone accept={accept}>
            {({getRootProps, getInputProps, isDragAccept, isDragReject}) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragAccept && "dragAccept"}
                {isDragReject && "dragReject"}
              </div>
            )}
          </Dropzone>
        );
        const dropzone = container.querySelector("div");

        // File names (hence extensions) aren't readable during a drag, so the wildcard
        // MIME type is what drives {isDragAccept} - even for an image whose extension is
        // ultimately rejected on drop.
        await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles([createFile("cats.gif", 1234, "image/gif")])));

        expect(dropzone).toHaveTextContent("dragAccept");
        expect(dropzone).not.toHaveTextContent("dragReject");
      });
    });

    it("accepts the first file and rejects the surplus if {multiple} is false and {accept} criteria is met", async () => {
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
          onDrop={onDropSpy}
          multiple={false}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(images)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [images[0]],
        [
          {
            file: images[1],
            errors: [
              {
                code: "too-many-files",
                message: "Too many files"
              }
            ]
          }
        ],
        expect.anything()
      );
    });

    it("accepts up to {maxFiles} and rejects the surplus if {multiple} is true and {accept} criteria is met", async () => {
      const onDropSpy = vi.fn();
      const onDropRejectedSpy = vi.fn();

      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
          onDrop={onDropSpy}
          onDropRejected={onDropRejectedSpy}
          multiple={true}
          maxFiles={1}
        >
          {({getRootProps, getInputProps, isDragReject, isDragAccept}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragReject && "dragReject"}
              {isDragAccept && "dragAccept"}
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(images)));

      expect(onDropRejectedSpy).toHaveBeenCalled();

      await act(() => fireEvent.dragEnter(dropzone, createDtWithFiles(images)));

      expect(dropzone).toHaveTextContent("dragReject");
      expect(dropzone).not.toHaveTextContent("dragAccept");
      expect(onDropSpy).toHaveBeenCalledWith(
        [images[0]],
        [
          {
            file: images[1],
            errors: [
              {
                code: "too-many-files",
                message: "Too many files"
              }
            ]
          }
        ],
        expect.anything()
      );
    });

    it("accepts up to {maxFiles} and rejects the surplus when {maxFiles} is updated to be less than files", async () => {
      const onDropSpy = vi.fn();
      const onDropRejectedSpy = vi.fn();
      const ui = maxFiles => (
        <Dropzone
          accept={{
            "image/*": []
          }}
          onDrop={onDropSpy}
          multiple={true}
          maxFiles={maxFiles}
          onDropRejected={onDropRejectedSpy}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const {container, rerender} = render(ui(3));
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(images)));
      rerender(ui(3));

      expect(onDropRejectedSpy).not.toHaveBeenCalled();
      expect(onDropSpy).toHaveBeenCalledWith(images, [], expect.anything());

      rerender(ui(1));

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(images)));
      rerender(ui(1));

      // Only the surplus file (beyond {maxFiles}) is rejected; the first file is still accepted.
      expect(onDropRejectedSpy).toHaveBeenCalledWith(
        [{file: images[1], errors: [{code: "too-many-files", message: "Too many files"}]}],
        expect.anything()
      );
      expect(onDropSpy).toHaveBeenLastCalledWith(
        [images[0]],
        [{file: images[1], errors: [{code: "too-many-files", message: "Too many files"}]}],
        expect.anything()
      );
    });

    // https://github.com/react-dropzone/react-dropzone/issues/1355
    // https://github.com/react-dropzone/react-dropzone/issues/1358
    describe("when more files are dropped than allowed", () => {
      it("accepts the first {maxFiles} valid files and rejects only the surplus (issue #1355)", async () => {
        const onDropSpy = vi.fn();
        const a = createFile("a.png", 1, "image/png");
        const b = createFile("b.png", 1, "image/png");
        const c = createFile("c.png", 1, "image/png");

        const {container} = render(
          <Dropzone accept={{"image/*": []}} onDrop={onDropSpy} multiple maxFiles={2}>
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
        );

        await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles([a, b, c])));

        expect(onDropSpy).toHaveBeenCalledWith(
          [a, b],
          [{file: c, errors: [{code: "too-many-files", message: "Too many files"}]}],
          expect.anything()
        );
      });

      it("accepts the first valid file and rejects the rest when {multiple} is false (issue #1355)", async () => {
        const onDropSpy = vi.fn();
        const a = createFile("a.png", 1, "image/png");
        const b = createFile("b.png", 1, "image/png");
        const c = createFile("c.png", 1, "image/png");

        const {container} = render(
          <Dropzone accept={{"image/*": []}} onDrop={onDropSpy} multiple={false}>
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
        );

        await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles([a, b, c])));

        expect(onDropSpy).toHaveBeenCalledWith(
          [a],
          [
            {file: b, errors: [{code: "too-many-files", message: "Too many files"}]},
            {file: c, errors: [{code: "too-many-files", message: "Too many files"}]}
          ],
          expect.anything()
        );
      });

      it("keeps a valid file within the limit and rejects the one failing its own check (issue #1358)", async () => {
        // A file that fails an individual check (here, size) is rejected with that error and does not
        // count towards the limit, so a second file that is both valid and within the limit is still
        // accepted - the drop is not rejected wholesale.
        const onDropSpy = vi.fn();
        const big = createFile("big.png", 2048, "image/png");
        const small = createFile("small.png", 512, "image/png");

        const {container} = render(
          <Dropzone accept={{"image/*": []}} onDrop={onDropSpy} multiple={false} maxSize={1024}>
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
        );

        await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles([big, small])));

        expect(onDropSpy).toHaveBeenCalledWith(
          [small],
          [{file: big, errors: [{code: "file-too-large", message: "File is larger than 1 KB"}]}],
          expect.anything()
        );
      });
    });

    it("accepts multiple files if {multiple} is true and {accept} criteria is met", async () => {
      const onDropSpy = vi.fn();
      const onDropRejectedSpy = vi.fn();

      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
          onDrop={onDropSpy}
          multiple={true}
          maxFiles={3}
          onDropRejected={onDropRejectedSpy}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles(images)));

      expect(onDropRejectedSpy).not.toHaveBeenCalled();
      expect(onDropSpy).toHaveBeenCalledWith(images, [], expect.anything());
    });

    it("accepts a single files if {multiple} is false and {accept} criteria is met", async () => {
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
          onDrop={onDropSpy}
          multiple={false}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const [image] = images;
      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles([image])));

      expect(onDropSpy).toHaveBeenCalledWith([image], [], expect.anything());
    });

    it("accepts all files if {multiple} is true", async () => {
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone onDrop={onDropSpy}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles(files)));

      expect(onDropSpy).toHaveBeenCalledWith(files, [], expect.anything());
    });

    it("resets {isFileDialogActive} state", async () => {
      const onDropSpy = vi.fn();
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;

      const {container} = render(
        <Dropzone onDrop={onDropSpy}>
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      expect(activeRef.current).toBeNull();
      expect(dropzone).not.toContainElement(activeRef.current);
    });

    it("gets invoked with both accepted/rejected files", async () => {
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
          onDrop={onDropSpy}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [],
        [
          {
            file: files[0],
            errors: [
              {
                code: "file-invalid-type",
                message: "File type must be image/*"
              }
            ]
          }
        ],
        expect.anything()
      );
      onDropSpy.mockClear();

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(images)));

      expect(onDropSpy).toHaveBeenCalledWith(images, [], expect.anything());
      onDropSpy.mockClear();

      await act(() => fireEvent.drop(dropzone, createDtWithFiles([...files, ...images])));

      expect(onDropSpy).toHaveBeenCalledWith(
        images,
        [
          {
            file: files[0],
            errors: [
              {
                code: "file-invalid-type",
                message: "File type must be image/*"
              }
            ]
          }
        ],
        expect.anything()
      );
    });

    test("onDropAccepted callback is invoked if some files are accepted", async () => {
      const onDropAcceptedSpy = vi.fn();

      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
          onDropAccepted={onDropAcceptedSpy}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));
      expect(onDropAcceptedSpy).not.toHaveBeenCalled();
      onDropAcceptedSpy.mockClear();

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(images)));

      expect(onDropAcceptedSpy).toHaveBeenCalledWith(images, expect.anything());
      onDropAcceptedSpy.mockClear();

      await act(() => fireEvent.drop(dropzone, createDtWithFiles([...files, ...images])));

      expect(onDropAcceptedSpy).toHaveBeenCalledWith(images, expect.anything());
    });

    test("onDropRejected callback is invoked if some files are rejected", async () => {
      const onDropRejectedSpy = vi.fn();

      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
          onDropRejected={onDropRejectedSpy}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      expect(onDropRejectedSpy).toHaveBeenCalledWith(
        [
          {
            file: files[0],
            errors: [
              {
                code: "file-invalid-type",
                message: "File type must be image/*"
              }
            ]
          }
        ],
        expect.anything()
      );
      onDropRejectedSpy.mockClear();

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(images)));

      expect(onDropRejectedSpy).not.toHaveBeenCalled();
      onDropRejectedSpy.mockClear();

      await act(() => fireEvent.drop(dropzone, createDtWithFiles([...files, ...images])));

      expect(onDropRejectedSpy).toHaveBeenCalledWith(
        [
          {
            file: files[0],
            errors: [
              {
                code: "file-invalid-type",
                message: "File type must be image/*"
              }
            ]
          }
        ],
        expect.anything()
      );
    });

    it("accepts a dropped image when Firefox provides a bogus file type", async () => {
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone
          accept={{
            "image/*": []
          }}
          onDrop={onDropSpy}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      const images = [createFile("bogus.gif", 1234, "application/x-moz-file")];
      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles(images)));

      expect(onDropSpy).toHaveBeenCalledWith(images, [], expect.anything());
    });

    it("filters files according to {maxSize}", async () => {
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone onDrop={onDropSpy} maxSize={1111}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles(images)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [],
        [
          {
            file: images[0],
            errors: [
              {
                code: "file-too-large",
                message: "File is larger than 1.08 KB"
              }
            ]
          },
          {
            file: images[1],
            errors: [
              {
                code: "file-too-large",
                message: "File is larger than 1.08 KB"
              }
            ]
          }
        ],
        expect.anything()
      );
    });

    it("filters files according to {minSize}", async () => {
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone onDrop={onDropSpy} minSize={1112}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [],
        [
          {
            file: files[0],
            errors: [
              {
                code: "file-too-small",
                message: "File is smaller than 1.09 KB"
              }
            ]
          }
        ],
        expect.anything()
      );
    });
  });

  describe("onFileDialogCancel", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("is not invoked every time window receives focus", () => {
      const onFileDialogCancelSpy = vi.fn();

      render(
        <Dropzone onFileDialogCancel={onFileDialogCancelSpy}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      focusWindow();
      drainPendingTimers();

      expect(onFileDialogCancelSpy).not.toHaveBeenCalled();
    });

    it("resets {isFileDialogActive}", () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const onFileDialogCancelSpy = vi.fn();

      const {container} = render(
        <Dropzone onFileDialogCancel={onFileDialogCancelSpy}>
          {({getRootProps, getInputProps, isFileDialogActive}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
            </div>
          )}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      fireEvent.click(dropzone);

      expect(activeRef.current).not.toBeNull();
      expect(dropzone).toContainElement(activeRef.current);

      focusWindow();
      drainPendingTimers();

      expect(onFileDialogCancelSpy).toHaveBeenCalled();
      expect(dropzone).not.toContainElement(activeRef.current);
    });

    it("is not invoked if <input> is not rendered", () => {
      const onFileDialogCancelSpy = vi.fn();
      const {container, rerender} = render(
        <Dropzone onFileDialogCancel={onFileDialogCancelSpy}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("div"));

      // Remove the input, then on window focus nothing should happen because we check if the input ref is set
      rerender(
        <Dropzone onFileDialogCancel={onFileDialogCancelSpy}>
          {({getRootProps}) => <div {...getRootProps()} />}
        </Dropzone>
      );

      focusWindow();
      drainPendingTimers();

      expect(onFileDialogCancelSpy).not.toHaveBeenCalled();
    });

    it("is not invoked if files were selected", async () => {
      const onFileDialogCancelSpy = vi.fn();

      const {container} = render(
        <Dropzone onFileDialogCancel={onFileDialogCancelSpy}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      await act(async () =>
        fireEvent.change(container.querySelector("input"), {
          target: {files}
        })
      );
      fireEvent.click(container.querySelector("div"));

      focusWindow();
      drainPendingTimers();

      expect(onFileDialogCancelSpy).not.toHaveBeenCalled();
    });

    it("does not throw if callback is not provided", () => {
      const {container} = render(
        <Dropzone onFileDialogCancel={null}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("div"));

      const fn = () => {
        focusWindow();
        drainPendingTimers();
      };
      expect(fn).not.toThrow();
    });
  });

  describe("onFileDialogOpen", () => {
    it("is invoked when opening the file dialog", () => {
      const onFileDialogOpenSpy = vi.fn();
      const {container} = render(
        <Dropzone onFileDialogOpen={onFileDialogOpenSpy}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("div"));

      expect(onFileDialogOpenSpy).toHaveBeenCalled();
    });

    it("is invoked when opening the file dialog programmatically", () => {
      const onFileDialogOpenSpy = vi.fn();
      const {container} = render(
        <Dropzone onFileDialogOpen={onFileDialogOpenSpy}>
          {({getRootProps, getInputProps, open}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button type="button" onClick={open}>
                Open
              </button>
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("button"));

      expect(onFileDialogOpenSpy).toHaveBeenCalled();
    });
  });

  describe("{open}", () => {
    it("can open file dialog programmatically", () => {
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, open}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button type="button" onClick={open}>
                Open
              </button>
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("button"));

      expect(onClickSpy).toHaveBeenCalled();
    });

    it("sets {isFileDialogActive} state", () => {
      const activeRef = createRef();
      const active = <span ref={activeRef}>I am active</span>;
      const {container} = render(
        <Dropzone>
          {({getRootProps, getInputProps, isFileDialogActive, open}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isFileDialogActive && active}
              <button type="button" onClick={open}>
                Open
              </button>
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("button"));

      expect(activeRef.current).not.toBeNull();
      expect(container.querySelector("div")).toContainElement(activeRef.current);
    });

    it("does nothing if {disabled} is true", () => {
      const onClickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const {container} = render(
        <Dropzone disabled>
          {({getRootProps, getInputProps, open}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button type="button" onClick={open}>
                Open
              </button>
            </div>
          )}
        </Dropzone>
      );

      fireEvent.click(container.querySelector("button"));

      expect(onClickSpy).not.toHaveBeenCalled();
    });

    it("does not throw if <input> is missing", () => {
      const {container} = render(
        <Dropzone>
          {({getRootProps, open}) => (
            <div {...getRootProps()}>
              <button type="button" onClick={open}>
                Open
              </button>
            </div>
          )}
        </Dropzone>
      );

      const fn = () => fireEvent.click(container.querySelector("button"));
      expect(fn).not.toThrow();
    });
  });

  describe("validator", () => {
    it("rejects with custom error", async () => {
      const validator = file => {
        if (/dogs/i.test(file.name)) return {code: "dogs-not-allowed", message: "Dogs not allowed"};

        return null;
      };

      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone validator={validator} onDrop={onDropSpy} multiple={true}>
          {({getRootProps}) => <div {...getRootProps()} />}
        </Dropzone>
      );

      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles(images)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [images[0]],
        [
          {
            file: images[1],
            errors: [
              {
                code: "dogs-not-allowed",
                message: "Dogs not allowed"
              }
            ]
          }
        ],
        expect.anything()
      );
    });

    // A custom validator is typed `(file: File) => ...` but during a drag we only have
    // DataTransferItems (no name/size), so we can't run it - the drag outcome is {isDragUnknown}
    // rather than a misleading accept/reject. See https://github.com/react-dropzone/react-dropzone/issues/1244
    it("sets {isDragUnknown} during a drag when a validator is set", async () => {
      const data = createDtWithFiles(images);
      const validator = () => ({
        code: "not-allowed",
        message: "Cannot do this!"
      });

      const ui = (
        <Dropzone validator={validator} multiple={true}>
          {({getRootProps, getInputProps, isDragAccept, isDragReject, isDragUnknown}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
              {isDragUnknown && "dragUnknown"}
            </div>
          )}
        </Dropzone>
      );

      const {container} = render(ui);
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, data));

      expect(dropzone).not.toHaveTextContent("dragAccept");
      expect(dropzone).not.toHaveTextContent("dragReject");
      expect(dropzone).toHaveTextContent("dragUnknown");
    });

    // A confidently-failing MIME check can't be rescued by a validator on drop, so it stays a
    // reject during the drag even when a validator is configured.
    it("keeps {isDragReject} over {isDragUnknown} when a file's MIME type is confidently rejected", async () => {
      const data = createDtWithFiles(images);
      const validator = () => null;

      const ui = (
        <Dropzone validator={validator} accept={{"application/pdf": [".pdf"]}} multiple={true}>
          {({getRootProps, getInputProps, isDragAccept, isDragReject, isDragUnknown}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragAccept && "dragAccept"}
              {isDragReject && "dragReject"}
              {isDragUnknown && "dragUnknown"}
            </div>
          )}
        </Dropzone>
      );

      const {container} = render(ui);
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, data));

      expect(dropzone).toHaveTextContent("dragReject");
      expect(dropzone).not.toHaveTextContent("dragUnknown");
      expect(dropzone).not.toHaveTextContent("dragAccept");
    });

    // Regression for https://github.com/react-dropzone/react-dropzone/issues/1408: a validator
    // that reads `file.name` throws on a DataTransferItem (name is undefined). Previously the throw
    // aborted the drag handler and {isDragActive} never flipped to true. We must not run the
    // validator during a drag.
    it("still activates the drag when a validator reads file.name (#1408)", async () => {
      const data = createDtWithFiles(images);
      const onErrorSpy = vi.fn();
      const validator = file => (file.name.endsWith(".csv") ? null : {code: "file-invalid-type", message: "nope"});

      const ui = (
        <Dropzone validator={validator} onError={onErrorSpy} multiple={true}>
          {({getRootProps, getInputProps, isDragActive, isDragUnknown}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive && "dragActive"}
              {isDragUnknown && "dragUnknown"}
            </div>
          )}
        </Dropzone>
      );

      const {container} = render(ui);
      const dropzone = container.querySelector("div");

      await act(() => fireEvent.dragEnter(dropzone, data));

      expect(dropzone).toHaveTextContent("dragActive");
      expect(dropzone).toHaveTextContent("dragUnknown");
      expect(onErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("async validator", () => {
    it("awaits the validator and splits accepted/rejected files by its resolved result", async () => {
      const validator = async file =>
        /dogs/i.test(file.name) ? {code: "dogs-not-allowed", message: "Dogs not allowed"} : null;
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone validator={validator} onDrop={onDropSpy} multiple>
          {({getRootProps}) => <div {...getRootProps()} />}
        </Dropzone>
      );

      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles(images)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [images[0]],
        [{file: images[1], errors: [{code: "dogs-not-allowed", message: "Dogs not allowed"}]}],
        expect.anything()
      );
    });

    it("sets {isProcessing} while a validator is pending and clears it once resolved, deferring onDrop", async () => {
      const thenable = createThenable();
      const validator = () => thenable.promise;
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone validator={validator} onDrop={onDropSpy} multiple>
          {({getRootProps, isProcessing}) => <div {...getRootProps()}>{isProcessing && "processing"}</div>}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");
      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      // Validator hasn't resolved yet: we're processing and onDrop hasn't fired.
      expect(dropzone).toHaveTextContent("processing");
      expect(onDropSpy).not.toHaveBeenCalled();

      // Resolve the validator (accept the file).
      await act(() => thenable.done(null));

      expect(dropzone).not.toHaveTextContent("processing");
      expect(onDropSpy).toHaveBeenCalledWith(files, [], expect.anything());
    });

    it("sets {isProcessing} while an async getFilesFromEvent runs, even without a validator", async () => {
      const thenable = createThenable();
      const getFilesFromEvent = () => thenable.promise;
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone getFilesFromEvent={getFilesFromEvent} onDrop={onDropSpy} multiple>
          {({getRootProps, isProcessing}) => <div {...getRootProps()}>{isProcessing && "processing"}</div>}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");
      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      // Files haven't been read yet: we're processing and onDrop hasn't fired.
      expect(dropzone).toHaveTextContent("processing");
      expect(onDropSpy).not.toHaveBeenCalled();

      // Resolve getFilesFromEvent with the files.
      await act(() => thenable.done(files));

      expect(dropzone).not.toHaveTextContent("processing");
      expect(onDropSpy).toHaveBeenCalledWith(files, [], expect.anything());
    });

    it("routes a rejected validator to onError, does not call onDrop, and clears {isProcessing}", async () => {
      const thenable = createThenable();
      const validator = () => thenable.promise;
      const onDropSpy = vi.fn();
      const onErrorSpy = vi.fn();

      const {container} = render(
        <Dropzone validator={validator} onDrop={onDropSpy} onError={onErrorSpy} multiple>
          {({getRootProps, isProcessing}) => <div {...getRootProps()}>{isProcessing && "processing"}</div>}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");
      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));
      expect(dropzone).toHaveTextContent("processing");

      const err = new Error("validation service unavailable");
      await act(() => thenable.cancel(err));

      expect(onErrorSpy).toHaveBeenCalledWith(err);
      expect(onDropSpy).not.toHaveBeenCalled();
      expect(dropzone).not.toHaveTextContent("processing");
    });

    it("supersedes an in-flight validation when a second drop lands, only committing the latest", async () => {
      const first = createThenable();
      const second = createThenable();
      const promises = [first.promise, second.promise];
      let call = 0;
      const validator = () => promises[call++];
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone validator={validator} onDrop={onDropSpy} multiple>
          {({getRootProps}) => <div {...getRootProps()} />}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      // First drop (images), validation left pending.
      await act(() => fireEvent.drop(dropzone, createDtWithFiles(images)));
      // Second drop (files) supersedes the first before it resolves.
      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      // Resolve the superseded first run last - it must not commit its (stale) results.
      await act(() => second.done(null));
      await act(() => first.done(null));

      expect(onDropSpy).toHaveBeenCalledTimes(1);
      expect(onDropSpy).toHaveBeenCalledWith(files, [], expect.anything());
    });

    it("supersedes a run whose getFilesFromEvent is still pending when a newer drop lands", async () => {
      const first = createThenable();
      const second = createThenable();
      const promises = [first.promise, second.promise];
      let call = 0;
      const getFilesFromEvent = () => promises[call++];
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone getFilesFromEvent={getFilesFromEvent} onDrop={onDropSpy} multiple>
          {({getRootProps, isProcessing}) => <div {...getRootProps()}>{isProcessing && "processing"}</div>}
        </Dropzone>
      );

      const dropzone = container.querySelector("div");

      // Two drops land while the first's getFilesFromEvent is still pending.
      await act(() => fireEvent.drop(dropzone, createDtWithFiles(images)));
      await act(() => fireEvent.drop(dropzone, createDtWithFiles(files)));

      // Resolve the superseded first run last - it must not commit or resurrect the processing flag.
      await act(() => second.done(files));
      await act(() => first.done(images));

      expect(onDropSpy).toHaveBeenCalledTimes(1);
      expect(onDropSpy).toHaveBeenCalledWith(files, [], expect.anything());
      expect(dropzone).not.toHaveTextContent("processing");
    });

    it("still caps accepted files at {maxFiles} after async validation resolves", async () => {
      const validator = async () => null;
      const onDropSpy = vi.fn();

      const {container} = render(
        <Dropzone validator={validator} onDrop={onDropSpy} multiple maxFiles={1}>
          {({getRootProps}) => <div {...getRootProps()} />}
        </Dropzone>
      );

      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles(images)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [images[0]],
        [{file: images[1], errors: [{code: "too-many-files", message: "Too many files"}]}],
        expect.anything()
      );
    });
  });

  describe("getErrorMessage", () => {
    it("overrides built-in rejection messages by code and receives the file", async () => {
      const onDropSpy = vi.fn();
      const getErrorMessage = (error, file) =>
        error.code === "file-too-large" ? `${file.name} is too big` : error.message;

      const {container} = render(
        <Dropzone onDrop={onDropSpy} maxSize={1000} multiple getErrorMessage={getErrorMessage}>
          {({getRootProps}) => <div {...getRootProps()} />}
        </Dropzone>
      );

      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles(images)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [],
        [
          {file: images[0], errors: [{code: "file-too-large", message: "cats.gif is too big"}]},
          {file: images[1], errors: [{code: "file-too-large", message: "dogs.gif is too big"}]}
        ],
        expect.anything()
      );
    });

    it("also overrides custom validator error messages", async () => {
      const onDropSpy = vi.fn();
      const validator = () => ({code: "not-allowed", message: "Cannot do this!"});
      const getErrorMessage = error => (error.code === "not-allowed" ? "Localized: not allowed" : error.message);

      const {container} = render(
        <Dropzone onDrop={onDropSpy} validator={validator} multiple getErrorMessage={getErrorMessage}>
          {({getRootProps}) => <div {...getRootProps()} />}
        </Dropzone>
      );

      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles(images)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [],
        [
          {file: images[0], errors: [{code: "not-allowed", message: "Localized: not allowed"}]},
          {file: images[1], errors: [{code: "not-allowed", message: "Localized: not allowed"}]}
        ],
        expect.anything()
      );
    });

    it("overrides the too-many-files rejection message", async () => {
      const onDropSpy = vi.fn();
      const getErrorMessage = error => (error.code === "too-many-files" ? "Too many!" : error.message);

      const {container} = render(
        <Dropzone onDrop={onDropSpy} maxFiles={1} multiple getErrorMessage={getErrorMessage}>
          {({getRootProps}) => <div {...getRootProps()} />}
        </Dropzone>
      );

      await act(() => fireEvent.drop(container.querySelector("div"), createDtWithFiles(images)));

      expect(onDropSpy).toHaveBeenCalledWith(
        [images[0]],
        [{file: images[1], errors: [{code: "too-many-files", message: "Too many!"}]}],
        expect.anything()
      );
    });
  });

  describe("accessibility", () => {
    it("sets the role attribute to button by default on the root", () => {
      const {container} = render(<Dropzone>{({getRootProps}) => <div id="root" {...getRootProps()} />}</Dropzone>);

      expect(container.querySelector("#root")).toHaveAttribute("role", "presentation");
    });

    test("users can override the default role attribute on the root", () => {
      const {container} = render(
        <Dropzone>{({getRootProps}) => <div id="root" {...getRootProps({role: "generic"})} />}</Dropzone>
      );

      expect(container.querySelector("#root")).toHaveAttribute("role", "generic");
    });
  });
});

/**
 * drainPendingTimers just runs pending timers wrapped in act() to avoid
 * getting warnings from react about side effects that happen async.
 *
 * This can be used whenever a setTimeout(), setInterval() or async operation is used
 * which triggers a state update.
 */
function drainPendingTimers() {
  return act(() => vi.runOnlyPendingTimers());
}

/**
 * focusWindow triggers focus on the window
 */
function focusWindow() {
  return fireEvent.focus(document.body, {bubbles: true});
}

/**
 * createDtWithFiles creates a mock data transfer object that can be used for drop events
 * @param {File[]} files
 * @param {object} options
 * @param {boolean} options.emptyTypes - If true, sets item types to empty string (simulates Chrome drag behavior)
 */
function createDtWithFiles(files = [], options = {}) {
  const {emptyTypes = false} = options;
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: "file",
        size: file.size,
        type: emptyTypes ? "" : file.type,
        getAsFile: () => file
      })),
      types: ["Files"]
    }
  };
}

/**
 * createFileSystemFileHandle creates a mock [FileSystemFileHandle](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle)
 * @param {File} file
 */
function createFileSystemFileHandle(file) {
  return {getFile: () => Promise.resolve(file)};
}

/**
 * createFile creates a mock File object
 * @param {string} name
 * @param {number} size
 * @param {string} type
 */
function createFile(name, size, type) {
  const file = new File([], name, {type});
  Object.defineProperty(file, "size", {
    get() {
      return size;
    }
  });
  return file;
}

/**
 * createThenable creates a Promise that can be controlled from outside its inner scope
 */
function createThenable() {
  let done, cancel;

  const promise = new Promise((resolve, reject) => {
    done = resolve;
    cancel = reject;
  });

  return {
    promise,
    done,
    cancel
  };
}
