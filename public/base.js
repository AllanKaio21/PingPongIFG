export default class Base {
  /* 
  *  Função para salvar dados da fila no local storage
  */
  saveLocal(queue){
    localStorage.setItem('queue', JSON.stringify(queue));
  }
  /* 
  *  Função para pegar dados do local storage
  */
  getLocal(){
    let obj = localStorage.getItem('queue');
    let queue = JSON.parse(obj);
    if(queue == null)
      queue = [];
    return queue;
  }
  /* 
  *  Função para deletar todos os dados do local storage
  */
  clearQueue(){
    localStorage.clear();
  }
}