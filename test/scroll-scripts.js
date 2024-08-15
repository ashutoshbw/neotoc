function animate({ timing, draw, duration }) {
  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction goes from 0 to 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // calculate the current animation state
    let progress = timing(timeFraction);

    draw(progress); // draw it

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

let lastAutoScrollTop = null;

function scrollEltTo(elt, to, duration) {
  const from = elt.scrollTop;
  const diff = to - from;

  animate({
    timing: easeInOutCubic,
    draw(y) {
      const progress = diff * y;
      if (lastAutoScrollTop === null || lastAutoScrollTop === elt.scrollTop) {
        elt.scrollTop = from + progress;
        lastAutoScrollTop = elt.scrollTop;
      }
    },
    duration,
  });
}
