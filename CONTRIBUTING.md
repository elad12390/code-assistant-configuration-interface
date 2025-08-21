# Contributing to Claude Code Configurator

First off, thank you for considering contributing to the Claude Code Configurator! It's people like you that make this tool such a great tool for developers.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE-OF-CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to elad12390@gmail.com.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Claude Code Configurator, including completely new features and minor improvements to existing functionality.

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Explain why this enhancement would be useful** to most Claude Code Configurator users.

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the JavaScript styleguides
* Include thoughtfully-worded, well-structured tests
* Document new code based on the Documentation Styleguide
* End all files with a newline

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include [ci skip] in the commit title

### JavaScript Styleguide

All JavaScript must adhere to [JavaScript Standard Style](https://standardjs.com/).

* Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
* Inline `export`s with expressions whenever possible
  ```js
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
  ```

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown).
* Reference methods and classes in markdown with the custom `{}` notation:
  * Reference classes with `{ClassName}`
  * Reference instance methods with `{ClassName.methodName}`
  * Reference class methods with `{ClassName#methodName}`

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

* **`bug`** - Issues that are bugs.
* **`enhancement`** - Issues that are feature requests.
* **`documentation`** - Issues or pull requests related to documentation.
* **`good first issue`** - Good for newcomers.

#### Pull Request Labels

* **`work in progress`** - Pull requests which are still being worked on, more changes will follow.
* **`needs review`** - Pull requests which need code review, and approval from maintainers.
* **`under review`** - Pull requests being reviewed by maintainers.
* **`requires changes`** - Pull requests which need to be updated based on review comments and then reviewed again.
* **`needs testing`** - Pull requests which need manual testing.

## Getting Started

1. Fork the repository on GitHub
2. Clone the forked repository to your machine
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Write tests for your changes
6. Run the test suite to ensure all tests pass
7. Commit your changes using a descriptive commit message
8. Push your changes to your fork
9. Submit a pull request to the main repository

Thank you for contributing!