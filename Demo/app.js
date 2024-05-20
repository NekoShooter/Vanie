import { globalVanie, Vanie} from "../index.js"

function main(){
//#region DOM
    const raiz = document.getElementById('raiz');
    const barra = document.getElementById('barra');
    const soporte = document.querySelector('.soporte-barra');
    const fondo = document.getElementById('fondo');
    const subFondo = document.getElementById('sub-fondo');
    const btn_firefox = document.getElementById('firefox');
    const btn_menu = document.getElementById('menu');
    const btn_vsCode = document.getElementById('vs-code');
    const btn_youtube = document.getElementById('video');
//#region declaracion de funciones
    const SO = ['windows','mac','linux']
    let sis = SO[Math.floor(Math.random() * 3)];
    let tema = ['oscuro','claro'][Math.floor(Math.random() * 2)];
    let barraOculta = false;

    const background = {mac:'https://c.wallhere.com/photos/3b/4e/MacOS_Ventura_Apple_Inc_digital_art-2290490.jpg!d',
               windows:'https://c.wallhere.com/photos/73/fb/Windows_10_Microsoft_windows_logo_simple_background-2124537.jpg!d',
               linux:'https://c.wallhere.com/photos/07/c8/Ubuntu_ubuntu_desktop_logo_operating_system_abstract-2287924.jpg!d',
               sistema:undefined,
               img(){return this[this.sistema];}}

    subFondo.addEventListener('load',()=>{
        fondo.classList.add(globalVanie.globalClass('animacion'));
            if(fondo.src != '') fondo.style.opacity = 0;
            else fondo.setAttribute('src',background.img())});
    
    fondo.addEventListener('transitionend',()=>{
        fondo.classList.remove(globalVanie.globalClass('animacion'));
        fondo.setAttribute('src',background.img())});
        
    function cambiarFondo(sistema){
        if(sistema == background.sistema) return;
        background.sistema = sistema;
        document.body.setAttribute('id',sistema);
        subFondo.setAttribute('src',background.img());}

    fondo.addEventListener('load',()=>fondo.style.opacity = '');

    barra.addEventListener('transitionend',()=>barra.classList.remove(globalVanie.globalClass('animacion')));
    soporte.addEventListener('mouseenter',()=>{
        if(!barraOculta) return;
        mostraBarra(true);});

    soporte.addEventListener('mouseleave',()=>{
        if(barraOculta)mostraBarra(!barraOculta);});

    function mostraBarra(condicion){
        barra.classList.add(globalVanie.globalClass('animacion'));
        barra.style.transform = `translateY(${condicion?-75:0}px)`;}

    function centro(DOM){
        const w = DOM.offsetWidth;
        const x = DOM.getBoundingClientRect().left;
        const y = DOM.getBoundingClientRect().top;
        return [x + w/2, y];}

    function contenidoMenu(ventana){
        const div = document.createElement('div');
        const div2 = document.createElement('div');
        const btn_claroscuro = document.createElement('button');
        const div_btn = document.createElement('div');
        div2.appendChild(document.createElement('div'));
        
        div.appendChild(btn_claroscuro);
        div.appendChild(document.createElement('h1'));
        div.appendChild(document.createElement('p'));
        div.appendChild(div_btn);
        
        btn_claroscuro.setAttribute('id','claroscuro');
        btn_claroscuro.style.backgroundImage = `url("https://cdn.icon-icons.com/icons2/2171/PNG/512/spring_sun_light_sunlight_weather_summer_sunny_icon_133280.png")`;

        const btn={}
        const cambio = (sistema)=>{
            btn[sistema].addEventListener('click',()=>{
                cambiarFondo(sistema);
                btn[sistema].classList.add('btn-selecionado',globalVanie.globalClass('bloqueado'));
                for(const _so of SO) {
                    if(_so != sistema) 
                        btn[_so].classList.remove('btn-selecionado',globalVanie.globalClass('bloqueado'));}
                sis = sistema;
                globalVanie.establecerBase(`${sistema}-${tema}`);});}

        const modClaroscuro = esp=>{
            btn_claroscuro.style.backgroundColor = '#f2f2f2';
            btn_claroscuro.style.filter = esp == 'claro' ? `invert(100%)`:'';
            return {claro:'oscuro',oscuro:'claro'}[esp];}

        let esq = modClaroscuro(tema);

        btn_claroscuro.addEventListener('click',()=>{
            tema = esq;
            globalVanie.establecerBase(sis +'-'+ esq);
            esq = modClaroscuro(esq);});

        for(const _so of SO) {
            btn[_so] = document.createElement('button');
            div_btn.appendChild(btn[_so]);
            cambio(_so);}
        
        btn[sis].classList.add('btn-selecionado',globalVanie.globalClass('bloqueado'));
        ventana.id('lienzo','lienzo');
        ventana.lienzoAgrega(div2,div);}

// #region Inicio

    globalVanie.establecerBase(sis +'-'+ tema).conectarseA(raiz);

    globalVanie.addEventListener('registro',vanie=>vanie.justificarCabecera = 'center');
    globalVanie.addEventListener('colision',o=>{
        barraOculta = o.inf;
        mostraBarra(!o.inf)});

    globalVanie.limites = {inf:`100%-${barra.offsetHeight/2}`};

    cambiarFondo(sis);

    const firefox = new Vanie;
    const vs_code = new Vanie;
    const youtube = new Vanie;
    const menu = new Vanie;

    menu.titulo = 'Demo';
    youtube.titulo = 'youtube';
    vs_code.titulo = 'vs code';
    firefox.titulo = 'firefox';

    function cambiarPuntoDeRetorno(){
        menu.cambiarPuntoDeRetorno(...centro(btn_menu));
        youtube.cambiarPuntoDeRetorno(...centro(btn_youtube));
        vs_code.cambiarPuntoDeRetorno(...centro(btn_vsCode));
        firefox.cambiarPuntoDeRetorno(...centro(btn_firefox));}

    cambiarPuntoDeRetorno();

    menu.animarApertura(false);
    menu.addEventListener('cerrar',menu.animarApertura);
    menu.cambiarDimensionDelLienzo(500,300,true);  
    contenidoMenu(menu);
    menu.abrir();

    vs_code.cargarURL('https://idx.dev/');
    vs_code.cambiarDimensionInicial('70%','80%');

    youtube.cambiarDimensionDelLienzo(720,(720 * 9)/16);
    let id = undefined;
    let id_ant = undefined;
    function cargarNuevoVideo(){
        const videoId = ['1Swg-aBO9eY','eSW2LVbPThw','Ljjut210k90','O-gr-22V0r0','19y8YTbvri8'];
        while(true){
            const ranId = Math.floor(Math.random()* videoId.length);
            if(ranId != id && id_ant != ranId){
                id_ant = id;
                id = ranId; break;}}
        youtube.cargarURL(`https://www.youtube.com/embed/${videoId[id]}`);}

    youtube.addEventListener('abrir',cargarNuevoVideo);

    firefox.cargarURL('https://www.google.com/search?igu=1');
    firefox.cambiarDimensionInicial('70%','80%');

    btn_menu.addEventListener('click',menu.abrir);
    btn_firefox.addEventListener('click',firefox.abrir);
    btn_vsCode.addEventListener('click',vs_code.abrir);
    btn_youtube.addEventListener('click',youtube.abrir);
    //window.addEventListener('resize',cambiarPuntoDeRetorno);
}



window.addEventListener('load',main);