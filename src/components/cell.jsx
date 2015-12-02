var React = require("react");

var CodeCell     = require("./code-cell.jsx");
var MarkdownCell = require("./markdown-cell.jsx");

function cursor(mode, cursor_cell, i) {
  if (i != cursor_cell) return ""
  if (mode == "view" || mode === "meta")  return ""
  if (mode == "nav")   return "cursor"
  if (mode == "edit")  return "cursor-edit"
  else                 throw  new Error("Invalid mode: " + mode);
}

var Cursor = React.createClass({
  render() {
    let style = {
      background:  this.props.color, //"#2A64C7",
      left: -10 * this.props.index + (-2 * (this.props.index - 1)),
      position: "absolute",
      height: "100%",
      width: 10,
    };

    if (this.props.isHidden) {
      style.display = "none";
    }

    if (this.props.isCurrentUser) {
      return (
        <div className="cursor" data-current-user-cursor style={style} />
      );      
    }

    return (
      <div className="cursor" style={style} />
    );
  }
});

var Cell = React.createClass({

  enterEditMode() {
    var moveCursor  = this.props.notebook.moveCursor;

    var currentMode = this.props.notebook.getMode();
    var setMode     = this.props.notebook.setMode;

    // move cursor to the clicked cell
    var clickedCell = this.props.index;
    var cursorCell  = this.props.notebook.getCursorCell();
    var delta       = clickedCell - cursorCell;

    if (currentMode === "edit") {
      // enable cursor movement
      setMode("nav");
    }

    moveCursor(delta, {noScroll: true});
    // set mode to edit
    setMode("edit");

  },

  subcell() {
    if (this.props.data.cell_type === "markdown") {
      return <MarkdownCell data={this.props.data} notebook={this.props.notebook} index={this.props.index}/>      
    }
    else {
      return <CodeCell data={this.props.data} notebook={this.props.notebook} cursor={this.props.cursor} typing={this.props.typing} index={this.props.index} errorObject={this.props.errorObject}/>
    }
  },

  render() {
    let cursorClass = cursor(this.props.mode, this.props.cursor, this.props.index);
    let hasCursor = cursorClass === "cursor";
    let cursors = this.props.cursors.map((cursor, i) => {
      return (
        <Cursor key={i} isHidden={false} index={i+1} color={cursor.color} isCurrentUser={i === 0} />
      );
    });

    return (
      <div className="cell-wrap" onClick={this.enterEditMode} style={{position: "relative"}}>
        {cursors}
        {this.subcell()}
      </div>
    );
  },

});

module.exports = Cell;
