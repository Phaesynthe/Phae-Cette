class CodeObject {
  constructor (code, startIndex, closeIndex) {
    this.code = code;
    this.startIndex = startIndex;
    this.closeIndex = closeIndex;
    this.value = '';
  }
}

const patterns = [
  {
    /**
     * OR
     *
     * starts with '('
     * followed by any number of any character
     * followed by any number of a sequence that begins with a '|' and is followed by any number of any character
     * ending with ')
     **/
    operation: 'or',
    pattern:  /^\(.*\|.*\)$/,
    resolve: (block, context) => {
      // Break each option of the OR block into a separate block
      // ToDo: This needs to deal with nested or operations
      let parts = block.code.substring(1, block.code.length - 1).split('|').map((part) => {
        let textParts = part.trim().split(':');
        return {
          body: textParts[0].trim(),
          // Set frequency to the provided value or 1
          frequency: textParts.length > 1 ? Number(textParts[1]) : 1
        };
      });

      // Functionally stack the frequencies
      // then generate a random number up to that frequency
      // then see if that number falls in the composite range
      let totalFreq = parts.reduce((sum, value) => sum + value.frequency, 0);
      let selectedValue = getRandomArbitrary(totalFreq);
      let selected;

      for(let i = 0; i < parts.length; i++) {
        // If the random number is less than the item's frequency, then select that item
        if (selectedValue <= parts[i].frequency) {
          selected = parts[i];
          break;
        }
        // Otherwise, subtract this item's frequency and save the remaining frequency.
        selectedValue = selectedValue - parts[i].frequency;
      }

      // Now we have the selected path. Resolve it to the value of this block
      block.value = processCodeBlock(new CodeObject(selected.body), context).value;
      return block;
    }
  },
  {
    /**
     * Substitution
     *
     * starts with at least one letter or number
     * optionally followed as many sequences of a period that is followed by at least one letter or number
     **/
    operation: 'substitution',
    pattern: /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]*)*$/,
    resolve: (block, context) => {
      let value = context;

      // If the substitution is an object path substitution
      if (block.code.indexOf('.') >= 0) {
        // strip the surrounding characters off and split into path parts
        // let pathParts = code.substring(1, code.length - 1).split('.');
        let pathParts = block.code.split('.');
        pathParts.forEach((part) => {
          value = value[part];
        });
      } else {
        value = value[block.code];
      }

      block.value = value;
      return block;
    }
  },
  {
    /**
     * Text
     *
     * starts with a '"' and ends with a '"'
     **/
    operation: 'text',
    pattern: /^".*"$/,
    resolve: (block, context) => {
      let textChunk = `${block.code}`;
      let codeBlocks = [];

      extractCodeBlocks(textChunk).forEach((item) => {
        codeBlocks.push(processCodeBlock(item, context));
      });

      // We need to walk the results backwards so the indexes don't change
      for( let i = codeBlocks.length - 1; i > -1; i--) {
        textChunk = textChunk.substring(0, codeBlocks[i].startIndex) +
          codeBlocks[i].value +
          textChunk.substring(codeBlocks[i].closeIndex, textChunk.length);
      }

      block.value = textChunk;
      return block;
    }
  }
];

const getRandomArbitrary = (max) => Math.floor(Math.random() * max);

const extractCodeBlocks = (text) => {
  let codeBlocks = [];
  let openCharacters = 0;

  let startOfCurrentBlock;

  for(let currentIndex = 0; currentIndex < text.length; currentIndex++) {
    if (text[currentIndex] === '{') {
      if (openCharacters === 0) {
        startOfCurrentBlock = currentIndex;
      }
      openCharacters++;
    }

    if (text[currentIndex] === '}') {
      if (openCharacters === 1) {
        // we found the top level pairing
        codeBlocks.push(new CodeObject(
          text.substring(startOfCurrentBlock + 1, currentIndex).trim(),
          startOfCurrentBlock,
          currentIndex + 1
        ));
        // reset
        openCharacters = 0;
      } else {
        openCharacters--;
      }
    }
  }

  if (openCharacters > 0) {
    // there has been an error
    console.warn('DANGER!');
  }
  return codeBlocks;

};

const getOperationType = (codeBlock) => patterns.map((pattern) => pattern.pattern.test(codeBlock) && pattern)
  .filter((pattern) => pattern !== false);

const processCodeBlock = (block, context) => getOperationType(block.code)[0].resolve(block, context);

module.exports = (text, context) => {
  let textChunk = `${text}`;
  let codeBlocks = [];

  extractCodeBlocks(text).forEach((item) => {
    codeBlocks.push(processCodeBlock(item, context));
  });

  // We need to walk the results backwards so the indexes don't change
  for( let i = codeBlocks.length - 1; i > -1; i--) {
    textChunk = textChunk.substring(0, codeBlocks[i].startIndex) +
      codeBlocks[i].value +
      textChunk.substring(codeBlocks[i].closeIndex, textChunk.length);
  }

  return textChunk;
};
