# nobounce-scrolling

> No bounce scrolling for mobile iOS/Android, support for any front-end framework

Install:

```bash
# npm
npm i nobounce-scrolling

# yarn
yarn add nobounce-scrolling

# pnpm
pnpm add nobounce-scrolling
```

## Usage
```ts
const noBounceScrolling = NoBounceScrolling.create(element, options)
// start scroll
noBounceScrolling.startScroll()

// destroy
noBounceScrolling.destroy()
```

## Demo
[NoBounceScrollingDemo](https://github.com/TUBB/NoBounceScrollingDemo/blob/main/src/components/NoBounceScrolling.vue)

## Configuration
please see [options](./src/IOptions.ts)

## License

[MIT](./LICENSE)