# create-vf-project

Helps to create a new [Visual Framework 2.0](https://visual-framework.github.io/vf-welcome/)-based project.

## Usage

`yarn create  @visual-framework/vf-project {your-new-site-name} {site-type}`

- `{your-site-name}` will be the name of the destination directory
- `{site-type}` can be any of the below options

### Supported options

- Generic templates
    - Generic build environments: [`vf-build-boilerplate`](https://github.com/visual-framework/vf-build-boilerplate)
    - Eleventy projects: [`vf-eleventy`](https://github.com/visual-framework/vf-eleventy)
    - Design system: [`vf-demo-design-system`](https://github.com/visual-framework/vf-demo-design-system)
- Organisation specific-implementations
    - Eleventy projects
        - [`embl-eleventy`](https://github.com/embl-communications/embl-eleventy)
        - [`ebi-eleventy`](https://github.com/ebiwd/ebi-eleventy-boilerplate)

### Example

To make a [`vf-eleventy`](https://github.com/visual-framework/vf-eleventy) based project:

```
yarn create @visual-framework/vf-project your-new-site-name vf-eleventy
```

## Troubleshooting

If you're having trouble with `yarn create` you can also try:

- `npx @visual-framework/create-vf-project  {your-new-site-name} {site-type}`
- `npx @visual-framework/create-vf-project testproject vf-eleventy`

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
