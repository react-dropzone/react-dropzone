import {act, fireEvent, render} from "@testing-library/react";
import Dropzone, {type DropzoneOptions, type DropzoneState} from "./index";

function setup(options: DropzoneOptions = {}) {
  let state: DropzoneState;
  const view = render(
    <Dropzone {...options}>
      {value => {
        state = value;
        return (
          <div {...value.getRootProps({"data-testid": "dropzone"})}>
            <input {...value.getInputProps()} />
          </div>
        );
      }}
    </Dropzone>
  );
  const input = view.container.querySelector("input")!;
  const select = async (files: File[]) => {
    await act(async () => {
      fireEvent.change(input, {target: {files}});
    });
  };
  return {
    ...view,
    input,
    select,
    get state() {
      return state;
    }
  };
}

const createFile = (name = "match.txt") => new File(["match"], name, {type: "text/plain"});

describe("removing files", () => {
  it("removes only the selected File object, including files with identical names", async () => {
    const first = createFile();
    const second = createFile();
    const view = setup();
    await view.select([first, second]);

    act(() => view.state.removeFile(first));
    expect(view.state.acceptedFiles).toEqual([second]);
    act(() => view.state.removeFile(createFile()));
    expect(view.state.acceptedFiles).toEqual([second]);
    act(() => view.state.removeFile(second));
    expect(view.state.acceptedFiles).toEqual([]);
  });

  it("removes a rejected file without disturbing accepted files or other errors", async () => {
    const accepted = createFile();
    const rejected = createFile("large.txt");
    const otherRejected = createFile("other.txt");
    const view = setup({validator: file => (file === accepted ? null : {code: "invalid", message: "Invalid file"})});
    await view.select([accepted, rejected, otherRejected]);
    const otherRejection = view.state.fileRejections[1];

    act(() => view.state.removeFile(rejected));
    expect(view.state.acceptedFiles).toEqual([accepted]);
    expect(view.state.fileRejections).toEqual([otherRejection]);
  });

  it("uses current reducer state for consecutive removals in the same render", async () => {
    const first = createFile("first.txt");
    const second = createFile("second.txt");
    const view = setup();
    await view.select([first, second]);
    const {removeFile} = view.state;

    act(() => {
      removeFile(first);
      removeFile(second);
    });
    expect(view.state.acceptedFiles).toEqual([]);
  });

  it("clears accepted and rejected files without firing drop callbacks", async () => {
    const onDrop = vi.fn();
    const onDropAccepted = vi.fn();
    const onDropRejected = vi.fn();
    const view = setup({maxSize: 3, onDrop, onDropAccepted, onDropRejected});
    await view.select([new File(["ok"], "small.txt"), createFile()]);
    expect(view.state.acceptedFiles).toHaveLength(1);
    expect(view.state.fileRejections).toHaveLength(1);

    act(() => view.state.clearFiles());
    expect(view.state.acceptedFiles).toEqual([]);
    expect(view.state.fileRejections).toEqual([]);
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDropAccepted).toHaveBeenCalledTimes(1);
    expect(onDropRejected).toHaveBeenCalledTimes(1);
  });

  it("does not fire drop callbacks when removing files", async () => {
    const onDrop = vi.fn();
    const onDropAccepted = vi.fn();
    const view = setup({onDrop, onDropAccepted});
    const file = createFile();
    await view.select([file]);
    act(() => view.state.removeFile(file));
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDropAccepted).toHaveBeenCalledTimes(1);
  });

  it("clears the native input and accepts the same file again", async () => {
    const view = setup();
    const file = createFile();
    await view.select([file]);
    const valueSetter = vi.spyOn(view.input, "value", "set");

    act(() => view.state.clearFiles());
    expect(valueSetter).toHaveBeenCalledWith("");
    await view.select([file]);
    expect(view.state.acceptedFiles).toEqual([file]);
  });

  it("preserves focus and keeps method references stable", async () => {
    const view = setup();
    const {removeFile, clearFiles} = view.state;
    fireEvent.focus(view.getByTestId("dropzone"));
    await view.select([createFile()]);
    fireEvent.focus(view.getByTestId("dropzone"));

    act(() => clearFiles());
    expect(view.state.isFocused).toBe(true);
    expect(view.state.removeFile).toBe(removeFile);
    expect(view.state.clearFiles).toBe(clearFiles);
  });

  it("clears safely without a mounted input or any selected files", () => {
    let state: DropzoneState;
    render(
      <Dropzone>
        {value => {
          state = value;
          return <span />;
        }}
      </Dropzone>
    );
    act(() => {
      state.clearFiles();
      state.removeFile(createFile());
      state.clearFiles();
    });
    expect(state!.acceptedFiles).toEqual([]);
    expect(state!.fileRejections).toEqual([]);
  });

  it.each(["read", "validate"])("discards pending %s results and allows a subsequent selection", async stage => {
    const onDrop = vi.fn();
    let resolve!: (value: File[] | null) => void;
    // A deferred result lets clearFiles run while the read or validator is pending.
    const pending = new Promise<File[] | null>(done => {
      resolve = done;
    });
    const view = setup({
      onDrop,
      ...(stage === "read"
        ? {getFilesFromEvent: vi.fn().mockReturnValueOnce(pending).mockResolvedValue([createFile()])}
        : {validator: vi.fn().mockReturnValueOnce(pending).mockReturnValue(null)})
    });
    await view.select([createFile()]);
    expect(view.state.isProcessing).toBe(true);

    act(() => view.state.clearFiles());
    expect(view.state.isProcessing).toBe(false);
    await act(async () => resolve(stage === "read" ? [createFile()] : null));
    expect(view.state.acceptedFiles).toEqual([]);
    expect(onDrop).not.toHaveBeenCalled();

    await view.select([createFile()]);
    expect(view.state.acceptedFiles).toHaveLength(1);
    expect(onDrop).toHaveBeenCalledTimes(1);
  });

  it.each(["read", "validate"])("ignores a pending %s failure after clearing", async stage => {
    let reject!: (reason: Error) => void;
    const pending = new Promise<never>((_, fail) => {
      reject = fail;
    });
    const onError = vi.fn();
    const onDrop = vi.fn();
    const view = setup({
      onError,
      onDrop,
      ...(stage === "read" ? {getFilesFromEvent: () => pending} : {validator: () => pending})
    });
    await view.select([createFile()]);
    act(() => view.state.clearFiles());
    await act(async () => reject(new Error("Late failure")));
    expect(view.state.isProcessing).toBe(false);
    expect(view.state.acceptedFiles).toEqual([]);
    expect(onError).not.toHaveBeenCalled();
    expect(onDrop).not.toHaveBeenCalled();
  });
});
