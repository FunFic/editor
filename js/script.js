window.addEventListener('load', (event) => {
    const initialCode = `function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
}

function draw() {
    
}`;

  /*
  Editor
  */
  var editor = ace.edit("editor");
  var prevValue, prevCursor;

  editor.setTheme("ace/theme/funfic");
  editor.session.setMode("ace/mode/javascript");
  editor.setOptions({fontSize: "14pt"});
  editor.textInput.getElement().id = "editorTextArea";

  function resetEditor(){
    editor.setValue(initialCode);
    editor.navigateTo(6, 4);
    editor.focus();
  }
  resetEditor();

  /*
  Tooltips
  */
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  /*
  Error
  */
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

/*
Result 
*/
var iframeEl;
var resultEl = document.getElementById("result");

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

  /*
  Popup
  */
  var popupEl = document.getElementById('popup');
  var popup = new bootstrap.Modal(popupEl);
  var popupTitleEl = document.getElementById('popupTitle');
  var popupBodyEl = document.getElementById('popupBody');
  var popupConfirmEl = document.getElementById('popupConfirm');
  popupEl.addEventListener('show.bs.modal', function (event) {
    prevValue = editor.getValue();
    prevCursor = editor.selection.getCursor();
  });
  popupEl.addEventListener('hide.bs.modal', reset);
  popupConfirmEl.addEventListener('click', function (event) {
    prevValue = editor.getValue();
    prevCursor = editor.selection.getCursor();
    popup.hide();
  });

  function reset(){
    if(prevValue != editor.getValue()){
      editor.setValue(prevValue);
    }
    editor.navigateTo(prevCursor.row, prevCursor.column);
    editor.focus();
  }
  
  function showPopup(title, body){
    popupTitleEl.innerHTML = title;
    popupBodyEl.innerHTML = body;
    popup.show();
  }

  /*
  Widgets
  */

  //New
  var newBtnEl = document.getElementById('newBtn');
  newBtnEl.addEventListener('click', function (event) {
    event.preventDefault();

    showPopup("Novo", `
    <div class="container-fluid container-buttons">
      <div class="row">
        <div class="col-sm-4"><div class="btn btn-primary" id="templateBtnFanFic">Fanfic com fundo</div></div>
        <div class="col-sm-4"><div class="btn btn-primary" id="templateBtnCharacter">Personagem com balão</div></div>
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
        showPopup("Personagem com balão", `
          <h3>Imagem do personagem</h3>
          ${imageHtml}

          <h3>Balão</h3>
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


  //Background
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

  //Texto
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

  //Image
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

  //Desenho
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

  //Bubble
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
    <label for="widgetBubbleDirection" class="form-label">Direção</label>
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

    showPopup("Balão de Texto", bubbleHtml);
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
      addToBegin(`function desenhaBalao(texto, direcao, font, tamanho, x, y) {
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

  //Ajuda
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
            O que é FunFic?
          </button>
        </h2>
        <div id="collapse1" class="accordion-collapse collapse show" aria-labelledby="heading1" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            FunFic é um espaço inventivo, onde você poderá explorar novas formas de construção, exibição e transmissão de conteúdo literário fazendo uso de novas tecnologias digitais. A ideia é proporcionar o encontro entre o universo fanfic e programação criativa em um ambiente laboratorial para desenvolvimento de novas experiências com a produção literária e escrita de códigos. 
            <br/><br/>
            Esperamos que quanto mais você exercitar suas ideias utilizando a FunFic, mais irá aprender sobre programação através da busca por customização da ferramenta.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading2">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
            O que é programação criativa?
          </button>
        </h2>
        <div id="collapse2" class="accordion-collapse collapse" aria-labelledby="heading2" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            <figure class="text-center">
              <blockquote class="blockquote">
                <p>Programação criativa é um tipo de programação de computadores em que o objetivo é criar algo expressivo em vez de algo funcional.</p>
              </blockquote>
              <figcaption class="blockquote-footer">
                John Maeda in <cite title="Source Title">Creative Code</cite>
              </figcaption>
            </figure>
            Toda programação é criativa, mas nem todo mundo programa de uma forma experimental, ou seja, sem saber exatamente onde o processo criativo vai levar. E isso muda tudo!
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading3">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
            O que é fanfic?
          </button>
        </h2>
        <div id="collapse3" class="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            FanFic é uma narrativa ficcional, escrita e divulgada em diversas plataformas pertencentes ao ciberespaço, dentre as mais conhecidas podemos citar: <a href="https://commaful.com/" target="_blank">Commaful</a>, <a href="https://www.wattpad.com/" target="_blank">Wattpad</a> e <a href="https://fanfiction.com.br/" target="_blank">FanFiction</a>.<br/>
            A criação de Fanfics parte da apropriação de personagens e enredos provenientes de produtos midiáticos como filmes, séries, quadrinhos, histórias videogames, etc. Portanto, tem como finalidade a construção de um universo paralelo ao original e também a ampliação do contato dos fãs com as obras que apreciam.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading4">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
            O que programação criativa e fanfic tem em comum?
          </button>
        </h2>
        <div id="collapse4" class="accordion-collapse collapse" aria-labelledby="heading4" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            Tanto o cenário da Fanfic como o do Programação Criativa, são espaços colaborativos, diversos, engajados, criativos e estimulantes, e acreditamos que ao aproximarmos esses dois universos em um mesmo ambiente, um irá potencializar as formas de expressão do outro. Nesse caso, o uso criativo da escrita literária irá alimentar a escrita criativa de códigos interativos e vice-versa.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading5">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
            Onde assisto aulas sobre programação?
          </button>
        </h2>
        <div id="collapse5" class="accordion-collapse collapse" aria-labelledby="heading5" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            <ul>
              <li>
                <a href="https://www.youtube.com/channel/UCry17aI_v6obn-XuSr_qjSA" target="_blank">Aula de Programação Criativa usando o p5js no Festival Multiverso</a>
              </li>
              <li>
                <a href="https://www.youtube.com/playlist?list=PLlrxD0HtieHhW0NCG7M536uHGOtJ95Ut2" target="_blank">Aula sobre JavaScript da Microsoft (Habilite as legendas)</a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCOiwQ_BVKNn6ftNaDqfPraw" target="_blank">Processing Community Day</a>
              </li>
              <li>
                <a href="https://www.youtube.com/user/shiffman" target="_blank">The Coding Train (Conteúdo em Inglês)</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading6">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="false" aria-controls="collapse6">
            Onde posso ler mais sobre programação?
          </button>
        </h2>
        <div id="collapse6" class="accordion-collapse collapse" aria-labelledby="heading6" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            Há pouco material para leitura em livros especializados em Programação Criativa em português que utilizam o P5.js como linguagem de ensino.
            <br/>
            Organizamos alguns materiais de acordo com alguns tipos de necessidades:
            <br/>
            <strong>Aprendizado de P5Js:</strong>
            <ul>
              <li>
                <a href="https://p5js.org/reference/" target="_blank">Documentação P5JS</a>
              </li>
            </ul>
            <strong>Aprendizado de Processing</strong>
            <ul>
              <li>
                <a href="https://codigotranscendente.github.io/livro/" target="_blank">O Código Transcendente de Mateus Berruezo</a>
              </li>
              <li>
                <a href="https://natureofcode.com/" target="_blank">Nature Of Code</a>
              </li>
            </ul>
            <strong>Aprendizado sobre a história da Programação Criativa</strong>
            <ul>
              <li>
                <a href="https://www.amazon.com.br/Arte-feita-código-programação-artistas-programadores/dp/8584991425" target="_blank">Arte feita em Código de Patrícia Oakim</a>
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
            Uma das coisas mais especiais sobre FanFic e Programação Criativa é o sentido de comunidade, de trocas entre pessoas, do acolhimento de pessoas em processo de aprendizado. Por isso encorajamos você a se conectar o máximo possível e aprender a partir da troca com outras pessoas.
            <ul>
              <li>
                <a href="https://encontrosdigitais.com.br/" target="_blank">Encontros Digitais (Rede social sobre Arte e Novas Tecnologias)</a>
              </li>
              <li>
                <a href="https://groups.google.com/g/processing-brasil" target="_blank">Grupo de email sobre Processing</a>
              </li>
              <li>
                <a href="https://t.me/programacaocriativaChat" target="_blank">Grupo sobre Programação Criativa no Telegram</a>
              </li>
              <li>
                <a href="https://openprocessing.com" target="_blank">OpenProcessing (Rede social de Programação Criativa)</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading8">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse8" aria-expanded="false" aria-controls="collapse8">
            Como faço para mudar o tamanho da minha área de desenho?
          </button>
        </h2>
        <div id="collapse8" class="accordion-collapse collapse" aria-labelledby="heading8" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            O comando <code>createCanvas(windowWidth, windowHeight);</code> define o tamanho da área de desenho. E as prorpriedades <code>windowWidth</code> e <code>windowHeight</code> fazem com que o programa tenha o tamanho da área disponível na janela do navegador.
            <br/>
            Se você quer mudar o tamanho, você precisa alterar <code>windowWidth</code> pelo número em pixels da largura que você quer, e <code>windowHeight</code> substitua pela altura.<br/>
            Ex: <code>createCanvas(1280, 720);</code>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading9">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse9" aria-expanded="false" aria-controls="collapse9">
            Como faço para sugerir correções no FunFic?
          </button>
        </h2>
        <div id="collapse9" class="accordion-collapse collapse" aria-labelledby="heading9" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            FunFic é o projeto Open Source. Caso queira contribuir com correções, criação de ferramentas e ampliação de possibilidades, acesse nosso github e fique a vontade. Ajude novos programadores a encontrar um caminho de aprendizado mais fácil e intuitivo. 
            <br/>
            <a href="https://github.com/FunFic" target="_blank">https://github.com/FunFic</a>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading10">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse10" aria-expanded="false" aria-controls="collapse10">
            Meu código não funciona, o que pode ser?
          </button>
        </h2>
        <div id="collapse10" class="accordion-collapse collapse" aria-labelledby="heading10" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            Um código pode não funcionar por várias razões. Vamos as principais delas:
            <ol>
              <li>
                Se seu código nunca funcionou, talvez seu dispositivo não seja compatível com a FunFic, que utiliza HTML e Canvas para realizar os desenhos. Para melhor experiência com a FunFic, recomendamos usar a versão mais atual do navegador Google Chrome.
              </li>
              <li>
                Seu código parou de funcionar depois de alguma alteração feita diretamente no código. Recomendamos o seguinte passo-a-passo:
                <ul>
                  <li>
                    Verificar se você digitou corretamente os comandos, comandos escritos com letras maiúsculas são diferentes de comandos escritos em letras minúsculas.
                  </li>
                  <li>
                    Verificar se há uma caixa de "Erro" no canto inferior direito. Esta funcionalidade apresenta a linha e o tipo de erro. Busque olhar para a linha onde o erro acontece, pode ter sido algum erro de digitação. Se não estiver evidente a solução, procure jogar no google o tipo de erro apresentado. Você vai descobrir que muita gente passou pelos mesmo desafios que você.
                  </li>
                  <li>
                    Verificar se os parênteses() e chaves{} foram todos fechados na ordem correta. É muito comum esquecer estes caracteres, ou embaralhar a ordem que eles são abertos e fechados. Se não tiver certeza de como isso funciona, recomendamos fazer o curso de JavaScript que recomendamos na pergunta “Onde assisto aulas sobre programação?”.
                  </li>
                </ul>
              </li>
            </ol>
            Esperamos que isso ajude você a resolver seu problema, se ainda tiver problemas, pode não ser uma questão de grafia do código, mas na lógica, e aí fica mais difícil achar uma solução pronta.  Experimente procurar por pessoas com problemas semelhanes no Google ou pedir ajuda no <a href="https://pt.stackoverflow.com/" target="_blank">StackOverflow</a>.
          </div>
        </div>
      </div>
      <!--
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading11">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse11" aria-expanded="false" aria-controls="collapse11">
            Você gostaria de ter o FunFic no seu site?
          </button>
        </h2>
        <div id="collapse11" class="accordion-collapse collapse" aria-labelledby="heading11" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            Fale conosco pelo email: XXXXXXXXXXXXXXXXXXX
            Estes são os locais onde a FunFic se encontra agora:
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
            A FunFic foi idealizada por <a href="https://www.instagram.com/4n4st4cio/" target="_blank">André Anastácio</a> e <a href="https://vamoss.com.br/" target="_blank">Carlos Oliveira (Vamoss)</a> durante a residência artística <a href="https://www.bibliolab.com.br/bibliohacklab" target="_blank">BiblioHackLab</a>, projeto de inovação, criatividade e desenvolvimento em Bibliotecas coordenados por <a href="http://www.casadaarvore.art.br/" target="_blank">Casa da Árvore</a>.<br/>
            Contou também com a orientação de <a href="http://www.vjpalm.com/" target="_blank">Ricardo Palmiere</a> e com a colaboração de <a href="https://esque.ma/" target="_blank">Tiago Rezende</a>.<br/>
            FunFic é um projeto possível graças a cultura do conhecimento aberto, e utilizou os projetos de código livre <a href="https://p5js.org/" target="_blank">P5js</a> da <a href="https://processingfoundation.org/" target="_blank">Fundação Processing</a>, <a href="https://ace.c9.io/" target="_blank">Ace Editor</a> e <a href="https://getbootstrap.com/" target="_blank">Bootstrap</a>.
          </div>
        </div>
      </div>
    </div>
    `);
  }

  //Salvar
  var saveBtnEl = document.getElementById('saveBtn');
  saveBtnEl.addEventListener('click', function (event) {
    event.preventDefault();

    showPopup("Salvar", `
    <div class="container-fluid container-buttons">
      <div class="row">
        <div class="col-sm-6"><div class="btn btn-primary" id="widgetSaveSaveCode">Salvar código</div></div>
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
            text: 'Minha criação no #FunFic'
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
      resultEl.contentWindow.postMessage({type:"getImage"});
    });

    if (navigator.canShare) {
      widgetSaveShareEl.addEventListener('click', event => {
        window.onImageLoaded = onLoadToShare;
        resultEl.contentWindow.postMessage({type:"getImage"});
      });
    } else {
      widgetSaveShareEl.style.display = "none";
      console.error(`Your system doesn't support sharing files.`);
    }
  });

  /*
  Injector
  */
  var injector = Injection();

  function addToBegin(code){
    editor.session.insert({row: 0, column: 0}, code);
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

  function validate(){
    var code = injector.validate(editor.getValue());
    editor.setValue(
      js_beautify(code)
    );
  }
  
  /*
  Service Worker
  */
  if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1"){
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
      .then(function(registration) {
        // Registration was successful
        // console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function(err) {
        // registration failed :(
        // console.log('ServiceWorker registration failed: ', err);
      });
    }
  }
});//DOMContentLoaded