# Contributing to NetSepio

Thank you for your interest in contributing to NetSepio! This guide will help you get started with contributing code to the project.

### Cloning the repository

To start contributing to NetSepio, you first need to clone the GitHub repository:

```
git clone https://github.com/NetSepio/ChromiumExtension
```

### Setting up the project

To set up the project, you'll need to run the following commands:

```
cd NetSepio
npm install
```

### Workflow

The workflow for contributing to NetSepio is the same as any other SvelteKit project for creating Chrome extensions. Please follow the [official SvelteKit documentation](https://kit.svelte.dev/docs/introduction) for more information. Otherwise here's some steps you need to follow:

1. After installing the npm packages you have to create a build of the project `npm run build`

2. After that a build folder will be generated in the main directory. Now go to `chrome://extensions/` in chrome browser and enable the `developer mode`

3. Then import the `build ` folder in the option called `Load Unpacked`

### Code formatting

NetSepio uses [Prettier](https://prettier.io/) to format its code. Before submitting a pull request, please run the following command to ensure that your code is properly formatted:

```
npm run format
```

### Linting

NetSepio uses ESLint for linting the code. Make sure you linted your code before you make a commit, please run the following command to ensure that your code is properly linted:

```
npm run lint
```

## Licensing

NetSepio is currently under MIT license. Please keep this in mind when contributing to the project.

## Creating a pull request

When you're ready to submit your changes, please follow these steps:

1. Create a new branch for your changes: `git checkout -b my-new-branch`
2. Make your changes and ensure that your code is properly formatted with Prettier.
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push your branch to GitHub: `git push origin my-new-branch`
5. Navigate to the repository on GitHub and create a new pull request.

Once you've submitted your pull request, one of our maintainers will review it as soon as possible.

Thank you for contributing to NetSepio!
