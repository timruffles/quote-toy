const testEl = document.createElement("div");
const isMobile = 'ontouchstart' in testEl;
const tapEvent = isMobile ? 'touchstart' : 'click';

// take this out of render-flow
main();

function main() {
  const store = Store();
  // startup
  var currentQuote = store.currentQuote()

  const articleEl = qs('article quote');
  articleEl.innerHTML = currentQuote;

  let hideTools;

  // right left tap
  tap(qs('.right.target'), function() {
    store.next();
  })

  tap(qs('.left.target'), function() {
    store.previous();
  })

  tap(qs('.top.target'), function(event) {
    qs('nav').classList.add('active')
  })

  tap(qs('.random'), function(event) {
    store.random();
    toolsUsed();
  })

  store.onChanged(function() {
    articleEl.innerHTML = store.currentQuote();
  })

  function toolsUsed() {
    clearTimeout(hideTools); 
    hideTools = setTimeout(function() {
      qs('nav').classList.remove('active'); 
    }, 2750)
  }
}

function qs(css) {
  return document.body.querySelector(css);
}

function tap(el, fn) {
  return on(el, tapEvent, fn);
}

function on(el, event, fn) {
  el.addEventListener(event, fn);
  return function() {
    el.removeEventListener(event, fn);
  }
}

function Store() {

  const quotes = [
    "Lion Mind",
    "What would this be like if it were easy?",
    "Systems, not goals",
    "The world only cares about what you ship",
    "Be how you want to be; you'd be suprised how little other people think about you",
    "Reading furnishes the mind only with materials of knowledge; it is thinking that makes what we read ours. We are of the ruminating kind, and it is not enough to cram ourselves with a great load of collections ; unless we chew them over again, they will not give us strength and nourishment.",
    "Clear writers, like fountains, do not seem so deep as they are; the turbid look the most profound",
    "It is often assumed, usually by people don't have many friends, that what we want to talk about effortlessly coincides with others' interests. Proust, less optimistic, recognised the likely discrepancy. he should always want to be the one to ask questions and address himself to what was on your mind rather than risk boring you with what was on his.",
  ];

  const fromStore = Number(localStorage.quoteIndex);
  var quoteIndex = isNaN(fromStore) || fromStore < 0 || fromStore >= quotes.length ? 0 : fromStore;

  const listeners = [];

  const api = {
    currentQuote() {
      return quotes[quoteIndex];
    },
    next() {
      if(quoteIndex === quotes.length - 1) {
        quoteIndex = -1;
      }
      quoteIndex += 1;
      changed();
    },
    previous() {
      if(quoteIndex <= 0) {
        quoteIndex = quotes.length;
      }
      quoteIndex -= 1;
      changed();
    },
    random() {
      quoteIndex = Math.round(Math.random() * (quotes.length - 1));
      changed();
    },
    onChanged(fn) {
      listeners.push(fn);
    },
  }

  return api;

  function changed() {
    localStorage.quoteIndex = quoteIndex;
    listeners.forEach(f => f())
  }
}

function onIdle(fn) {
   (window.requestIdleCallback || setTimeout)(fn);
}
