# Contributing

First off, thanks for taking the time to contribute! 

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 

And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
* Star the project
* Refer this project in your project's readme
* Mention the project at local meetups and tell your friends/colleagues
* Become a sponsor

## Table of Contents

* [Code of Conduct](#code-of-conduct)
* [I Have a Question](#i-have-a-question)
* [I Want To Contribute](#i-want-to-contribute)
* [Reporting Bugs](#reporting-bugs)
* [Suggesting Enhancements](#suggesting-enhancements)
* [Your First Code Contribution](#your-first-code-contribution)
* [Styleguides](#styleguides)
* [Join The Project Team](#join-the-project-team)

## Code of Conduct

This project and everyone participating in it is governed by the
[Code of Conduct](https://github.com/react-dropzone/react-dropzone?tab=coc-ov-file#readme).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to rolandjitsu@gmail.com.

## I Have a Question

If you want to ask a question, we assume that you have read the available [Documentation](https://react-dropzone.js.org/).

Before you ask a question, it is best to search for existing [Issues](/issues) or [Discussions](/discussions) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

* Open an [Issue](/issues/new).
* Provide as much context as you can about what you're running into.
* Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

## I Want To Contribute

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

* Make sure that you are using the latest version.
* Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](https://react-dropzone.js.org/). If you are looking for support, you might want to check [this section](#i-have-a-question)).
* To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](issues?q=label%3Abug).
* Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
* Collect information about the bug:
    * Stack trace (Traceback)
    * OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
    * Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
    * Possibly your input and the output
    * Can you reliably reproduce the issue? And can you also reproduce it with older versions?

#### How Do I Submit a Good Bug Report?

We use GitHub issues to track bugs and errors. If you run into an issue with the project, open an [Issue](/issues/new), select the `Bug Report` and fill in all the details.

Once it's filed:

* The project team will label the issue accordingly.
* A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs example`. Bugs with the `needs example` tag will not be addressed until they are reproduced.
* If the team is able to reproduce the issue, it will be marked `needs investigation`, as well as possibly other tags (such as `in progress`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for this project, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

#### Before Submitting an Enhancement

* Make sure that you are using the latest version.
* Read the [documentation](https://react-dropzone.js.org/) carefully and find out if the functionality is already covered, maybe by an individual configuration.
* Perform a [search](/issues) to see if the enhancement has already been suggested (filter by the `enhancement` label). If it has, add a comment to the existing issue instead of opening a new one.
* Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](/issues). If you have a suggestion, open an [Issue](/issues/new), select the `Feature Request` and fill in all the details.

### Your First Code Contribution

Make sure your node version is at least 18, then:

1. Fork this repo
2. Clone your fork:
```bash
git clone https://github.com/myusername/react-dropzone.git
```
3. Install system dependencies (needed for local development):
```bash
# macOS
brew install libpng libimagequant
# Linux
sudo apt-get install -y libpng-dev libimagequant-dev
```
4. Install project dependencies:
```bash
yarn install
```
5. Create a new branch:
```bash
git checkout -b fix/fix-some-bug
```
6. Start hacking
7. Commit and push your code
8. Make a PR

**NOTE** If you're using Apple silicon, you'll need to install Rosetta 2 (see [imagemin/pngquant-bin#121](https://github.com/imagemin/pngquant-bin/issues/121) and [SO](https://stackoverflow.com/a/66662497/1092007)):
```bash
/usr/sbin/softwareupdate --install-rosetta
```

## Styleguides

When you commit we'll make sure everything is formatted according to our styleguide, so don't worry to much about it.

### Commit Messages

Please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.

## Join The Project Team

Send an email to rolandjitsu@gmail.com and see how you can become a project member.

## Attribution
This guide is based on the **contributing.md**. [Make your own](https://contributing.md/)!
