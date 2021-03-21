export class Page {
  constructor(name, autoload, afterLoading, beforeLoading) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof name !== 'string' && !(name instanceof Array)) {
        // eslint-disable-next-line quotes
        throw new Error(`'name' should be a string or string[]`);
      }
      if (typeof afterLoading !== 'function' && afterLoading != null) {
        // eslint-disable-next-line quotes
        throw new Error(`'afterLoading' should be a function`);
      }
      if (typeof beforeLoading !== 'function' && beforeLoading != null) {
        // eslint-disable-next-line quotes
        throw new Error(`'beforeLoading' should be a function`);
      }
    }
    this.name = name;
    this.autoload = autoload;
    this.afterLoading = afterLoading;
    this.beforeLoading = beforeLoading;
  }

  isNameMatch(name) {
    if (typeof this.name === 'string') {
      return this.name === name;
    }
    if (this.name instanceof Array) {
      return this.name.indexOf(name) !== -1;
    }
    return false;
  }
}

export class NamedPage extends Page {
  constructor(name, afterLoading = null, beforeLoading = null) {
    super(name, false, afterLoading, beforeLoading);
  }
}

export class AutoloadPage extends Page {
  constructor(name, afterLoading = null, beforeLoading = null) {
    super(name, true, afterLoading, beforeLoading);
  }
}

window.Hydro = {
  NamedPage, AutoloadPage,
};

export class PageLoader {
  constructor() {
    const pageReq = require.context('../', true, /\.page\.js$/i);
    this.pageInstances = pageReq.keys().map((key) => {
      const page = pageReq(key).default;
      if (!page || !(page instanceof Page)) {
        return null;
      }
      return page;
    });
    window.Hydro.pageInstances = this.pageInstances;
  }

  getAutoloadPages() {
    const pages = this.pageInstances.filter((page) => page && page.autoload);
    return pages;
  }

  getNamedPage(pageName) {
    const pages = this.pageInstances.filter((page) => page && page.isNameMatch(pageName));
    if (pages.length > 0) {
      if (pages.length > 1) {
        console.warn(`Multiple instance for ${pageName}`);
      }
      return pages[0];
    }
    return null;
  }
}
