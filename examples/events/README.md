Custom event handlers provided in `getRootProps()` (e.g. `onClick`), will be invoked before the dropzone handlers.

Therefore, if you'd like to prevent the default behaviour for: `onClick` and `onKeyDown` (open the file dialog), `onFocus` and `onBlur` (sets the `isFocused` state) and drag events; use the `stopPropagation()` fn on the event:

```jsx harmony
import React, {useCallback, useReducer} from 'react';
import {useDropzone} from 'react-dropzone';

const initialEvtsState = {
  preventFocus: true,
  preventClick: true,
  preventKeyDown: true,
  preventDrag: true,
  files: []
};

function Events(props) {
  const [state, dispatch] = useReducer(reducer, initialEvtsState);
  const myRootProps = computeRootProps(state);
  const createToggleHandler = type => () => dispatch({type});

  const onDrop = useCallback(files => dispatch({
    type: 'setFiles',
    payload: files
  }), []);

  const {getRootProps, getInputProps, isFocused} = useDropzone({onDrop});
  const files = state.files.map(file => <li key={file.path}>{file.path}</li>);

  const options = ['preventFocus', 'preventClick', 'preventKeyDown', 'preventDrag'].map(key => (
    <div key={key}>
      <input
        id={key}
        type="checkbox"
        onChange={createToggleHandler(key)}
        checked={state[key]}
      />
      <label htmlFor={key}>
        {key}
      </label>
    </div>
  ));

  return (
    <section>
      <aside>
        {options}
      </aside>
      <div {...getRootProps(myRootProps)}>
        <input {...getInputProps()} />
        <p>{getDesc(state)} (<em>{isFocused ? 'focused' : 'not focused'}</em>)</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

function computeRootProps(state) {
  const props = {};

  if (state.preventFocus) {
    Object.assign(props, {
      onFocus: event => event.stopPropagation(),
      onBlur: event => event.stopPropagation()
    });
  }

  if (state.preventClick) {
    Object.assign(props, {onClick: event => event.stopPropagation()});
  }

  if (state.preventKeyDown) {
    Object.assign(props, {
      onKeyDown: event => {
        if (event.keyCode === 32 || event.keyCode === 13) {
          event.stopPropagation();
        }
      }
    });
  }

  if (state.preventDrag) {
    ['onDragEnter', 'onDragOver', 'onDragLeave', 'onDrop'].forEach(evtName => {
      Object.assign(props, {
        [evtName]: event => event.stopPropagation()
      });
    });
  }

  return props;
}

function getDesc(state) {
  if (state.preventClick && state.preventKeyDown && state.preventDrag) {
    return `Dropzone will not respond to any events`;
  } else if (state.preventClick && state.preventKeyDown) {
    return `Drag 'n' drop files here`;
  } else if (state.preventClick && state.preventDrag) {
    return `Press SPACE/ENTER to open the file dialog`;
  } else if (state.preventKeyDown && state.preventDrag) {
    return `Click to open the file dialog`;
  } else if (state.preventClick) {
    return `Drag 'n' drop files here or press SPACE/ENTER to open the file dialog`;
  } else if (state.preventKeyDown) {
    return `Drag 'n' drop files here or click to open the file dialog`;
  } else if (state.preventDrag) {
    return `Click/press SPACE/ENTER to open the file dialog`;
  }
  return `Drag 'n' drop files here or click/press SPACE/ENTER to open the file dialog`;
}

function reducer(state, action) {
  switch (action.type) {
    case 'preventFocus':
      return {
        ...state,
        preventFocus: !state.preventFocus
      };
    case 'preventClick':
      return {
        ...state,
        preventClick: !state.preventClick
      };
    case 'preventKeyDown':
      return {
        ...state,
        preventKeyDown: !state.preventKeyDown
      };
    case 'preventDrag':
      return {
        ...state,
        preventDrag: !state.preventDrag
      };
    case 'setFiles':
      return {
        ...state,
        files: action.payload
      };
    default:
      return state;
  }
}

<Events />
```

This sort of behavior can come in handy when you need to nest dropzone components and prevent any drag events from the child propagate to the parent:

```jsx harmony
import React, {useCallback, useMemo, useReducer} from 'react';
import {useDropzone} from 'react-dropzone';

const initialParentState = {
  preventDrag: true,
  parent: {},
  child: {}
};

const parentStyle = {
  width: 200,
  height: 200,
  border: '2px dashed #888'
};

const stateStyle = {
  fontFamily: 'monospace'
};

const childStyle = {
  width: 160,
  height: 160,
  margin: 20,
  border: '2px dashed #ccc'
};


function Parent(props) {
  const [state, dispatch] = useReducer(parentReducer, initialParentState);
  const {preventDrag} = state;
  const togglePreventDrag = useCallback(() => dispatch({type: 'preventDrag'}), []);
  const dropzoneProps = useMemo(() => computeDropzoneProps({dispatch}, 'parent'), [dispatch]);

  const {getRootProps} = useDropzone(dropzoneProps);

  const childProps = useMemo(() => ({
    preventDrag,
    dispatch
  }), [
    preventDrag,
    dispatch
  ]);

  return (
    <section>
      <aside>
        <div>
          <input
            id="toggleDrag"
            type="checkbox"
            onChange={togglePreventDrag}
            checked={preventDrag}
          />
          <label htmlFor="toggleDrag">
            preventDrag
          </label>
        </div>
      </aside>
      <br />
      <div {...getRootProps({style: parentStyle})}>
        <Child {...childProps} />
      </div>
      <aside style={stateStyle}>
        <p>Parent: {JSON.stringify(state.parent)}</p>
        <p>Child: {JSON.stringify(state.child)}</p>
      </aside>
    </section>
  );
}

function Child(props) {
  const dropzoneProps = useMemo(() => computeDropzoneProps(props, 'child'), [
    props.preventDrag,
    props.dispatch
  ]);
  const {getRootProps} = useDropzone(dropzoneProps);
  return (
    <div
      {...getRootProps({
        style: childStyle
      })}
    />
  );
}


function parentReducer(state, action) {
  switch (action.type) {
    case 'preventDrag':
      return {
        ...state,
        preventDrag: !state.preventDrag
      };
    case 'onDragEnter':
    case 'onDragOver':
    case 'onDragLeave':
    case 'onDrop':
      return computeDragState(action, state);
    default:
      return state;
  }
}

function computeDragState(action, state) {
  const {type, payload} = action;
  const {node} = payload;
  const events = {...state[node]};
  if (type !== events.current) {
    events.previous = events.current;
  }
  events.current = type;
  return {
    ...state,
    [node]: events
  };
}

function computeDropzoneProps(props, node) {
  const rootProps = {};

  ['onDragEnter', 'onDragOver', 'onDragLeave', 'onDrop'].forEach(type => {    
    Object.assign(rootProps, {
      [type]: (...args) => {
        const event = type === 'onDrop' ? args.pop() : args.shift();
        if (props.preventDrag) {
          event.stopPropagation();
        }
        props.dispatch({
          type,
          payload: {node}
        });
      }
    });
  })
  
  return rootProps;
}


<Parent />
```

Note that the sort of behavior illustrated above can lead to some confusion. For example, the `onDragLeave` callback of the parent will not be called if the callback for the same event is invoked on the child. This happens because we invoked `stopPropagation()` on the event from the child.
