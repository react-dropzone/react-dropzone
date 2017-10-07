# Contributing to react-dropzone
Contributions are welcome and are greatly appreciated! Every little bit helps, and credit will
always be given.

When contributing to this repository, please first discuss the change you wish to make via issue,
so that owners take notice.

## Pull Request Process
Before you submit a pull request from your forked repo, check that it meets these guidelines:

1. After creating a PR you will be asked to define the scope of the given issue through a predefined documentation process.
2. If the pull request fixes a bug, it should include tests that fail without the changes, and pass
with them.
3. If the pull request adds functionality, the docs (normally) should be updated as part of the same PR.
4. The pull request should work for React 15, React 0.14 and React 0.13. The CI server should run the
tests in all versions automatically when you push the PR, but if you'd like to check locally, you
can do so (see above).
5. Please rebase and resolve all conflicts before submitting.
6. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Setting up your environment

After forking react-dropzone to your own github account, do the following steps to get started:
(every specific build tool command can be run with either yarn or npm)

```bash
# clone your fork to your local machine
git clone https://github.com/[Username]/react-dropzone.git

# step into local repo
cd react-dropzone
```

### Running Tests

```bash
# run tests on whatever version of React is currently installed
yarn test
```

```bash
# run tests on all supported versions of React
yarn run test:all
```

```bash
# faster feedback for TDD
yarn run test:watch
```
### Style & Linting

This codebase adheres to the [Airbnb Styleguide](https://github.com/airbnb/javascript) and is
enforced using [ESLint](http://eslint.org/).

It is recommended that you install an eslint plugin for your editor of choice when working on this
codebase, however you can always check to see if the source code is compliant by running:

```bash
yarn run lint
```

### Create a feature branch
If you think that bigger changes are needed please create a feature branch and put your PR title
to `[WIP] whatever problem this title defines` until you think that it can be took over by the
react-dropzone maintainers.

```bash
git checkout -b feature/whatever-feature-branch-name
```

### Link react-dropzone to another react project
If you would like to test specific use cases with react-dropzone it is recommended to
link your forked react-dropzone repo to another react project for real time test case
scenarios and proper use of react dev tools to see if changes take effect.

To do so use following commands:

``` bash
# link your forked react-dropzone repo
cd react-dropzone
yarn link
```

``` bash
# go to a different react project you want to test the react-dropzone component
# and link your forked local react-dropzone repo to it.
cd to-different-react-project
yarn link react-dropzone
```

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.
