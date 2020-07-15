class JogoDaMemoria{

  constructor ({tela, util}){
    this.tela = tela
    this.util = util
    this.heroisIniciais = [
      {img: './assets/img/atom.png',nome: 'Átomo'},
      {img: './assets/img/bat.png',nome: 'Batman'},
      {img: './assets/img/spman.png',nome: 'Superman'},
      {img: './assets/img/robin.png',nome: 'Robin'}
    ]
    this.iconePadrao = './assets/img/ninja.png'
    this.heroisEscondidos = []
    this.heroisSelecionados = []
  }
  //para usar o this não usar static
  inicializar(){
    this.tela.atualizarImagens(this.heroisIniciais)
    //.bind força a tela a usar o this do jogoDaMemoria.js
    this.tela.configurarBotaoJogar(this.jogar.bind(this))
    this.tela.configurarBotaoVerificarSelecao(this.verificarSelecao.bind(this))
    this.tela.configurarBotaoMostrarTudo(this.mostrarHeroisEscondidos.bind(this))
  }
  async embaralhar(){
    const copias = this.heroisIniciais
    //duplicar os itens
    .concat(this.heroisIniciais)

    .map(item =>{
      return Object.assign({},item,{
        id:Math.random()/0.5
      })
    })
    .sort(()=>Math.random()-0.5)
    this.tela.atualizarImagens(copias)
    this.tela.exibirCarregando()

    const idDoIntervalo = this.tela.iniciarContador()


    //esperar 3 seg para atualizar a tela
    await this.util.timeout(3000)
    this.tela.limparContador(idDoIntervalo)
    this.esconderHerois(copias)
    this.tela.exibirCarregando(false)
  }
  esconderHerois(herois){
    //trocar a imagem de todos herois existentes
    const heroisOcultos = herois.map(({nome,id})=>({
      id,
      nome,
      img: this.iconePadrao
    }))
    //atualizamos a tela com os herois ocultos
    this.tela.atualizarImagens(heroisOcultos)
    //guardamos todos os herois para trabalhar com eles depois
    this.heroisEscondidos = heroisOcultos
  }
  exibirHerois(nomeDoHeroi){
    //procurar pelo nomde do heroi e obter apenas a img dele
    const {img} = this.heroisIniciais.find(({nome})=> nomeDoHeroi === nome)
    //função para exibir heroi na tela
    this.tela.exibirHerois(nomeDoHeroi, img)
  }
  verificarSelecao(id, nome){
    const item = {id,nome}
    //verificar a quantidade de herois selecionados
    //ações de certo e errado
    const heroisSelecionados = this.heroisSelecionados.length
    switch(heroisSelecionados){
      case 0:
        //adiciona a escolha no array
        this.heroisSelecionados.push(item)
        break;
      case 1:
        //se a quantidade for 1, significa que o usuario so pode escolher mais 1
        //pegar o primeiro item da lista
        const [opcao1] = this.heroisSelecionados
        //zerar itens para não selecionados mais de dois
        this.heroisSelecionados = []
        //conferindo se nome e ID batem conforme o esperado

        //nome igual mas id diferente = correto => o usuario não clicou 
        //2 vezes no mesmo
        if(opcao1.nome === item.nome && opcao1.id !==item.id){
          this.exibirHerois(item.nome)
          //como o padrão é o TRUE, não precisa passar nada inicialmente
          this.tela.exibirMensagem()
          return
        }
        this.tela.exibirMensagem(false)
        //fim da execução
        break
    }
  }

  mostrarHeroisEscondidos(){
    //pegamos todos os elementos da tela e colocamos 
    //seu respectivo valor correto
    const heroisEscondidos = this.heroisEscondidos
    for(const heroi of heroisEscondidos){
      const {img} = this.heroisIniciais.find(item => item.nome === heroi.nome)
      heroi.img = img
    }
    this.tela.atualizarImagens(heroisEscondidos)
  }

  jogar(){
    this.embaralhar()
  }
}