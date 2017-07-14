# Phae-Cette #
##### Contextualized Entity Text Templateing Engine #####
Cette = French for `this`

#### Purpose ####
Provide a parsing engine for template text that requires a complex object context to resolve the template to a final output state.

#### Operation ####
First, install the library. As this is not yet an npm module, this will require installing directly from this repo.

Next, require the library with `const Cette = require('Phae-Cette');`.

Then, call the parser with a context object and retain the output as follows:

```javascript
const template = "Hello {name}";
const context = { name: 'Wprld '};
const transformedVersion = Cette(template, context);
```

## Syntax ##


## Requested Syntax ##
