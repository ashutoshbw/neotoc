import neotoc from 'neotoc';
import 'neotoc/base-?.css';
import 'neotoc/colors-?.css';
import './neotoc.css';

neotoc({
  io: 'article >> h2,h3,h4,h5,h6 >> nav',
  ellipsis: true,
  offsetTop: 64,
});
