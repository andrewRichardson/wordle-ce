[< Back to README](./README.md)

## Extra Features

### TailwindCss

[TailwindCss](https://tailwindcss.com/) is a popular utility-first CSS framework that you can use to compose and build any design, directly in your markup.

It is already configured when you create a project using this template. You can start using Tailwind's classes in any component right away. You can find the default configuration for this template [here](#tailwindcss-configuration).

### ESLint

[ESLint](https://eslint.org/) is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.

When you use this template ESLint will check your code against Airbnb JavaScript style guide (adapted to TypeScript).

By default, it will check any JavaScript or TypeScript file (`{js,jsx,ts,tsx}`) in your `src` folder.

### Stylelint

[Stylelint](https://stylelint.io/) is a mighty, modern linter that helps you avoid errors and enforce conventions in your styles.

You can run the `lint-styles` and `lint-styles:fix` scripts to check and fix style errors.

Keep in mind that by default any other extensions (like `.scss` or `.less`) will not be checked by Stylelint. If you need that behavior you will need to change the configuration.

### Prettier

[Prettier](https://prettier.io/) is an opinionated code formatter. It ensures that all outputted code conforms to a consistent style. This is the tool used behind the scenes when trying to fix formatting issues in your code and styles, be it when issuing one of the [available scripts](#available-scripts) or while working on your project in your code editor (more on that below).

## Configuration

You can find below more specific information on what is included in this template.

The base of this template is the [official Typescript template from Create React App](https://www.npmjs.com/package/cra-template-typescript), version `1.1.2`.

### ESLint configuration

This template comes configured with `eslint-config-airbnb-typescript` and `eslint-plugin-prettier`.

Settings can be found at the root of your project in `.eslintrc.json`.

After creating your project you might find a key `eslintConfig` in your `package.json`. You can/should remove this key to avoid confusion and make sure that configuration is being read from the standalone json configuration file.

### Stylelint configuration

This template comes configured with `stylelint-prettier/recommended` and `stylelint-config-prettier`. Prettier will be used for formatting rules.

Stylelint configuration can be found at the root of your project in `stylelint.config.js`.

### TailwindCss configuration

You can find `tailwind.config.js` in the root of your project. This is where you can customize Tailwind's classes for your project. You can find all the information on how to do it in the [official docs](https://tailwindcss.com/docs/configuration).

Here's a list of how it is initially configured:

- It includes all of the [default colors](https://tailwindcss.com/docs/customizing-colors);
- Sets `darkMode` to `'class'` to that you can manually change themes;
- Includes the plugin `@tailwindcss/forms` for resetting form fields;
- The responsive breakpoints are set by default like this:
  - `sm`: `576px`
  - `md`: `768px`
  - `lg`: `992px`
  - `xl`: `1200px`
  - `xxl`: `1400px`

Keep in mind that these are not the usual default for breakpoints in TailwindCss. If you want to use the defaults, edit its configuration file and remove the key `screens` from the `theme` object.

### Formatting settings

This template comes with a standalone Prettier configuration file (`.prettierrc`) specifying formatting rules. You can find this file in the root directory of your project.

The same settings are also supplied in the form of an [EditorConfig](https://editorconfig.org/) file (`.editorconfig`) for compatibility with code editors that support it.

### Visual Studio Code settings

You will also get code editor specific settings. More specifically, it comes with Visual Studio Code settings so that your files are automatically formatted by Prettier when saving them. For that to work you need to install Prettier extension for Visual Studio Code (more on that below).

There are also settings to avoid clashes between Visual Studio Code error checking in css files and Stylelint.

You can view and edit this configuration as usual in the `.vscode/settings.json` file.

### Environment variables

You will find a `.env` file at the root of your project. By default it comes configured:

- For not opening a browser window automatically when running the development server;
- For not generating source maps when generating a production build.

You can change this configuration directly in the file and you can find the full list of supported variables on [Create React App's docs](https://create-react-app.dev/docs/advanced-configuration/).
