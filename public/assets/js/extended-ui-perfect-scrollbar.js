/**
 * Perfect Scrollbar
 */
'use strict';

document.addEventListener('DOMContentLoaded', function () {
  (function () {
    const vertical1 = document.getElementById('vertical-1'),
      vertical2 = document.getElementById('vertical-2'),
      horizontalExample = document.getElementById('horizontal-example'),
      horizVertExample = document.getElementById('both-scrollbars-example');

    // Vertical Example
    // --------------------------------------------------------------------
    if (vertical1) {
      new PerfectScrollbar(vertical1, {
        wheelPropagation: false
      });
    }

    if (vertical2) {
      new PerfectScrollbar(vertical2, {
        wheelPropagation: false
      });
    }
    // Horizontal Example
    // --------------------------------------------------------------------
    if (horizontalExample) {
      new PerfectScrollbar(horizontalExample, {
        wheelPropagation: false,
        suppressScrollY: true
      });
    }

    // Both vertical and Horizontal Example
    // --------------------------------------------------------------------
    if (horizVertExample) {
      new PerfectScrollbar(horizVertExample, {
        wheelPropagation: false
      });
    }
  })();
});
