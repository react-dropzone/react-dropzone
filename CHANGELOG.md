# 3.6.0

- Added `minSize` and `maxSize` props for file validation. #202 by @lemuelbarango
- Fixed OS X drag'n'drop issues. Fixes #74, #195. #225 by @MaffooBristol

# 3.5.3

- Fixed unknown props warning in React v15.2 #195. Closes #193 @nuc
- Updated to the latest lint-staged (2.0.0)

# 3.5.2

- Fixed unknown props warning in React v15.2 #194. Closes #193 @nuc
- Updated to the latest lint-staged (1.0.2)

# 3.5.1

* Fixed: `onDrop` is now called only if all files are passing the `accept` check. #173. Closes #138, #145

# 3.5.0

* Optionally handle onDragStart event #181
* Added lint-staged and npmpub to improve DX

# 3.4.0

* Added support for React 15.x <Nuno Campos>

# 3.3.4

* fix issue Cannot find module "React" #159 <Jonathan Sanchez Pando>

# 3.3.3

* More MIME type examples <Matija Marohnić>
* Fix off-by-one in droppedFiles length #156 <BJTerry>
* Use webpack for build #112 <Ville Lindholm>

# 3.3.2

* Fixed npm build for 3.3.1

# 3.3.1

* Added travis.yml and build badge. Closes #111 <Andrey Okonetchnikov>
* Fixed the React warning `Invalid prop 'children' supplied to 'Dropzone', expected a single 
ReactElement.` (#121) <Marnus Weststrate>

# 3.3.0

* Fir for Drag & Drop From Application Non-Functional in OS/X / Chrome (#74) <newsiberian>
* Use function instead of legacy string reference. Closes #91 <Andrey Okonetchnikov>
* Added support for dynamic props on input element via inputProps prop <Ben Daley>
* Added `accept` documentation to README <xabikos>
* Fix for disablePreview property not being obeyed <Frank Wallis>
* Added ESLint
* Added tests

# 3.0.0

* Added compatibility with React 0.14
* Converted to ES2015 class

Breaking Changes
====

If you're using React 0.13, you should install 2.x release.

# 2.2.4

* Fixed #83 

This is the last React 013 release.
