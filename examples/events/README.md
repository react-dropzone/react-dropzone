If you'd like to prevent drag events propagation from the child to parent, you can use the `{noDragEventsBubbling}` property on the child:
```jsx harmony
import React, {useCallback, useMemo, useReducer} from 'react';
import {useDropzone} from 'react-dropzone';

const initialParentState = {
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
  const dropzoneProps = useMemo(() => computeDropzoneProps({dispatch}, 'parent'), [dispatch]);
  const {getRootProps} = useDropzone(dropzoneProps);
  const childProps = useMemo(() => ({dispatch}), [dispatch]);

  return (
    <section>
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
  const dropzoneProps = useMemo(() => ({
    ...computeDropzoneProps(props, 'child'),
    noDragEventsBubbling: true
  }), [
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

Note that internally we use `event.stopPropagation()` to achieve the behavior illustrated above, but this comes with its own [drawbacks](https://javascript.info/bubbling-and-capturing#stopping-bubbling).

If you'd like to selectively turn off the default dropzone behavior for `onClick`, `onKeyDown` (both open the file dialog), `onFocus` and `onBlur` (sets the `isFocused` state) and drag events; use the `{noClick}`, `{noKeyboard}` and `{noDrag}` properties:
```jsx harmony
import React, {useCallback, useReducer} from 'react';
import {useDropzone} from 'react-dropzone';

const initialEvtsState = {
  noClick: true,
  noKeyboard: true,
  noDrag: true,
  files: []
};

function Events(props) {
  const [state, dispatch] = useReducer(reducer, initialEvtsState);
  const createToggleHandler = type => () => dispatch({type});

  const onDrop = useCallback(files => dispatch({
    type: 'setFiles',
    payload: files
  }), []);

  const {getRootProps, getInputProps, isFocused} = useDropzone({...state, onDrop});
  const files = state.files.map(file => <li key={file.path}>{file.path}</li>);

  const options = ['noClick', 'noKeyboard', 'noDrag'].map(key => (
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
      <div {...getRootProps()}>
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


function getDesc(state) {
  if (state.noClick && state.noKeyboard && state.noDrag) {
    return `Dropzone will not respond to any events`;
  } else if (state.noClick && state.noKeyboard) {
    return `Drag 'n' drop files here`;
  } else if (state.noClick && state.noDrag) {
    return `Press SPACE/ENTER to open the file dialog`;
  } else if (state.noKeyboard && state.noDrag) {
    return `Click to open the file dialog`;
  } else if (state.noClick) {
    return `Drag 'n' drop files here or press SPACE/ENTER to open the file dialog`;
  } else if (state.noKeyboard) {
    return `Drag 'n' drop files here or click to open the file dialog`;
  } else if (state.noDrag) {
    return `Click/press SPACE/ENTER to open the file dialog`;
  }
  return `Drag 'n' drop files here or click/press SPACE/ENTER to open the file dialog`;
}

function reducer(state, action) {
  switch (action.type) {
    case 'noClick':
      return {
        ...state,
        noClick: !state.noClick
      };
    case 'noKeyboard':
      return {
        ...state,
        noKeyboard: !state.noKeyboard
      };
    case 'noDrag':
      return {
        ...state,
        noDrag: !state.noDrag
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

Keep in mind that if you provide your own callback handlers as well and use `event.stopPropagation()`, it will prevent the default dropzone behavior:
```jsx harmony
import React from 'react';
import Dropzone from 'react-dropzone';

// Note that there will be nothing logged when files are dropped
<Dropzone onDrop={files => console.log(files)}>
  {({getRootProps, getInputProps}) => (
    <div
      {...getRootProps({
        onDrop: event => event.stopPropagation()
      })}
    >
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )}
</Dropzone>
```
