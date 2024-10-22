import neotoc from './index.js';

const toc = neotoc({
  selector: 'article >> h* >> #toc-main',
  offsetTop: 0,
  offsetBottom: 0,
  foldable: true,
  autoFold: false,
  autoScroll: true,
  ellipsis: true,
  // autoScrollOffset: 150,
  autoScrollDuration: 300,
  autoScrollBehavior: 'smooth',
  initialFoldLevel: 6,
});
