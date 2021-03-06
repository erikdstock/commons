[![npm version](https://badge.fury.io/js/roses.svg)](https://badge.fury.io/js/roses) [![CircleCI](https://circleci.com/gh/erikdstock/roses.svg?style=svg)](https://circleci.com/gh/erikdstock/roses)

# 🌹 Roses 🌹

_React component library layered atop `emotion` and `@styled-system/css`. Built with Typescript._

### [_Skip to setup_](#setup)

`roses` is a simple, extendable design system. It's written with typescript and builds upon an _opinionated extension_ of the [`system-ui` interface](https://system-ui.com/theme), so type support is first-class.

It builds on the following libraries, so it's best to be familiar with them as well:

- [emotion](https://emotion.sh/docs/introduction) for css-in-js
- [styled-system](https://styled-system.com) for handy prop-based styles that cover most use cases - in particular `roses` opts for [styling using `@styled-system/css`](#the-sx-prop)

For more context and alternatives, see [Related Projects](#related-projects)

### I already know what this stuff is.

TLDR:

- Roses keeps all responsive styles in an `sx` prop using `@styled-system/css`.
- Simple components can be styled in the theme directly under the `componentStyles` and `variants` keys- use the `themed()` HOC which will first apply any `componentStyles` you've defined and add `sx` and `variant` props.
- More complex components can be defined like any other `emotion` component in the context of a `styled-system` theme.
- Good type support.

### Motivation

`roses` began as work on a design system for my own use- an extension of `rebass` using `styled-components` to build a library of reusable, themable components. Over time (and having never built a design system on my own) a couple pain points crept in:

_Emotion as the css-in-js library_: Early on I ran into some wrinkles around the styled-components' @types package. This was part of the motivation for switching to `emotion`. Additionally, it is smaller and (as of early 2019) rumoured to be more performant than styled-components.

_Responsive, theme-aware styles in a single prop_: Collaborators were less enthusiastic about the many `styled-system` props, especially when combined with the need to define Ts interfaces, account for the presence of a `theme` and know which props you could use where. By electing to restrict themed styles to a single prop, the total surface area of props to maintain and remember is greatly reduced. It is also designed to be more friendly to users who aren't completely sold on css-in-js. _Notably [this prop](#the-sx-prop) is baldly stolen from theme-ui._

_Define core component styles and variants on the theme_: Because the `system-ui` theme spec is wide open, different libraries have augmented it with their own keys. This is fine, but I wanted to introduce a bit of stability and the ability to define core component styles like those exported from [rebass](#related-projects) within the theme itself. `@styled-system/css` makes this pretty straightforward:

- I settled on a top-level `theme.componentStyles` key which includes style rules as well as its nested `variants`. The result is much less overhead in defining components that are at their hearts the composition of a `div` and a few style objects.
- HTML elements follow the `theme-ui` pattern of using `theme.styles`, and a base set of these styles is included with the default theme- see [baseTheme](/src/Theme/baseTheme.ts) and [defaultTheme](/src/Theme/defaultTheme.ts) which extends it.

## Setup

Add the package and any missing peer dependencies:

```sh
yarn add roses @styled-system/css @emotion/core @emotion/styled
# if using ts
# yarn add -D @types/styled-system__css @types/styled-system etc ...
```

### Configure `ThemeProvider`

All of your components must to be wrapped in an emotion `ThemeProvider` containing a theme object. You can bring your own from the [`emotion-theming` package](https://emotion.sh/docs/emotion-theming#themeprovider-reactcomponenttype) or import it directly for some extra type hints:

```js
import { RosesTheme, defaultTheme } from "roses"
// import { ThemeProvider } from 'emotion-theming'

const theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    white: "black",
    black: "white",
  },
}

// RosesTheme is just a rebranded ThemeProvider.
export const App = props => {
  return <RosesTheme theme={theme}>{props.everythingElse}</RosesTheme>
}
```

The `defaultTheme` export is an extension of the [theme-ui `base` preset](https://theme-ui.com/demo)

## Usage

### Defining components

Basic component styles can be defined under the theme `componentStyles` key. Rebass apparently uses a [similar, undocumented approach](https://github.com/rebassjs/rebass/blob/99efe79af0b62fa061f9c115bf472c6448d8eb32/src/index.js#L34) but keys are at the top level- this one I didn't know about.

Given a theme:

```js

// extending the default theme..
{
  ...defaultTheme
  breakpoints: ["780px"], // just a single breakpoint.
  radii: [0, "2px", "4px", "8px"],
  componentStyles: {
    Rectangle: {
      color: ["black", "red"] // at 1st breakpoint the text turns red for some reason.
      padding: 1,  // indexed to `space` key
      mx: 3,
      variants: {
        hot: {
          bg: "primary"
        },
        cold: { ... }
      }

    },
    Widget: { ... }
  }

}
```

We can make a `Rectangle using the full api:

```js
const Rectangle = themed({
  name: "Rectangle",
  component: "div",
})
```

... Or a string shorthand - with a default base component of `styled('div')({boxSizing: 'border-box'})`:

```js
const Widget = themed("Widget")
```

Since this is all just emotion in the context of a system-ui theme under the covers, you can also build more complex components (whose styles probably won't belong in your theme). See the `emotion`/`@styled-system/css` docs for more details.

### Variants

Component variant styles can be defined via a special `variants` key, are accessible via the `variant` prop and applied over the base styles:

```jsx
theme.componentStyles.Card = {
  p: 2,
  m: 1,
  display: "inline-block",
  borderRadius: 2,
  variants: {
    shadow: {
      boxShadow: "0 0 16px rgba(0, 0, 0, .25)",
    },
  },
}

// later...

<Card variant="shadow">{ /* etc */ } </Card>
```

### The `sx` prop

_heavily inspired by [`theme-ui`'s `sx` prop](https://theme-ui.com/sx-prop)_.

The final styles applied come from the `sx` prop.

`theme-ui` introduced the `sx` prop. It seemed like a good idea, so `roses` decided to copy it. Similar to a vanilla react component's `styles` prop, `sx` accepts a [`SystemStyleObject`]. This is a familiar extension of the vanilla `styles` api with the responsive, theme-aware values and shortcuts that `styled-system/css` introduced. `sx` is a functional copy of `theme-ui`'s version: It passes your styles on to the emotion css prop: `<Box sx={myStyles} />` `==` `<Box css={{styledCss(myStyles)}}/>`.

# Related projects

`roses` is heavily inspired by these projects:

- [rebass](https://rebassjs.org/) brings a layer of additional convention to styled-system with some UI primitives that you would have had to build anyway. It uses `styled-components`
- [theme-ui](https://theme-ui.com/) builds on the work of rebass, but makes the switch to `emotion` and includes built-in support for MDX.
- [system-ui](https://system-ui.com/theme/) is (to my knowledge) the original responsive theme spec from which `styled-system`, `rebass` and `theme-ui` grew.
- [@artsy/palette](https://palette.artsy.net/) was my first encounter with a production design system built styled-system. For Web and React Native/iOS.

# License

MIT for now.

# Contributors

Docs, PRs and Bug reports welcome. Contributors agree that this project may be relicensed in the future.
