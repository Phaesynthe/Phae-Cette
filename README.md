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
### Substitution ###
```javascript
let context = {
  value: 'World',
  second: {
    value: 'to this world'
  }
}
```
`Hello {value}.` will be transformed to `Hello World.`
`Hello {second.value}.` will be transformed to `Hello to this world.`

## Intended Syntax ##
##### Not all of this has been developed and some of what has been developed is not yet fully tested #####

* `Hello {value}.` will be transformed to `Hello World.`
* `Hello {second.value}.` will be transformed to `Hello to this world.`
* `Hello {( "to this {value}" | {value} )}` is an or operation that will result in one value or the other in the indicated portion of the output text.
* `Hello {( "to this {value}":99 | {value}:1 )}` indicates a frequency. In this case, 99 to one. (Needs to be rolled into all operations)
* `Hello little {? char male "mister" | "miss" }` interrogative operation. Assumes that the provided object has an attribute called `facts` and searches those facts for the provided term.
* `Hello you {( "beauty" => like=true | "evil person" => like=false )}` display effects. 

* `You walk down the lond hallway{( " and notice a bright glint of light":1 => scene.seenObject=true| "":1000 )}.`

## Requested Syntax ##
