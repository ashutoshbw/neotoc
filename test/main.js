import neotoc from './index.js';

const a = neotoc({ selector: 'article >> h* >> #toc-main' });

console.log(a);
