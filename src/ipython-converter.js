var $ = require("jquery");
var marked = require("marked");
// var toMarkdown =  require("to-markdown");
var toMarkdown = require('html-md');

module.exports = {
    ipyToHailMary,
    htmlToIPy,
};

function ipyToHailMary(ipy) {
  let code = {}
  let index = 0
  let html = ipy.cells.map((cell) => {
    if (cell.cell_type == "markdown") {
      return marked(cell.source.join("\n"))
    } else {
      index += 1
      code[index] = cell.source.join("")
      return `<p><img data-livebook-placeholder-cell id="placeholder${index}" width="100%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYPhfDwACggF/yWU3jgAAAABJRU5ErkJggg=="></p>`
    }
  }).join("\n")

  return { html, code };
}

function htmlToIPy(html) {
  // FIXME
  let contents = document.querySelector("[data-medium-editor-element='true']").children;
  let cells = reduceEditorContentsToCells(contents);
  return { cells };
}

function reduceEditorContentsToCells(htmlCollection) {
  return reduceDOMCollection(htmlCollection, cellReducer, []);
}

function cellReducer(cells, elt) {
  if (hasCodePlaceholder(elt)) {
    let placeholder = elt.querySelector("[data-livebook-placeholder-cell]");
    let codeCell = createCodeCellFromPlaceholder(placeholder);
    cells.push(codeCell);
  }
  else {

    let lastCell = cells[cells.length - 1];
    let htmlString = toHTML(elt);
    let markdown = toMarkdown(htmlString);
    let nextCellSource = markdown.split("\n");

    if (lastCell && lastCell.cell_type === "markdown") {
        // append markdown to previous cell instead of adding a new cell
        lastCell.source = [lastCell.source, ...nextCellSource];
    }
    else {
        // the last cell was full of code!
        // we will have to add a new markdown cell
        let nextCell = newMarkdownCell();
        nextCell.source = nextCellSource;
        cells.push(nextCell);
    }
  }
  return cells;
}

function createCodeCellFromPlaceholder(elt) {
  // TODO
  return {
    cell_type: "code",
    source: ["pythonnnnnnnnnnnnn yay python"],
  };
}

function newMarkdownCell() {
  return { cell_type: "markdown", source: [] };
}

function hasCodePlaceholder(elt) {
  if (!elt.querySelector) return false;
  return !!elt.querySelector("[data-livebook-placeholder-cell]");
}

function reduceDOMCollection(collection, f, init) {
  return [].reduce.call(collection, f, init);
}

function toHTML(elt) {
    // if (!elt || !elt.tagName) {
    //   debugger;
    // };

    // let result, 
    //     tempContainer = document.createElement("div");

    // tempContainer.appendChild(elt.cloneNode(false));
    // result = tempContainer.innerHTML;
    // tempContainer = null;
    // return result;
    return elt.outerHTML;
}