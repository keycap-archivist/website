const React = require('react');

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key=""
      dangerouslySetInnerHTML={{
        __html: `
        (function() {
    try {
        var strConfig = localStorage.getItem('config');
        if (strConfig) {
            var c = JSON.parse(strConfig);
            if(c.darkMode) {
                document.documentElement.classList.add('dark');
            }
        }
    } catch (e) {}
  })();`
          .replace(/\n/g, ' ')
          .replace(/ {2}/g, ''),
      }}
    />,
  ]);
};
