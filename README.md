# FunFic

Repositório do editor FunFic. Disponível em:
[https://funfic.com.br](https://funfic.com.br)

Este é um projeto em HTML, CSS e JS puro, ou seja, não precisa rodar nenhum comando em Node ou algo do tipo.

Para rodar, é necessário [clonar](https://docs.github.com/pt/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository) e [servir a pasta usando um servidor HTTP](https://developer.mozilla.org/pt-BR/docs/Learn/Common_questions/set_up_a_local_testing_server) de preferência.


## O que é FunFic?

FunFic é um espaço inventivo, onde você poderá explorar novas formas de construção, exibição e transmissão de conteúdo literário fazendo uso de novas tecnologias digitais. A ideia é proporcionar o encontro entre o universo fanfic e programação criativa em um ambiente laboratorial para desenvolvimento de novas experiências com a produção literária e escrita de códigos.

Esperamos que quanto mais você exercitar suas ideias utilizando a FunFic, mais irá aprender sobre programação através da busca por customização da ferramenta.

## O que é programação criativa?

> Programação criativa é um tipo de programação de computadores em que o objetivo é criar algo expressivo em vez de algo funcional.

John Maeda in Creative Code

Toda programação é criativa, mas nem todo mundo programa de uma forma experimental, ou seja, sem saber exatamente onde o processo criativo vai levar. E isso muda tudo!

## O que é fanfic?

FanFic é uma narrativa ficcional, escrita e divulgada em diversas plataformas pertencentes ao ciberespaço, dentre as mais conhecidas podemos citar: [Commaful](https://commaful.com/), [Wattpad](https://www.wattpad.com/) e [FanFiction](https://fanfiction.com.br/).
A criação de Fanfics parte da apropriação de personagens e enredos provenientes de produtos midiáticos como filmes, séries, quadrinhos, histórias videogames, etc. Portanto, tem como finalidade a construção de um universo paralelo ao original e também a ampliação do contato dos fãs com as obras que apreciam.

## O que programação criativa e fanfic tem em comum?

Tanto o cenário da Fanfic como o do Programação Criativa, são espaços colaborativos, diversos, engajados, criativos e estimulantes, e acreditamos que ao aproximarmos esses dois universos em um mesmo ambiente, um irá potencializar as formas de expressão do outro. Nesse caso, o uso criativo da escrita literária irá alimentar a escrita criativa de códigos interativos e vice-versa.

## Onde assisto aulas sobre programação?

-   [Aula de Programação Criativa usando o p5js no Festival Multiverso](https://www.youtube.com/channel/UCry17aI_v6obn-XuSr_qjSA)
-   [Aula sobre JavaScript da Microsoft (Habilite as legendas)](https://www.youtube.com/playlist?list=PLlrxD0HtieHhW0NCG7M536uHGOtJ95Ut2)
-   [Processing Community Day](https://www.youtube.com/channel/UCOiwQ_BVKNn6ftNaDqfPraw)
-   [The Coding Train (Conteúdo em Inglês)](https://www.youtube.com/user/shiffman)

## Onde posso ler mais sobre programação?

Há pouco material para leitura em livros especializados em Programação Criativa em português que utilizam o P5.js como linguagem de ensino.

Organizamos alguns materiais de acordo com alguns tipos de necessidades:

### Aprendizado de P5Js:

-   [Documentação P5JS](https://p5js.org/reference/)

### Aprendizado de Processing

-   [O Código Transcendente de Mateus
    Berruezo](https://codigotranscendente.github.io/livro/)
-   [Nature Of Code](https://natureofcode.com/)

### Aprendizado sobre a história da Programação Criativa

-   [Arte feita em Código de Patrícia Oakim](https://www.amazon.com.br/Arte-feita-código-programação-artistas-programadores/dp/8584991425)
-   [O tecido das tecnologias criativas do Prof. Dr. Guilherme Ranoya](https://www.ranoya.com/books/public/tecnologiascriativas/)
-   [Creative Code de John Maeda](http://maedastudio.com/2004/creativecode/)
-   [Generative Art de Matt Pearson](https://www.manning.com/books/generative-art)

## Onde as pessoas que programam se comunicam?

Uma das coisas mais especiais sobre FanFic e Programação Criativa é o sentido de comunidade, de trocas entre pessoas, do acolhimento de pessoas em processo de aprendizado. Por isso encorajamos você a se conectar o máximo possível e aprender a partir da troca com outras pessoas.

-   [Encontros Digitais (Rede social sobre Arte e Novas Tecnologias)](https://encontrosdigitais.com.br/)
-   [Grupo de email sobre Processing](https://groups.google.com/g/processing-brasil)
-   [Grupo sobre Programação Criativa no Telegram](https://t.me/programacaocriativaChat)
-   [OpenProcessing (Rede social de Programação Criativa)](https://openprocessing.com)

## Como faço para mudar o tamanho da minha área de desenho?

O comando `createCanvas(windowWidth, windowHeight);` define o tamanho da área de desenho. E as propriedades `windowWidth` e `windowHeight` fazem com que o programa tenha o tamanho da área disponível na janela do navegador.

Se você quer mudar o tamanho, você precisa alterar `windowWidth` pelo número em pixels da largura que você quer, e `windowHeight` substitua pela altura.

Ex: `createCanvas(1280, 720);`

## Como faço para sugerir correções no FunFic?

FunFic é um projeto de código aberto(Open-Source). Caso queira contribuir com correções, criação de ferramentas e ampliação de possibilidades, acesse nosso github e fique à vontade. Ajude novos programadores a encontrar um caminho de aprendizado mais fácil e intuitivo.

[https://github.com/FunFic](https://github.com/FunFic)

## Meu código não funciona, o que pode ser?

Um código pode não funcionar por várias razões. Vamos as principais delas:

1.  Se seu código nunca funcionou, talvez seu dispositivo não seja compatível com a FunFic, que utiliza HTML e Canvas para realizar os desenhos. Para melhor experiência com a FunFic, recomendamos usar a versão mais atual do navegador Google Chrome.
2.  Seu código parou de funcionar depois de alguma alteração feita diretamente no código. Recomendamos o seguinte passo-a-passo:
    -   Verificar se você digitou corretamente os comandos, comandos escritos com letras maiúsculas são diferentes de comandos escritos em letras minúsculas.
    -   Verificar se há uma caixa de "Erro" no canto inferior direito. Esta funcionalidade apresenta a linha e o tipo de erro. Busque olhar para a linha onde o erro acontece, pode ter sido algum erro de digitação. Se não estiver evidente a solução, procure jogar no google o tipo de erro apresentado. Você vai descobrir que muita gente passou pelos mesmos desafios que você.
    -   Verificar se os parênteses() e chaves{} foram todos fechados na ordem correta. É muito comum esquecer estes caracteres, ou embaralhar a ordem que eles são abertos e fechados. Se não tiver certeza de como isso funciona, recomendamos fazer o curso de JavaScript que recomendamos na pergunta “Onde assisto aulas sobre programação?”.

Esperamos que isso ajude você a resolver seu problema, se ainda tiver  problemas, pode não ser uma questão de grafia do código, mas na lógica, e aí fica mais difícil achar uma solução pronta. Experimente procurar por pessoas com problemas semelhantes no Google ou pedir ajuda no [StackOverflow](https://pt.stackoverflow.com/).

## Quem criou a FunFic?

A FunFic foi idealizada por [André Anastácio](https://www.instagram.com/4n4st4cio/) e [Carlos Oliveira (Vamoss)](https://vamoss.com.br/) durante a residência artística [BiblioHackLab](https://www.bibliolab.com.br/bibliohacklab), projeto de inovação, criatividade e desenvolvimento em Bibliotecas coordenados por [Casa da Árvore](http://www.casadaarvore.art.br/).

Contou também com a orientação de [Ricardo Palmieri](http://www.vjpalm.com/) e com a colaboração de [Tiago Rezende](https://esque.ma/).

FunFic é um projeto possível graças a cultura do conhecimento aberto, e utilizou os projetos de código livre [P5js](https://p5js.org/) da [Fundação Processing](https://processingfoundation.org/), [Ace Editor](https://ace.c9.io/) e [Bootstrap](https://getbootstrap.com/).
