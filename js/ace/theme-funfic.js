define("ace/theme/funfic", ["require", "exports", "module", "ace/lib/dom"], function (e, t, n) {
    (t.isDark = !0),
        (t.cssClass = "ace-funfic"),
        (t.cssText =
            `.ace-funfic .ace_gutter {
    background: #29404a;
    color: rgb(144, 145, 148);
}
.ace-funfic .ace_print-margin {
    width: 1px;
    background: #3e5f6e;
}
.ace-funfic {
    background-color: #29404a;
    color: #f8f8f2;
}
.ace-funfic .ace_cursor {
    color: #f8f8f0;
}
.ace-funfic .ace_marker-layer .ace_selection {
    background: #3e5f6e;
}
.ace-funfic.ace_multiselect .ace_selection.ace_start {
    box-shadow: 0 0 3px 0px #29404a;
    border-radius: 2px;
}
.ace-funfic .ace_marker-layer .ace_step {
    background: rgb(198, 219, 174);
}
.ace-funfic .ace_marker-layer .ace_bracket {
    margin: -1px 0 0 -1px;
    border: 1px solid #a29709;
}
.ace-funfic .ace_marker-layer .ace_active-line {
    background: #3e5f6e;
}
.ace-funfic .ace_gutter-active-line {
    background-color: #3e5f6e;
}
.ace-funfic .ace_marker-layer .ace_selected-word {
    box-shadow: 0px 0px 0px 1px #a29709;
    border-radius: 3px;
}
.ace-funfic .ace_fold {
    background-color: #c8ea98;
    border-color: #f8f8f2;
}
.ace-funfic .ace_keyword {
    color: #ff79c6;
}
.ace-funfic .ace_constant.ace_language {
    color: #bd93f9;
}
.ace-funfic .ace_constant.ace_numeric {
    color: #bd93f9;
}
.ace-funfic .ace_constant.ace_character {
    color: #bd93f9;
}
.ace-funfic .ace_constant.ace_character.ace_escape {
    color: #ff79c6;
}
.ace-funfic .ace_constant.ace_other {
    color: #bd93f9;
}
.ace-funfic .ace_support.ace_function {
    color: #FBCBCF;
}
.ace-funfic .ace_support.ace_constant {
    color: #6be5fd;
}
.ace-funfic .ace_support.ace_class {
    font-style: italic;
    color: #66d9ef;
}
.ace-funfic .ace_support.ace_type {
    font-style: italic;
    color: #66d9ef;
}
.ace-funfic .ace_storage {
    color: #ff79c6;
}
.ace-funfic .ace_storage.ace_type {
    font-style: italic;
    color: #FBCBCF;
}
.ace-funfic .ace_invalid {
    color: #f8f8f0;
    background-color: #ff79c6;
}
.ace-funfic .ace_invalid.ace_deprecated {
    color: #f8f8f0;
    background-color: #bd93f9;
}
.ace-funfic .ace_string {
    color: #f1fa8c;
}
.ace-funfic .ace_comment {
    color: #6272a4;
}
.ace-funfic .ace_variable {
    color: #c8ea98;
}
.ace-funfic .ace_variable.ace_parameter {
    font-style: italic;
    color: #ffb86c;
}
.ace-funfic .ace_entity.ace_other.ace_attribute-name {
    color: #c8ea98;
}
.ace-funfic .ace_entity.ace_name.ace_function {
    color: #c8ea98;
}
.ace-funfic .ace_entity.ace_name.ace_tag {
    color: #ff79c6;
}
.ace-funfic .ace_invisible {
    color: #626680;
}
.ace-funfic .ace_indent-guide {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y;
}
.ace-funfic .ace_gutter-cell {
    color: #8A9FA8;
}
`),
        (t.$selectionColorConflict = !0);
    var r = e("../lib/dom");
    r.importCssString(t.cssText, t.cssClass);
});
(function () {
    window.require(["ace/theme/funfic"], function (m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();