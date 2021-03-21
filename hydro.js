import 'jquery.transit';

import _ from 'lodash';
import { PageLoader } from 'vj/misc/PageLoader';
import delay from 'vj/utils/delay';

// eslint-disable-next-line camelcase
__webpack_public_path__ = UiContext.cdn_prefix;

const pageLoader = new PageLoader();

const currentPageName = document.documentElement.getAttribute('data-page');
const currentPage = pageLoader.getNamedPage(currentPageName);
const includedPages = pageLoader.getAutoloadPages();

function buildSequence(pages, type) {
  if (process.env.NODE_ENV !== 'production') {
    if (['before', 'after'].indexOf(type) === -1) {
      throw new Error(`'type' should be one of 'before' or 'after'`); // eslint-disable-line quotes
    }
  }
  return pages
    .filter((p) => p && p[`${type}Loading`])
    .map((p) => ({
      page: p,
      func: p[`${type}Loading`],
      type,
    }));
}

async function load() {
  const loadSequence = [
    ...buildSequence(includedPages, 'before'),
    ...buildSequence([currentPage], 'before'),
    ...buildSequence(includedPages, 'after'),
    ...buildSequence([currentPage], 'after'),
  ];
  // eslint-disable-next-line no-restricted-syntax
  for (const { page, func, type } of loadSequence) {
    if (typeof func !== 'function') {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`The '${type}Loading' function of '${page.name}' is not callable`);
      }
      continue;
    }
    if (process.env.NODE_ENV !== 'production') {
      console.time(`${page.name}: ${type}Loading`);
    }
    try {
      await func(currentPageName);
    } catch (e) {
      console.error(`Failed to call '${type}Loading' of ${page.name}\n${e.stack}`);
    }
    if (process.env.NODE_ENV !== 'production') {
      console.timeEnd(`${page.name}: ${type}Loading`);
    }
  }
  const sections = _.map($('.section').get(), (section, idx) => ({
    shouldDelay: idx < 5, // only animate first 5 sections
    $element: $(section),
  }));
  // eslint-disable-next-line no-restricted-syntax
  for (const { $element, shouldDelay } of sections) {
    $element.addClass('visible');
    if (shouldDelay) {
      await delay(50);
    }
  }
  await delay(500);
  // eslint-disable-next-line no-restricted-syntax
  for (const { $element } of sections) {
    $element.trigger('vjLayout');
  }
  $(document).trigger('vjPageFullyInitialized');
}

load();
