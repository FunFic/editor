//=============================================================================
// FunFic
//=============================================================================
 
window.addEventListener('load', (event) => {
//#region START CODE
const initialCode = `function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
}

function draw() {
    
}`;
//#endregion

//#region Layout
  var menuEl = document.getElementById("menu");
  var editorEl = document.getElementById("editor");
  var resultEl = document.getElementById("result");
  function resize(){
    //Set absolute height to avoid resizing when keyboard appears
    var halfHeight = "";
    if(window.innerWidth < 767){
      halfHeight = (window.innerHeight / 2);
      if(menuEl.style.height){
        //dont let rezise when mobile appears
        var actualHeight = parseInt(menuEl.style.height);
        if(halfHeight < actualHeight){
          return;
        }
      }
      halfHeight += "px";
    }
    menuEl.style.height = halfHeight;
    editorEl.style.height = halfHeight;
    resultEl.style.height = halfHeight;
  }
  window.addEventListener('resize', resize);
  resize();
//#endregion


//#region Editor
  var editor = ace.edit("editor");
  var prevValue, prevCursor;

  editor.setTheme("ace/theme/funfic");
  editor.session.setMode("ace/mode/javascript");
  editor.setOptions({fontSize: "14pt"});
  editor.textInput.getElement().id = "editorTextArea";

  function resetEditor(){
    editor.setValue(initialCode);
  }
  resetEditor();
  editor.navigateTo(6, 4);
  editor.focus();
//#endregion


//#region Tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
//#endregion


//#region Error
  var errorsBtnEl = document.getElementById('errorsBtn');
  var errorDescriptionEl = document.getElementById('errorDescription');
  var errorContentEl = document.getElementById('errorContent');
  var errorCloseEl = document.getElementById('errorClose');
  var errorsTotalEl = document.getElementById('errorsTotal');
  var errorCount, errorWasVisible;

  function resetErrors() {
    errorCount = 0;
    errorsBtnEl.style.display = "none";
    errorContentEl.innerHTML = "";
    hideErrorList();
  }

  function isErrorListVisible(){
    return errorDescriptionEl.classList.contains("show");
  }

  function showErrorList(){
    errorDescriptionEl.classList.remove("hide");
    errorDescriptionEl.classList.add("show");
  }

  function hideErrorList(){
    errorDescriptionEl.classList.add("hide");
    errorDescriptionEl.classList.remove("show");
  }

  errorsBtnEl.addEventListener("click", () => {
    if(isErrorListVisible()){
      errorWasVisible = false;
      hideErrorList();
    }else{
      errorWasVisible = true;
      showErrorList();
    }
  });

  errorCloseEl.addEventListener("click", () => {
    errorWasVisible = false;
    hideErrorList();
  });

  window.onError = function(msg, line){
    errorCount++;
    errorsTotalEl.innerText = errorCount;
    errorsBtnEl.style.display = "";
    errorContentEl.innerHTML += `Linha ${line}: ${msg}`;
    if(errorWasVisible){
      showErrorList();
    }
  }
//#endregion


//#region Result
var iframeEl;

//message receiver
//store temporary function
window.onImageLoaded;

function showResult(){
  resetErrors();
  if(iframeEl)
    resultEl.removeChild(iframeEl);
  iframeEl = document.createElement("iframe");
  iframeEl.title = "Resultado";
  resultEl.appendChild(iframeEl);
  iframeEl.contentWindow.document.open();
  iframeEl.contentWindow.document.write(iframeHtml);
  iframeEl.contentWindow.document.close();
  iframeEl.contentWindow.postMessage({type:"sketchCode", code:editor.getValue()});
  iframeEl.contentWindow.postMessage({type:"p5jsCode", code:p5jsSourceCode});
}

editor.session.on('change', function(delta) {
    // delta.start, delta.end, delta.lines, delta.action
    showResult();
});

//cache p5jscode
var p5jsSourceCode;
var xmlhttp=new XMLHttpRequest();
xmlhttp.onreadystatechange=function()
{
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      p5jsSourceCode = xmlhttp.responseText;
      showResult();
    }
}
xmlhttp.open("GET", "js/p5/p5.min.js", true);
xmlhttp.send();

const iframeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FunFic Editor</title>
<style>
  body, html {
    padding: 0;
    margin: 0;
    background-color: #FFF;
    height: 100%;
    overflow: hidden;
  }
<\/style>
<script type="text/javascript" charset="utf-8">
  window.addEventListener("message", (event) => {
    if(event.data.type == "sketchCode"){
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = event.data.code;
      document.head.appendChild(script);
    } else if(event.data.type == "p5jsCode") {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = event.data.code;
      document.head.appendChild(script);
    } else if(typeof event.data == "object" && event.data.type) {
      if(event.data.type == "getImage")
        getImage();
    }
  }, false);

  function getImage(){
    var canvas = document.querySelector("canvas");
    var data = canvas.toDataURL("image/jpeg");
    parent.onImageLoaded(data);
  }

  window.onerror = function (msg, url, line) {
    parent.onError(msg, line);
  }
<\/script>
<\/head>
<body>
<\/body>
<\/html>`;
//#endregion


//#region Popup
  var popupEl = document.getElementById('popup');
  var popup = new bootstrap.Modal(popupEl);
  var popupTitleEl = document.getElementById('popupTitle');
  var popupBodyEl = document.getElementById('popupBody');
  var popupConfirmEl = document.getElementById('popupConfirm');
  popupEl.addEventListener('show.bs.modal', function (event) {
    prevValue = editor.getValue();
    prevCursor = editor.selection.getCursor();
  });
  popupEl.addEventListener('hide.bs.modal', function (event){
    if(prevValue != editor.getValue()){
      editor.setValue(prevValue);
    }
    editor.navigateTo(prevCursor.row, prevCursor.column);
    editor.focus();
  });
  popupConfirmEl.addEventListener('click', function (event) {
    prevValue = editor.getValue();
    prevCursor = editor.selection.getCursor();
    popup.hide();
  });

  function reset(){
    if(prevValue != editor.getValue()){
      editor.setValue(prevValue);
    }
  }
  
  function showPopup(title, body){
    popupTitleEl.innerHTML = title;
    popupBodyEl.innerHTML = body;
    popup.show();
    addInputToSliders();
  }

  function addInputToSliders(){
    var sliders = popupBodyEl.querySelectorAll("input[type='range']");
    for (let i = 0; i < sliders.length; i++) {
      let slider = sliders[i];
      let label = popupBodyEl.querySelector(`label[for=${slider.id}]`);
      if(label){
        let input = document.createElement("input");
        input.type = "number";
        input.min = slider.min;
        input.max = slider.max;
        input.classList = "form-control form-control-sm current-value";
        label.after(input);
        function updateInput(event) {
          input.value = this.value;
        }
        function updateSlider(event) {
          slider.value = this.value;
          var event = new Event('change');
          slider.dispatchEvent(event);
        }
        slider.addEventListener('change', updateInput);
        slider.addEventListener('input', updateInput);
        input.addEventListener('change', updateSlider);
        input.addEventListener('input', updateSlider);
        input.value = slider.value;
      }
    }
  }

  /*
  Drag modal
  */
  var dragger, draggable, dragPrevX, dragPrevY;

  function dragStart(event){
    var x = event.pageX || event.offsetX;
    var y = event.pageY || event.offsetY;
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    dragPrevX = x;
    dragPrevY = y;
  }

  function dragMove(event){
    var x = event.pageX || event.offsetX;
    var y = event.pageY || event.offsetY;
    var diffX = x - dragPrevX;
    var diffY = y - dragPrevY;
    dragPrevX = x;
    dragPrevY = y;
    if(!draggable.style.top){
      draggable.style.top = diffY + "px";
      draggable.style.left = diffX + "px";
    }else{
      draggable.style.top = (diffY + parseInt(draggable.style.top)) + "px";
      draggable.style.left = (diffX + parseInt(draggable.style.left)) + "px";
    }
  }

  function dragEnd(event){
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
  }

  function initModalDrag(){
    dragger = popupEl.querySelector(".modal-header");
    dragger.addEventListener("mousedown", dragStart);
    draggable = popupEl.querySelector(".modal-content");    
  }
  initModalDrag();
//#endregion


//#region Widgets

//#region New
  var newBtnEl = document.getElementById('newBtn');
  newBtnEl.addEventListener('click', function (event) {
    event.preventDefault();

    showPopup("Novo", `
    <div class="container-fluid container-buttons">
      <div class="row">
        <div class="col-sm-4"><div class="btn btn-primary" id="templateBtnFanFic">Fanfic com fundo</div></div>
        <div class="col-sm-4"><div class="btn btn-primary" id="templateBtnCharacter">Personagem com bal??o</div></div>
        <div class="col-sm-4"><div class="btn btn-primary" id="templateBtnMeme">Meme</div></div>
        <div class="col-sm-4"><div class="btn btn-primary" id="templateBtnClean">Limpo</div></div>
        <div class="col-sm-4"><div class="btn btn-primary" id="templateBtnHelp">Ajuda</div></div>
      </div>
    </div>
    `);

    var templateBtnFanFicEl = document.getElementById('templateBtnFanFic');
    templateBtnFanFicEl.addEventListener('click', function (event) {
      event.preventDefault();

      popup.hide();
      setTimeout(() => {
        showPopup("Fanfic com fundo", `
          <h3>Cor de Fundo</h3>
          ${backgroundHtml}

          <h3>Imagem</h3>
          ${imageHtml}
          
          <h3>Texto</h3>
          ${textHtml}`);
          
          function update(){
            resetEditor();
            backgroundWidgetOnChange();
            imageWidgetOnChange();
            textWidgetOnChange();
          }

          backgroundWidgetInit(update);
          imageWidgetInit(update);
          textWidgetInit(update);

          update();
      }, 500);
    });

    var templateBtnCharacterEl = document.getElementById('templateBtnCharacter');
    templateBtnCharacterEl.addEventListener('click', function (event) {
      event.preventDefault();

      popup.hide();
      setTimeout(() => {
        showPopup("Personagem com bal??o", `
          <h3>Imagem do personagem</h3>
          ${imageHtml}

          <h3>Bal??o</h3>
          ${bubbleHtml}`);
          
          function update(){
            resetEditor();
            imageWidgetOnChange();
            bubbleWidgetOnChange();
          }

          imageWidgetInit(update);
          bubbleWidgetInit(update);

          update();
      }, 500);
    });

    var templateBtnMemeEl = document.getElementById('templateBtnMeme');
    templateBtnMemeEl.addEventListener('click', function (event) {
      event.preventDefault();

      popup.hide();
      setTimeout(() => {
        showPopup("Meme", `
          <h3>Imagem do Meme</h3>
          ${imageHtml}

          <h3>Text</h3>
          ${textHtml}`);
          
          function update(){
            resetEditor();
            imageWidgetOnChange();
            textWidgetOnChange();
          }

          imageWidgetInit(update);
          textWidgetInit(update);

          update();
      }, 500);
    });

    var templateBtnCleanEl = document.getElementById('templateBtnClean');
    templateBtnCleanEl.addEventListener('click', function (event) {
      event.preventDefault();

      popup.hide();
      resetEditor();
    });

    var templateBtnHelpEl = document.getElementById('templateBtnHelp');
    templateBtnHelpEl.addEventListener('click', function (event) {
      event.preventDefault();

      popup.hide();
      setTimeout(() => {
        showPopupHelp();
      }, 500);
    });
  });
//#endregion

//#region Fundo
  const backgroundHtml = `
    <label for="widgetBackgroundR" class="form-label">Vermelho</label>
    <input type="range" class="form-range" min="0" max="255" id="widgetBackgroundR">
    <label for="widgetBackgroundG" class="form-label">Verde</label>
    <input type="range" class="form-range" min="0" max="255" id="widgetBackgroundG">
    <label for="widgetBackgroundB" class="form-label">Azul</label>
    <input type="range" class="form-range" min="0" max="255" id="widgetBackgroundB">`;
  var backgroundBtnEl = document.getElementById('backgroundBtn');
  backgroundBtnEl.addEventListener('click', function (event) {
    event.preventDefault();

    showPopup("Cor de Fundo", backgroundHtml);
    function update(){
      reset();
      backgroundWidgetOnChange();
    }
    backgroundWidgetInit(update);
    update();
  });
  var widgetBackgroundREl, widgetBackgroundGEl, widgetBackgroundBEl;
  function backgroundWidgetInit(update) {
    widgetBackgroundREl = document.getElementById('widgetBackgroundR');
    widgetBackgroundGEl = document.getElementById('widgetBackgroundG');
    widgetBackgroundBEl = document.getElementById('widgetBackgroundB');
    widgetBackgroundREl.addEventListener('change', event => update());
    widgetBackgroundGEl.addEventListener('change', event => update());
    widgetBackgroundBEl.addEventListener('change', event => update());
  }
  function backgroundWidgetOnChange(){
    var r = widgetBackgroundREl.value;
    var g = widgetBackgroundGEl.value;
    var b = widgetBackgroundBEl.value;
    if(injector.commandExists(editor.getValue(), "background")){
      editor.setValue(
        js_beautify(
          injector.updateCommand(editor.getValue(), "background", `background(${r}, ${g}, ${b})`)
        )
      );
    }else{
      addToFunction("draw", `background(${r}, ${g}, ${b})`);
    }
  }
//#endregion

//#region Texto
  const textHtml = `
    <label for="widgetTextText" class="form-label">Texto</label>
    <textarea class="form-control" id="widgetTextText" rows="3">Meu texto</textarea>
    <label for="widgetTextFont" class="form-label">Fonte</label>
    <select class="form-select" id="widgetTextFont">
      <option>Arial</option>
      <option>Courier New</option>
      <option>Georgia</option>
      <option>Times New Roman</option>
      <option>Trebuchet MS</option>
      <option>Verdana</option>
    </select>
    <label for="widgetTextX" class="form-label">X</label>
    <input type="range" class="form-range" min="0" max="500" id="widgetTextX">
    <label for="widgetTextY" class="form-label">Y</label>
    <input type="range" class="form-range" min="0" max="500" id="widgetTextY">
    <label for="widgetTextSize" class="form-label">Tamanho</label>
    <input type="range" class="form-range" min="10" max="100" id="widgetTextSize">
    <label for="widgetTextR" class="form-label">Vermelho</label>
    <input type="range" class="form-range" min="0" max="255" id="widgetTextR">
    <label for="widgetTextG" class="form-label">Verde</label>
    <input type="range" class="form-range" min="0" max="255" id="widgetTextG">
    <label for="widgetTextB" class="form-label">Azul</label>
    <input type="range" class="form-range" min="0" max="255" id="widgetTextB">`;
  var textBtnEl = document.getElementById('textBtn');
  textBtnEl.addEventListener('click', function (event) {
    event.preventDefault();

    showPopup("Texto", textHtml);
    function update(){
      reset();
      textWidgetOnChange();
    }
    textWidgetInit(update);
    update();
  });
  var widgetTextTextEl, widgetTextXEl, widgetTextYEl, widgetTextSizeEl, widgetTextFontEl, widgetTextREl, widgetTextGEl, widgetTextBEl;
  function textWidgetInit(update) {
    widgetTextTextEl = document.getElementById('widgetTextText');
    widgetTextXEl = document.getElementById('widgetTextX');
    widgetTextYEl = document.getElementById('widgetTextY');
    widgetTextSizeEl = document.getElementById('widgetTextSize');
    widgetTextFontEl = document.getElementById('widgetTextFont');
    widgetTextREl = document.getElementById('widgetTextR');
    widgetTextGEl = document.getElementById('widgetTextG');
    widgetTextBEl = document.getElementById('widgetTextB');
    widgetTextTextEl.addEventListener('change', event => update());
    widgetTextTextEl.addEventListener('input', event => update());     
    widgetTextXEl.addEventListener('change', event => update());
    widgetTextYEl.addEventListener('change', event => update());
    widgetTextSizeEl.addEventListener('change', event => update());
    widgetTextFontEl.addEventListener('change', event => update());
    widgetTextREl.addEventListener('change', event => update());
    widgetTextGEl.addEventListener('change', event => update());
    widgetTextBEl.addEventListener('change', event => update());
  }
  function textWidgetOnChange(){
    addToFunction("draw", `
    textFont("${widgetTextFontEl.value}");
    textSize(${widgetTextSizeEl.value});
    fill(${widgetTextREl.value}, ${widgetTextGEl.value}, ${widgetTextBEl.value});
    text("${widgetTextTextEl.value.replace(/\n/g, '\\\\n')}", ${widgetTextXEl.value}, ${widgetTextYEl.value});`);
  }
//#endregion

//#region Image
  const imageHtml = `
    <div class="form-group">
      <label for="widgetImageFile">Imagem</label>
      <input type="file" class="form-control-file" id="widgetImageFile">
    </div>
    <label for="widgetImageX" class="form-label">X</label>
    <input type="range" class="form-range" min="0" max="500" id="widgetImageX">
    <label for="widgetImageY" class="form-label">Y</label>
    <input type="range" class="form-range" min="0" max="500" id="widgetImageY">
    <label for="widgetImageScale" class="form-label">Escala</label>
    <input type="range" class="form-range" min="0" max="3" value="1" step="0.01" id="widgetImageScale">`;
  var imageBtnEl = document.getElementById('imageBtn');
  imageBtnEl.addEventListener('click', function (event) {
    event.preventDefault();

    showPopup("Imagem", imageHtml);
    function update(){
      reset();
      imageWidgetOnChange();
    }
    imageWidgetInit(update);
    update();
  });
  var widgetImageFileEl, widgetImageXEl, widgetImageYEl, widgetImageScaleEl, widgetImageBase64data;
  function imageWidgetInit(update){
    widgetImageFileEl = document.getElementById('widgetImageFile');
    widgetImageXEl = document.getElementById('widgetImageX');
    widgetImageYEl = document.getElementById('widgetImageY');
    widgetImageScaleEl = document.getElementById('widgetImageScale');
    widgetImageXEl.addEventListener('change', event => update());
    widgetImageYEl.addEventListener('change', event => update());
    widgetImageScaleEl.addEventListener('change', event => update());

    widgetImageBase64data = "";
    widgetImageFileEl.addEventListener('change', event => {
      const [file] = widgetImageFileEl.files;
      if (file) {
        var url = URL.createObjectURL(file);
        var reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onloadend = function() {
          widgetImageBase64data = reader.result;            
          update();
        }
      }
    });
  }
  function imageWidgetOnChange(){
    var imgName = "img";
    var counter = 1;
    while(injector.commandExists(editor.getValue(), "img" + counter)){
      counter++;
    }

    var command = `
    var raw${counter} = new Image();
    raw${counter}.src='${widgetImageBase64data}';
    raw${counter}.onload = function() {
      img${counter} = createImage(raw${counter}.width, raw${counter}.height);
      img${counter}.drawingContext.drawImage(raw${counter}, 0, 0);
    }`

    if(counter == 1){
      addToBegin(`var img${counter};
        function preload(){
          ${command}
        }
      `);
    }else{
      addAfterVariable(`img${counter-1}`, `var img${counter};`);
      addToFunction("preload", `${command}`);
    }
    addToFunction("draw", `
      push();
        scale(${widgetImageScaleEl.value});
        if(img${counter}) image(img${counter}, ${widgetImageXEl.value}, ${widgetImageYEl.value});
      pop();
    `);
  }
//#endregion

//#region Desenho
  const drawHtml = `
    <label for="widgetDrawSize" class="form-label">Tamanho</label>
    <input type="range" class="form-range" min="10" max="100" id="widgetDrawSize">
    <label for="widgetDrawR" class="form-label">Vermelho</label>
    <input type="range" class="form-range" min="0" max="255" id="widgetDrawR">
    <label for="widgetDrawG" class="form-label">Verde</label>
    <input type="range" class="form-range" min="0" max="255" id="widgetDrawG">
    <label for="widgetDrawB" class="form-label">Azul</label>
    <input type="range" class="form-range" min="0" max="255" id="widgetDrawB">`;
  var drawBtnEl = document.getElementById('drawBtn');
  drawBtnEl.addEventListener('click', function (event) {
    event.preventDefault();

    showPopup("Desenho", drawHtml);
    function update(){
      reset();
      drawWidgetOnChange();
    }
    drawWidgetInit(update);
    update();
  });
  var widgetDrawSizeEl, widgetDrawREl, widgetDrawGEl, widgetDrawBEl;
  function drawWidgetInit(update){    
    widgetDrawSizeEl = document.getElementById('widgetDrawSize');
    widgetDrawREl = document.getElementById('widgetDrawR');
    widgetDrawGEl = document.getElementById('widgetDrawG');
    widgetDrawBEl = document.getElementById('widgetDrawB');
    widgetDrawSizeEl.addEventListener('change', event => update());
    widgetDrawREl.addEventListener('change', event => update());
    widgetDrawGEl.addEventListener('change', event => update());
    widgetDrawBEl.addEventListener('change', event => update());
  }
  function drawWidgetOnChange(){
    addToFunction("draw", `
      if(mouseIsPressed){
          strokeWeight(${widgetDrawSizeEl.value})
          stroke(${widgetDrawREl.value}, ${widgetDrawGEl.value}, ${widgetDrawBEl.value})
          line(pmouseX, pmouseY, mouseX, mouseY)
      }`);
  };
//#endregion

//#region Bal??o
  const bubbleHtml = `
    <label for="widgetBubbleText" class="form-label">Texto</label>
    <textarea class="form-control" id="widgetBubbleText" rows="3">Meu texto</textarea>
    <label for="widgetBubbleFont" class="form-label">Fonte</label>
    <select class="form-select" id="widgetBubbleFont">
      <option>Arial</option>
      <option>Courier New</option>
      <option>Georgia</option>
      <option>Times New Roman</option>
      <option>Trebuchet MS</option>
      <option>Verdana</option>
    </select>
    <label for="widgetBubbleX" class="form-label">X</label>
    <input type="range" class="form-range" min="0" max="500" id="widgetBubbleX">
    <label for="widgetBubbleY" class="form-label">Y</label>
    <input type="range" class="form-range" min="0" max="500" id="widgetBubbleY">
    <label for="widgetBubbleSize" class="form-label">Tamanho</label>
    <input type="range" class="form-range" min="10" max="100" id="widgetBubbleSize">
    <label for="widgetBubbleDirection" class="form-label">Dire????o</label>
    <select class="form-select" id="widgetBubbleDirection">
      <option>Abaixo</option>
      <option>Acima</option>
      <option>Direita</option>
      <option>Esquerda</option>
    </select>
    `;
  var bubbleBtnEl = document.getElementById('bubbleBtn');
  bubbleBtnEl.addEventListener('click', function (event) {
    event.preventDefault();

    showPopup("Bal??o de Texto", bubbleHtml);
    function update(){
      reset();
      bubbleWidgetOnChange();
    }
    bubbleWidgetInit(update);
    update();
  });
  var widgetBubbleTextEl, widgetBubbleXEl, widgetBubbleYEl, widgetBubbleSizeEl, widgetBubbleDirectionEl, widgetBubbleFontEl;
  function bubbleWidgetInit(update){
    widgetBubbleTextEl = document.getElementById('widgetBubbleText');
    widgetBubbleXEl = document.getElementById('widgetBubbleX');
    widgetBubbleYEl = document.getElementById('widgetBubbleY');
    widgetBubbleSizeEl = document.getElementById('widgetBubbleSize');
    widgetBubbleDirectionEl = document.getElementById('widgetBubbleDirection');
    widgetBubbleFontEl = document.getElementById('widgetBubbleFont');
    widgetBubbleTextEl.addEventListener('change', event => update());
    widgetBubbleTextEl.addEventListener('input', event => update());     
    widgetBubbleXEl.addEventListener('change', event => update());
    widgetBubbleYEl.addEventListener('change', event => update());
    widgetBubbleSizeEl.addEventListener('change', event => update());
    widgetBubbleDirectionEl.addEventListener('change', event => update());
    widgetBubbleFontEl.addEventListener('change', event => update());
  }
  function bubbleWidgetOnChange(){
    if(!injector.functionExists(editor.getValue(), "desenhaBalao")) {
      addToEnd(`function desenhaBalao(texto, direcao, font, tamanho, x, y) {
        textFont(font);
        textSize(tamanho);
        textLeading(tamanho);
        textAlign(LEFT, TOP);
        var linhas = texto.split("\\n");
        var larguras = linhas.map(function(t) {
          return textWidth(t);
        });
        var largura = Math.max.apply(Math, larguras);
        var altura = linhas.length * tamanho;
        var espaco = 10;
        noStroke();
        fill(255);
        rect(x, y, largura + espaco * 2, altura + espaco * 2, 10, 10, 10, 10);

        if (direcao == "Acima") {
          triangle(x + 10, y, x + 50, y, x + 30, y - 20);
        } else if (direcao == "Abaixo") {
          triangle(x + 10, y + altura + espaco * 2, x + 50, y + altura + espaco * 2, x + 30, y + altura + 20 + espaco * 2);
        } else if (direcao == "Direita") {
          triangle(x, y + 10, x, y + 50, x - 20, y + 30);
        } else if (direcao == "Esquerda") {
          triangle(x + largura + espaco * 2, y + 10, x + largura + espaco * 2, y + 50, x + largura + espaco * 2 + 20, y + 30);
        }
        
        fill(0);
        text(texto, x + espaco, y + espaco);
      }

      `);
    }
    addToFunction("draw", `desenhaBalao("${widgetBubbleTextEl.value.replace(/\n/g, '\\\\n')}", "${widgetBubbleDirectionEl.value}", "${widgetBubbleFontEl.value}", ${widgetBubbleSizeEl.value}, ${widgetBubbleXEl.value}, ${widgetBubbleYEl.value});`);
  }
//#endregion

//#region Ajuda
  var helpBtnEl = document.getElementById('helpBtn');
  helpBtnEl.addEventListener('click', function (event) {
    event.preventDefault();
    showPopupHelp();
  });

  function showPopupHelp(){
    showPopup("Perguntas e Macetes", `
    <div class="accordion" id="accordionExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading1">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
            O que ?? FunFic?
          </button>
        </h2>
        <div id="collapse1" class="accordion-collapse collapse show" aria-labelledby="heading1" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            FunFic ?? um espa??o inventivo, onde voc?? poder?? explorar novas formas de constru????o, exibi????o e transmiss??o de conte??do liter??rio fazendo uso de novas tecnologias digitais. A ideia ?? proporcionar o encontro entre o universo fanfic e programa????o criativa em um ambiente laboratorial para desenvolvimento de novas experi??ncias com a produ????o liter??ria e escrita de c??digos. 
            <br/><br/>
            Esperamos que quanto mais voc?? exercitar suas ideias utilizando a FunFic, mais ir?? aprender sobre programa????o atrav??s da busca por customiza????o da ferramenta.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading2">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
            O que ?? programa????o criativa?
          </button>
        </h2>
        <div id="collapse2" class="accordion-collapse collapse" aria-labelledby="heading2" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            <figure class="text-center">
              <blockquote class="blockquote">
                <p>Programa????o criativa ?? um tipo de programa????o de computadores em que o objetivo ?? criar algo expressivo em vez de algo funcional.</p>
              </blockquote>
              <figcaption class="blockquote-footer">
                John Maeda in <cite title="Source Title">Creative Code</cite>
              </figcaption>
            </figure>
            Toda programa????o ?? criativa, mas nem todo mundo programa de uma forma experimental, ou seja, sem saber exatamente onde o processo criativo vai levar. E isso muda tudo!
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading3">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
            O que ?? fanfic?
          </button>
        </h2>
        <div id="collapse3" class="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            FanFic ?? uma narrativa ficcional, escrita e divulgada em diversas plataformas pertencentes ao ciberespa??o, dentre as mais conhecidas podemos citar: <a href="https://commaful.com/" target="_blank">Commaful</a>, <a href="https://www.wattpad.com/" target="_blank">Wattpad</a> e <a href="https://fanfiction.com.br/" target="_blank">FanFiction</a>.<br/>
            A cria????o de Fanfics parte da apropria????o de personagens e enredos provenientes de produtos midi??ticos como filmes, s??ries, quadrinhos, hist??rias videogames, etc. Portanto, tem como finalidade a constru????o de um universo paralelo ao original e tamb??m a amplia????o do contato dos f??s com as obras que apreciam.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading4">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
            O que programa????o criativa e fanfic tem em comum?
          </button>
        </h2>
        <div id="collapse4" class="accordion-collapse collapse" aria-labelledby="heading4" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            Tanto o cen??rio da Fanfic como o do Programa????o Criativa, s??o espa??os colaborativos, diversos, engajados, criativos e estimulantes, e acreditamos que ao aproximarmos esses dois universos em um mesmo ambiente, um ir?? potencializar as formas de express??o do outro. Nesse caso, o uso criativo da escrita liter??ria ir?? alimentar a escrita criativa de c??digos interativos e vice-versa.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading5">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
            Onde assisto aulas sobre programa????o?
          </button>
        </h2>
        <div id="collapse5" class="accordion-collapse collapse" aria-labelledby="heading5" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            <ul>
              <li>
                <a href="https://www.youtube.com/channel/UCry17aI_v6obn-XuSr_qjSA" target="_blank">Aula de Programa????o Criativa usando o p5js no Festival Multiverso</a>
              </li>
              <li>
                <a href="https://www.youtube.com/playlist?list=PLlrxD0HtieHhW0NCG7M536uHGOtJ95Ut2" target="_blank">Aula sobre JavaScript da Microsoft (Habilite as legendas)</a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCOiwQ_BVKNn6ftNaDqfPraw" target="_blank">Processing Community Day</a>
              </li>
              <li>
                <a href="https://www.youtube.com/user/shiffman" target="_blank">The Coding Train (Conte??do em Ingl??s)</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading6">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="false" aria-controls="collapse6">
            Onde posso ler mais sobre programa????o?
          </button>
        </h2>
        <div id="collapse6" class="accordion-collapse collapse" aria-labelledby="heading6" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            H?? pouco material para leitura em livros especializados em Programa????o Criativa em portugu??s que utilizam o P5.js como linguagem de ensino.
            <br/>
            Organizamos alguns materiais de acordo com alguns tipos de necessidades:
            <br/>
            <strong>Aprendizado de P5Js:</strong>
            <ul>
              <li>
                <a href="https://p5js.org/reference/" target="_blank">Documenta????o P5JS</a>
              </li>
            </ul>
            <strong>Aprendizado de Processing</strong>
            <ul>
              <li>
                <a href="https://codigotranscendente.github.io/livro/" target="_blank">O C??digo Transcendente de Mateus Berruezo</a>
              </li>
              <li>
                <a href="https://natureofcode.com/" target="_blank">Nature Of Code</a>
              </li>
            </ul>
            <strong>Aprendizado sobre a hist??ria da Programa????o Criativa</strong>
            <ul>
              <li>
                <a href="https://www.amazon.com.br/Arte-feita-c??digo-programa????o-artistas-programadores/dp/8584991425" target="_blank">Arte feita em C??digo de Patr??cia Oakim</a>
              </li>
              <li>
                <a href="https://www.ranoya.com/books/public/tecnologiascriativas/" target="_blank">O tecido das tecnologias criativas do Prof. Dr. Guilherme Ranoya</a>
              </li>
              <li>
                <a href="http://maedastudio.com/2004/creativecode/" target="_blank">Creative Code de John Maeda</a>
              </li>
              <li>
                <a href="https://www.manning.com/books/generative-art" target="_blank">Generative Art de Matt Pearson</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading7">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse7" aria-expanded="false" aria-controls="collapse7">
            Onde as pessoas que programam se comunicam?
          </button>
        </h2>
        <div id="collapse7" class="accordion-collapse collapse" aria-labelledby="heading7" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            Uma das coisas mais especiais sobre FanFic e Programa????o Criativa ?? o sentido de comunidade, de trocas entre pessoas, do acolhimento de pessoas em processo de aprendizado. Por isso encorajamos voc?? a se conectar o m??ximo poss??vel e aprender a partir da troca com outras pessoas.
            <ul>
              <li>
                <a href="https://encontrosdigitais.com.br/" target="_blank">Encontros Digitais (Rede social sobre Arte e Novas Tecnologias)</a>
              </li>
              <li>
                <a href="https://groups.google.com/g/processing-brasil" target="_blank">Grupo de email sobre Processing</a>
              </li>
              <li>
                <a href="https://t.me/programacaocriativaChat" target="_blank">Grupo sobre Programa????o Criativa no Telegram</a>
              </li>
              <li>
                <a href="https://openprocessing.com" target="_blank">OpenProcessing (Rede social de Programa????o Criativa)</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading8">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse8" aria-expanded="false" aria-controls="collapse8">
            Como fa??o para mudar o tamanho da minha ??rea de desenho?
          </button>
        </h2>
        <div id="collapse8" class="accordion-collapse collapse" aria-labelledby="heading8" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            O comando <code>createCanvas(windowWidth, windowHeight);</code> define o tamanho da ??rea de desenho. E as prorpriedades <code>windowWidth</code> e <code>windowHeight</code> fazem com que o programa tenha o tamanho da ??rea dispon??vel na janela do navegador.
            <br/>
            Se voc?? quer mudar o tamanho, voc?? precisa alterar <code>windowWidth</code> pelo n??mero em pixels da largura que voc?? quer, e <code>windowHeight</code> substitua pela altura.<br/>
            Ex: <code>createCanvas(1280, 720);</code>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading9">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse9" aria-expanded="false" aria-controls="collapse9">
            Como fa??o para sugerir corre????es no FunFic?
          </button>
        </h2>
        <div id="collapse9" class="accordion-collapse collapse" aria-labelledby="heading9" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            FunFic ?? o projeto Open Source. Caso queira contribuir com corre????es, cria????o de ferramentas e amplia????o de possibilidades, acesse nosso github e fique a vontade. Ajude novos programadores a encontrar um caminho de aprendizado mais f??cil e intuitivo. 
            <br/>
            <a href="https://github.com/FunFic" target="_blank">https://github.com/FunFic</a>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading10">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse10" aria-expanded="false" aria-controls="collapse10">
            Meu c??digo n??o funciona, o que pode ser?
          </button>
        </h2>
        <div id="collapse10" class="accordion-collapse collapse" aria-labelledby="heading10" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            Um c??digo pode n??o funcionar por v??rias raz??es. Vamos as principais delas:
            <ol>
              <li>
                Se seu c??digo nunca funcionou, talvez seu dispositivo n??o seja compat??vel com a FunFic, que utiliza HTML e Canvas para realizar os desenhos. Para melhor experi??ncia com a FunFic, recomendamos usar a vers??o mais atual do navegador Google Chrome.
              </li>
              <li>
                Seu c??digo parou de funcionar depois de alguma altera????o feita diretamente no c??digo. Recomendamos o seguinte passo-a-passo:
                <ul>
                  <li>
                    Verificar se voc?? digitou corretamente os comandos, comandos escritos com letras mai??sculas s??o diferentes de comandos escritos em letras min??sculas.
                  </li>
                  <li>
                    Verificar se h?? uma caixa de "Erro" no canto inferior direito. Esta funcionalidade apresenta a linha e o tipo de erro. Busque olhar para a linha onde o erro acontece, pode ter sido algum erro de digita????o. Se n??o estiver evidente a solu????o, procure jogar no google o tipo de erro apresentado. Voc?? vai descobrir que muita gente passou pelos mesmo desafios que voc??.
                  </li>
                  <li>
                    Verificar se os par??nteses() e chaves{} foram todos fechados na ordem correta. ?? muito comum esquecer estes caracteres, ou embaralhar a ordem que eles s??o abertos e fechados. Se n??o tiver certeza de como isso funciona, recomendamos fazer o curso de JavaScript que recomendamos na pergunta ???Onde assisto aulas sobre programa????o????.
                  </li>
                </ul>
              </li>
            </ol>
            Esperamos que isso ajude voc?? a resolver seu problema, se ainda tiver problemas, pode n??o ser uma quest??o de grafia do c??digo, mas na l??gica, e a?? fica mais dif??cil achar uma solu????o pronta.  Experimente procurar por pessoas com problemas semelhanes no Google ou pedir ajuda no <a href="https://pt.stackoverflow.com/" target="_blank">StackOverflow</a>.
          </div>
        </div>
      </div>
      <!--
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading11">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse11" aria-expanded="false" aria-controls="collapse11">
            Voc?? gostaria de ter o FunFic no seu site?
          </button>
        </h2>
        <div id="collapse11" class="accordion-collapse collapse" aria-labelledby="heading11" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            Fale conosco pelo email: XXXXXXXXXXXXXXXXXXX
            Estes s??o os locais onde a FunFic se encontra agora:
          </div>
        </div>
      </div>
      -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading12">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse12" aria-expanded="false" aria-controls="collapse12">
            Quem criou a FunFic?
          </button>
        </h2>
        <div id="collapse12" class="accordion-collapse collapse" aria-labelledby="heading12" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            A FunFic foi idealizada por <a href="https://www.instagram.com/4n4st4cio/" target="_blank">Andr?? Anast??cio</a> e <a href="https://vamoss.com.br/" target="_blank">Carlos Oliveira (Vamoss)</a> durante a resid??ncia art??stica <a href="https://www.bibliolab.com.br/bibliohacklab" target="_blank">BiblioHackLab</a>, projeto de inova????o, criatividade e desenvolvimento em Bibliotecas coordenados por <a href="http://www.casadaarvore.art.br/" target="_blank">Casa da ??rvore</a>.<br/>
            Contou tamb??m com a orienta????o de <a href="http://www.vjpalm.com/" target="_blank">Ricardo Palmiere</a> e com a colabora????o de <a href="https://esque.ma/" target="_blank">Tiago Rezende</a>.<br/>
            FunFic ?? um projeto poss??vel gra??as a cultura do conhecimento aberto, e utilizou os projetos de c??digo livre <a href="https://p5js.org/" target="_blank">P5js</a> da <a href="https://processingfoundation.org/" target="_blank">Funda????o Processing</a>, <a href="https://ace.c9.io/" target="_blank">Ace Editor</a> e <a href="https://getbootstrap.com/" target="_blank">Bootstrap</a>.
          </div>
        </div>
      </div>
    </div>
    `);
  }
//#endregion

//#region Salvar
  var saveBtnEl = document.getElementById('saveBtn');
  saveBtnEl.addEventListener('click', function (event) {
    event.preventDefault();

    showPopup("Salvar", `
    <div class="container-fluid container-buttons">
      <div class="row">
        <div class="col-sm-6"><div class="btn btn-primary" id="widgetSaveSaveCode">Salvar c??digo</div></div>
        <div class="col-sm-6"><div class="btn btn-primary" id="widgetSaveSaveImage">Salvar imagem</div></div>
        <div><div class="btn btn-primary" id="widgetSaveShare">Compartilhar Imagem</div></div>
      </div>
      <div class="row">
        <div class="col">
          Compartilhe nas suas redes sociais usando <span class="badge bg-secondary">#FunFic</span>
        </div>
      </div>
    </div>
    `);

    function download(text, createBlobURL, name, type) {
      var a = document.createElement('a');
      if(createBlobURL){
        var file = new Blob([text], {type: type});
        a.setAttribute('href', URL.createObjectURL(file));
      }else{
        a.setAttribute('href', text);
      }
      a.setAttribute('download', name);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function urltoFile(url, filename, mimeType){
        return (fetch(url)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], filename,{type:mimeType});})
        );
    }

    function onLoadToSave(imageData){
      urltoFile(imageData, 'funfic.jpg','image/jpeg')
        .then(file => { 
          download(imageData, false, 'funfic.jpg', 'image/jpeg');
        });
    }

    function onLoadToShare(imageData){
      urltoFile(imageData, 'image.jpg','image/jpeg')
        .then(file => { 
          navigator.share({
            files: [file],
            text: 'Minha cria????o no #FunFic'
          })
          //.then(() => console.log('Share was successful.'))
          //.catch((error) => console.log('Sharing failed', error));
        });
    }

    var widgetSaveSaveCodeEl = document.getElementById('widgetSaveSaveCode');
    var widgetSaveSaveImageEl = document.getElementById('widgetSaveSaveImage');
    var widgetSaveShareEl = document.getElementById('widgetSaveShare');

    widgetSaveSaveCodeEl.addEventListener('click', event => {
      download(editor.getValue(), true, 'sketch.js', 'text/javascript')
    });
    
    widgetSaveSaveImageEl.addEventListener('click', event => {
      window.onImageLoaded = onLoadToSave;
      iframeEl.contentWindow.postMessage({type:"getImage"});
    });

    if (navigator.canShare) {
      widgetSaveShareEl.addEventListener('click', event => {
        window.onImageLoaded = onLoadToShare;
        iframeEl.contentWindow.postMessage({type:"getImage"});
      });
    } else {
      widgetSaveShareEl.style.display = "none";
      console.error(`Your system doesn't support sharing files.`);
    }
  });
//#endregion
//#endregion


//#region Injector
  var injector = Injection();

  function addToBegin(code){
    editor.session.insert({row: 0, column: 0}, code);
  }

  function addToEnd(code){
    editor.session.insert({row: editor.session.getLength(), column: 0}, "\n" + code);
  }

  function addToFunction(functionName, code){
    editor.setValue(
      js_beautify(
        injector.injectByFunctionName(
          editor.getValue(), functionName, code
        )
      )
    );
  }

  function addAfterVariable(variableName, code){
    editor.setValue(
      js_beautify(
        injector.addAfterVariableName(
          editor.getValue(), variableName, code
        )
      )
    );
  }

  var localhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if(localhost){
    var list = document.querySelector("#menu ol");
    var li = document.createElement("li");
    li.innerHTML = `<a href="#" style="color: black">Validar</a>`;
    list.appendChild(li);
    li.addEventListener("click", (event) => {
      var code = injector.validate(editor.getValue());
      editor.setValue(
        js_beautify(code)
      );
    });
  }
//#endregion
});//DOMContentLoaded