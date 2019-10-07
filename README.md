# create-vf-project

Helps to create a new [Visual Framework 2.0](https://visual-framework.github.io/vf-welcome/)-based project.

To make a [`vf-eleventy`](https://github.com/visual-framework/vf-eleventy) based project:

```
yarn create @visual-framework/vf-project your-new-site-name vf-eleventy
```

To make a [`vf-demo-design-system`](https://github.com/visual-framework/vf-demo-design-system) based project:

```
yarn create @visual-framework/vf-project your-new-site-name vf-demo-design-system
```


## Developing the template

1. Make any needed edits
1. Bump the version number
1. Run `yarn install`
1. `npm publish`

### Locally testing

To test before publishing to npm:

```
yarn start test-site-name vf-eleventy
```
