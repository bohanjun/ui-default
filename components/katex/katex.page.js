import { AutoloadPage } from 'vj/misc/PageLoader';

const katexPage = new AutoloadPage('katexPage', () => {
  import('katex/dist/contrib/auto-render.min.js').then(({ default: katex }) => {
    function runKatex($containers) {
      $containers.get().forEach((container) => katex(container));
    }
    runKatex($('.typo'));
    $(document).on('vjContentNew', (e) => runKatex($(e.target).find('.typo')));
  });
});

export default katexPage;
