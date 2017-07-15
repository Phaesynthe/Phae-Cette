const patterns = require('./patterns');

module.exports = (text, context) => {
  // Simple Substitution
  const substitution = () => {
    let match = text.match(patterns.substitution);
    while (match) {
      // If the substitution is an object path substitution
      if (match[0].indexOf('.') >= 0) {
        // strip the surrounding characters off and split into path parts
        let pathParts = match[0].substring(1, match[0].length - 1).split('.');
        let value = context;

        pathParts.forEach((part) => {
          value = value[part];
        });

        text = text.replace(match[0], value);
      } else {
        text = text.replace(match[0], context[match[0].substring(1, match[0].length - 1)]);
      }

      // Now, get the next match
      match = text.match(patterns.substitution);
    }
  };

  substitution();

  return text;
};
