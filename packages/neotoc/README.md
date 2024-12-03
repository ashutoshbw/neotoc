# Neotoc

Next Generation Table of Content UI

Creating a beautiful and interactive table of contents is really challenging. This is where Neotoc comes to save your valuable time. It creates the TOC by parsing the DOM inside the browser.

Main features:

- Fluid highlighting. You have to experience it, to know exactly what I mean. Just scroll this page and enjoy.
- Powerful folding/unfolding functionality.
- Indent lines to visually aid the nesting level.
- Framework agnostic. Whatever library or framework you are using, it will most likely work just fine.

## Getting Started

Install Neotoc:

```sh
npm install neotoc
```

From your JS/TS file import it and call neotoc passing it an `io` option:

```ts
import neotoc from 'neotoc';

neotoc({ io: 'article >> h* >> #sidebar' });
```

`io`(stands for input output) is the only option that you must provide. Here it says, hey neotoc, grab all the headings(with `h*`) from `article` element that you see first and create the TOC and append it to element matched by the `#sidebar` selector.

Now for this to work Neotoc expect two things:

- Heading that you look for must have ids.
- And those headings should appear in a sensible order. By sensible order, I mean:
  - First heading's level is considered the largest one. So if you choose `<h2>` as your first heading, you must not use the `<h1>` heading later.
  - There must be no gap between two heading levels. That is after `<h2>`, you should not use the heading `<h4>`.
