function scroll(elt, from, to, increment, tdiff, dir) {
  if (dir == 'down') {
    if (from + increment <= to) elt.scrollTop = from + increment;
    setTimeout(() => {
      if (from + increment + increment <= to)
        scroll(elt, from + increment, to, increment, tdiff, dir);
    }, tdiff);
  } else {
    if (to - increment >= from) elt.scrollTop = to - increment;
    setTimeout(() => {
      if (to - increment - increment >= from)
        scroll(elt, from, to - increment, increment, tdiff, dir);
    }, tdiff);
  }
}
