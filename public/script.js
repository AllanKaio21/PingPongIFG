import Base from '/base.js'

let base = new Base(); // Arquivo para salvar, pegar e deletar dados
let queue = base.getLocal();
let queueGame = [];
let queueStorage = [];
let Ngame = 0;

/* 
*  Função para carregar a fila na tabela html
*/
let queueLoad = () => {
  if(queue.length > 0){
    let table = document.querySelector("#tableQueue");
    let tbodyD = table.querySelector("tbody");
    tbodyD.parentNode.removeChild(tbodyD);
    let tbody = document.createElement('tbody');
    for(let i = 0; i < queue.length; i++){  
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      let td2 = document.createElement('td');
      let td3 = document.createElement('td');
      let td4 = document.createElement('td');

      td.innerHTML = queue[i][0];
      td.classList.add('btn-table');
      td.setAttribute("id", `player${i}`);
      td.title = "Retirar da fila!";
      td2.innerHTML = queue[i][1];
      td2.setAttribute("id", "vic");
      td3.innerHTML = queue[i][2];
      td3.setAttribute("id", "def");
      td4.innerHTML = `#${i+1}`;
      td4.setAttribute("id", "pos");

      tr.setAttribute("id", `player${i}`);
      tr.appendChild(td4);
      tr.appendChild(td);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
  }
}
/* 
*  Função para iniciar a tabela de partida entre dois jogadores
*/
let initGame = () => {
  let table = document.querySelector("#tableGame");
  let tra = table.querySelector("tr");
  tra.outerHTML = '';
  let tr = document.createElement('tr');
  let td = document.createElement('td');
  let td2 = document.createElement('td');
  let td3 = document.createElement('td');
  let td4 = document.createElement('td');
  
  td.innerHTML = queueGame[0][0];
  td.classList.add('btn-table');
  td.setAttribute("id", "plgame");
  td.title = "Ponto +1";
  td2.innerHTML = queueGame[1][0];
  td2.classList.add('btn-table');
  td2.title = "Ponto +1";
  td2.setAttribute("id", "pl2game");
  td3.innerHTML = `${queueGame[0][3]} x ${queueGame[1][3]}`;
  td3.setAttribute("id", "pont");
  td4.innerHTML = "Finalizar";
  td4.classList.add('btn-tableFN');
  td4.setAttribute("id", "btnFN");

  tr.appendChild(td);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  table.appendChild(tr);
  finishGame();
}
/* 
*  Função para adicionar pontuação a um jogador
*/
let score = () => {
  // Potuação
  if(Ngame > 0){
    let btnpl1 = document.querySelector("#plgame");
    btnpl1.addEventListener('click', () => {
      queueGame[0][3]++;
      initGame();
      qStorage();
    });
    let btnpl2 = document.querySelector("#pl2game");
    btnpl2.addEventListener('click', () => {
      queueGame[1][3]++;
      initGame();
      qStorage();
    });
  }
}
score();
/* 
*  Função para verificar o fim de uma partida e recriar uma
*  nova partida
*/
let finishGame = () => {
  // Finalizar Jogo
  let btnFN = document.querySelector("#btnFN");
  btnFN.addEventListener('click', () =>{
    if(queueGame.length < 2)
      return;
    let def = 0;
    let vic = 1;
    if(queueGame[0][3] != queueGame[1][3]){
      if(queueGame[0][3] > queueGame[1][3]){
        def = 1;
        vic = 0;
      }
      Ngame++;
      queueGame[vic][1]++;
      queueGame[def][2]++;
      queueGame[vic][3] = 0;
      queueGame[def][3] = 0;
      queue.push(queueGame[def]);
      queueGame.splice(def, 1);
      queueGame.push(queue[0]);
      queue.splice(0,1);
      queueLoad();
      removeQueue();
      initGame();
      qStorage();
    }else{
      alert("A partida está empatada!");
    }
  });
  score();
}
finishGame();
/* 
*  Função para remover um jogador da fila
*/
let removeQueue = () => {
  for(let i = 0; i < queue.length; i++){
    let pl = `#player${i}`;
    let btnrm = document.querySelector(pl);
    btnrm.addEventListener('click', () =>{
      let tr = document.querySelector(pl);
      tr.parentNode.removeChild(tr);
      queue.splice(i, 1);
      qStorage();
    });
  }
}
/* 
*  Função para verificar se um jogador já esta na fila
*/
let existPlayer = (name) => {
  for(let i=0; i < queue.length; i++){
    if(name.toUpperCase() === queue[i][0].toUpperCase())
      return true;
  }
  return false;
}
/* 
*  botão de inserir novos jogadores a fila
*/
let btn = document.querySelector("#btn");
btn.addEventListener('click', () =>{
  let input = document.querySelector("#input");
  let text = input.value;
  if(!existPlayer(text) && text !== ""){
    input.value = '';
    let date = [`${text}`, 0, 0, 0];
    queue.push(date)
    if(Ngame == 0 && queue.length >=2){
      Ngame++;
      queueGame[0] = queue[0];
      queueGame[1] = queue[1];
      initGame();
      queue.splice(0, 2);
    }
    queueLoad();
    removeQueue();
    qStorage();
  }else if(text === ""){
    alert("Digite um valor valido!");
  }else{
    alert(`O jogador ${text}, está na fila.`);
  }
});
/* 
*  Botão para limpar o local storage do navegador
*/
let btnRe = document.querySelector("#btn-reset");
btnRe.addEventListener('click', () =>{
  base.clearQueue();
});
/* 
*  Identificar a tecla "Enter" para enviar dados
*/
document.addEventListener("keypress", (e) => {
  if(e.key == 'Enter') {
    let btn = document.querySelector("#btn");
    btn.click();
  }
});
/* 
*  Função salvar a fila no local storage do navegador
*/
let qStorage = () => {
  queueStorage = [];
  for(let i=0; i < queueGame.length; i++){
    queueStorage.push(queueGame[i]);
  }
  for(let i=0; i < queue.length; i++){
    queueStorage.push(queue[i]);
  }
  base.saveLocal(queueStorage);
}
/* 
*  Carrega nova partida caso tenha dados no local storage
*/
if(Ngame == 0 && queue.length >=2){
  Ngame++;
  queueGame[0] = queue[0];
  queueGame[1] = queue[1];
  initGame();
  queue.splice(0, 2);
  queueLoad();
  removeQueue();
}