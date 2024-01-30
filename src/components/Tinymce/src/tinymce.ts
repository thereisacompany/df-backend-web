// Any plugins you want to setting has to be imported
// Detail plugins list see https://www.tinymce.com/docs/plugins/
// Custom builds see https://www.tinymce.com/download/custom-builds/
// colorpicker/contextmenu/textcolor plugin is now built in to the core editor, please remove it from your editor configuration

// export const plugins = [
//   'advlist autolink autosave code codesample  directionality  fullscreen hr insertdatetime link lists nonbreaking  pagebreak preview  save searchreplace tabfocus  template  textpattern visualblocks visualchars media imagetools charmap wordcount',
// ];
export const plugins = [
  'print preview paste searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists   textpattern noneditable charmap emoticons imagetools',
];
// export const toolbar = [
//   'fontsizeselect lineheight searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample ',
//   'hr bullist numlist link  preview pagebreak insertdatetime  forecolor backcolor fullscreen emoticons image',
// ];
export const toolbar = [
  'code undo redo | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link | alignleft aligncenter alignright alignjustify outdent indent | \
styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
table image  charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs importword kityformula-editor',
];
// 從原本工具列中移除的功能：media anchor print
// 從原本plugins中移除的功能： wordcount
