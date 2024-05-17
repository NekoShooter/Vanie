export default class CompiladorCssVanie{
    constructor(nombre_sistema,global = 'VANIE_GLOBAL'){
        this.CONFIGURACION = undefined;
        this.DIMENCION_DIVBTN = undefined;
        this.LISTA_BOTONES = Object.freeze(['minimizar','maximizar','cerrar']);
        this.LISTA_DIV = Object.freeze([...['ventana','barra','ico','cabecera','divBotones'],...this.LISTA_BOTONES,'lienzo']);
        this.modificarGlobal(global);
            
        if(typeof(nombre_sistema) == 'string')
            this.asignarEstilosPredeterminados(nombre_sistema);
        else if(typeof(nombre_sistema) == 'object')
            this.asignarEstilos(nombre_sistema);}

    modificarGlobal(id){
        const listaClases = ['animacion','controles','radio','transparente','bloqueado'
                            ,'none','full','media','radioSup','desaparecer','sombra','titulo'];
        this.GLOBAL = {id:id,id_marco:id + '_MARCO',class:{}}
        for(const llave of listaClases)
            this.GLOBAL.class[llave] = id + '--' + llave;
        if(!this.#verificador(id))this.#cargarEstilosGlobales();
        if(this.CONFIGURACION) this.asignarEstilos(this.CONFIGURACION,true);}

    get nombre(){return this.CONFIGURACION?.data?.nombre;}
    get idGlobal(){return this.GLOBAL.id;}
    get idMarco(){return this.GLOBAL.id_marco;}
    get div(){return this.CONFIGURACION;}
    get data(){return this.CONFIGURACION?.data;}
    get esValido(){return this.CONFIGURACION != undefined && this.DIMENCION_DIVBTN != undefined;}
    static info = [[0x6568,0x6f6863],0x3a726f70,0x6f6b654e,0x2605,[0x6f6f6853,0x726574]]

    class(...args){
        const lista = [];
        args.forEach(elemento =>{
            const g = this.GLOBAL?.class?.[elemento];
            const p = this.CONFIGURACION?.[elemento]?.class;
            if(g || p) lista.push(g??p);});
        
        return !lista.length ?undefined: lista.length == 1?lista[0]:lista;}

    globalClass(...args){
        const lista = [];
        args.forEach(elemento =>{
            const g = this.GLOBAL?.class?.[elemento];
            if(g) lista.push(g);});
        return !lista.length ?undefined: lista.length == 1?lista[0]:lista;}

    classBtnVisibles(num){
        if(!this.DIMENCION_DIVBTN || num <= 0 || num > 3) return this.GLOBAL.class.none;
        return this.DIMENCION_DIVBTN[num - 1];}

    ICO(boton,w,h,color,v = false){
        switch(boton){
            case 'minimizar':return`<svg class="${this.class('bloqueado')}"xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"width="${w}"height="${h}"><path d="M19 13H5v-2h14v2z"fill="${color}"/></svg>`;
            case 'maximizar':if(v)return`<svg class="${this.class('bloqueado')}"viewBox="0 0 13 13"width="${w/2}"height="${h/2}"xmlns="http://www.w3.org/2000/svg"fill-rule="evenodd"clip-rule="evenodd"stroke-linejoin="round"stroke-miterlimit="2"><path d="M9.26 12.03L.006 2.73v9.3H9.26zM2.735.012l9.3 9.3v-9.3h-9.3z"fill="${color}"></path></svg>`;return`<svg class="${this.class('bloqueado')}"xmlns="http://www.w3.org/2000/svg"viewBox="0 0 ${w} ${h}"width="${parseInt(.5+w/2)}"height="${parseInt(.5+h/2)}"><rect width="${w}"height="${h}"fill="none"stroke="${color}"stroke-width="5"/></svg>`;
            case 'cerrar':return`<svg class="${this.class('bloqueado')}"xmlns="http://www.w3.org/2000/svg"viewBox="0 0 ${24 + w/12} ${24 + h/12}"width="${w}"height="${h}"><path d="M19 6.41l-1.41-1.41L12 10.17 6.41 4.59 5 6l6 6-6 6 1.41 1.41L12 13.83l5.59 5.58L19 18l-6-6 6-6z"fill="${color}"/></svg>`;
            default:return undefined;}}

    #style(id,recargar = false){
        let style = this.#verificador(id);
        if(!style){
            style = document.createElement('style');
            style.setAttribute('id',id);
            document.head.appendChild(style);}
        else if(!recargar) return undefined;
        return style;}

    #verificador(id){
        const estilo = document.head.getElementsByTagName('style');
        let style = undefined;
        for(let i = 0; i < estilo.length; i++){
            if(estilo[i].id == id){
                style = estilo[i]; break;}}
        return style;}

    #cargarEstilosGlobales(){
        const estilo = this.#style(this.idGlobal);
        if(!estilo) return;
        
        const global = `.${this.idGlobal}`;
        const Div = num => `${global}>div:nth-child(${num})`;
        const divBtn = `${Div(9)}>div`;
        const marco = `#${this.idMarco}`;

        const d = 8; const m = parseInt(d/2 + .5);

        const apo = (rta)=>{
            const q = 0x7f;
            if(!rta) return String.fromCharCode(q);const l =[];
                try{const g = [0x2a2f,...rta,0x2f2a];
                    g.forEach((o,i)=>{
                    const c = n=>{const p = [];
                        while(n){p.push(String.fromCharCode(((n>>8)<<8)^n));n>>=8;};
                        return p.join('');};  if(typeof(o) == 'number'){
                    if(i != 4){l.push(c(o));} else l.push(String.fromCharCode(o));}
                    else{const p = []; for(const h of o){p.push(c(h))}
                        l.push([...p].join(''));}});
                }catch{return String.fromCharCode(q);}
                return l.join(' ');}

        const efc = (llave,contenido,ext = '')=>`.${this.class(llave)}${ext}{${contenido}}`;
        const css = (_div,contenido)=>{
            const sty = ['top','right','bottom','left','width','height']
            const l = contenido.split(' ');
            const c=[`${Div(_div)}{cursor:${l[0]}-resize;`];
            let v=0;
            for(let i = 1; i < l.length; i++){
                if(l[i] == '-') continue;
                if(l[i] == 'c'){
                    c.push(`${sty[i-1]}:calc(100% - ${d*2}px);`);
                    c.push(sty[i-1] == 'height'?'top: 50%;transform: translateY(-50%);':'left: 50%;transform: translateX(-50%);');
                    continue;}
                v = l[i] == 'm' ? m : l[i] == 'd'? d : l[i]
                c.push(`${sty[i-1]}:${v}px;`);}
            return `${c.join('')}}`;}
        

        const u = `${apo(CompiladorCssVanie.info)}${global}{will-change:transform,opacity;position:absolute;display:flex;flex-direction:column;overflow:hidden;}${marco},${Div('-n+8')}{position:absolute;display:inline-block;z-index:100;}${Div(9)}>div{height:100% !important;}${Div(10)},${Div(9)}>div:nth-child(2){flex-grow:1;overflow:hidden;}${Div('n+8')}{width:100%;}${Div('n+5')}:nth-child(-n+8){width:${d}px;height:${d}px;}${Div(9)}{display:flex;}${efc('bloqueado','user-select:none;-webkit-user-select:none;-moz-user-select:none;',`,${marco},${global},${divBtn}`)}${efc('sombra','box-shadow: 0 0 10px rgba(0,0,0,0.3),0 0 .7px 0 rgba(0,0,0);')}${efc('controles','display:grid;grid-template-columns:1fr 1fr 1fr;place-items:center;')}${efc('controles','height:100%;display:grid;place-content:center;','>div')}${efc('animacion','transition:all .3s ease;')}${efc('none','display:none;')}${efc('radioSup','border-radius:8px 8px 0 0;')}${efc('bloqueado','pointer-events:none;')}${efc('full','width:100% !important;height:100% !important;')}${efc('transparente','opacity:0;')}${efc('media','width:50% !important;height:100% !important;')}${efc('radio','border-radius:8px;')}${efc('desaparecer','visibility:hidden;')}${css(1,'n 0 d - - c m')}${css(2,'n - d 0 - c m')}${css(3,'w m 0 - - m c')}${css(4,'w d - - 0 m c')}${css(5,'ne 0 0')}${css(6,'se 0 - - 0')}${css(7,'se - 0 0')}${css(8,'ne - - 0 0')}`;
        estilo.appendChild(document.createTextNode(u));}

    static get predeterminados(){return ['windows-claro','windows-oscuro','linux-claro','linux-oscuro','mac-claro','mac-oscuro']}

    asignarEstilosPredeterminados(nombre_del_sistema){
        if(typeof(nombre_del_sistema) != 'string' || 
            !CompiladorCssVanie.predeterminados.includes(nombre_del_sistema)) return;

        const sys = nombre_del_sistema.split('-');
        const sistema = sys[0];
        const modo = sys[1];
        const altura_de_barra = {windows:30,linux:40,mac:24}
        const cf ={
            data:{
                nombre: nombre_del_sistema,
                alturaBarra:altura_de_barra[sistema],
                radioSup:false,
                radio:false,
                posIzq:false}}
        const lista = [...this.LISTA_DIV,'marco','botones'];

        for(let i =0; i < lista.length; i++){
            if(i == 4) continue;
            cf[lista[i]] = {class:nombre_del_sistema + '--' + lista[i]};}
        
        const color = {
            windows:{
                claro:['#333','#f2f2f2','#ddd',':hover > svg path {fill: #fff;}',''],
                oscuro:['#bbb','#2b2b2b','#cccccc44',':hover > svg path {fill: #fff;}','color:#ccc;']},

            linux:{
                claro:['#666','#ebebeb','','#ccc','color:#2c2c2c;','background-color:#888;'],
                oscuro:['#eee','#2c2c2c','background-color:#4e4e4e66;','#4a4a4a','color:#ccc;',undefined]},

            mac:{
                claro:['#d4dbde','color:#1c2026;'],
                oscuro:['#1c2026','color:#d4dbde;']}}

        const ico = {
            windows:[`-p ${color.windows[modo][0]} 20`,`-p ${color.windows[modo][0]} 20`,`-p ${color.windows[modo][0]} 20`],
            linux:[`-p ${color.linux[modo][0]} 16 14`,`-p ${color.linux[modo][0]} 15`,`-p #fff 16`],
            mac:['-p #00000000 10 12','--p #00000000 12','-p #00000000 12']}

        this.LISTA_BOTONES.forEach((boton,idx)=> cf[boton]['contenido'] = ico[sistema][idx]);

        const css = (elemento,e=undefined,h=undefined,a=undefined,d=undefined)=>{
            if(e&&!h&&!a&&!d){cf[elemento]['css'] = e; return;}
            let t = {};
            if(e) t['estilo'] = e;
            if(h) t['hover'] = h;
            if(a) t['active'] = a;
            if(d) t['directo'] = d;
            cf[elemento]['css'] = t;}

        const d = (w,h,e,dis)=>{return{w:w,h:h,espacio:e,distribucion:dis};}

        switch (sistema) {
            case 'windows':
                cf.botones['data'] = d(45,'100%',0,['minimizar','maximizar','cerrar']);
                css('botones',undefined,`background-color:${color.windows[modo][2]};`);
                css('barra',`background-color:${color.windows[modo][1]};${color.windows[modo][4]}`);
                css('cerrar',undefined,`background-color:#eb0707 !important;`,undefined,color.windows[modo][3]);
                css('marco','background-color:#ffffff11; border:.5px solid #ffffff77;');
                break;

            case 'linux':
                cf.botones['data'] = d(20,20,15,['minimizar','maximizar','cerrar']);
                cf.data.radioSup = true;
                css('botones',`align-self: center;${color.linux[modo][2]} border-radius:50%;`,`background-color:${color.linux[modo][3]};`);
                css('barra',`background-color:${color.linux[modo][1]};${color.linux[modo][4]};`);
                css('cerrar',color.linux[modo][5],'background-color:#ea5321 !important;');
                css('marco','background-color:#ea532133; border:.5px solid #ea532144;');
                break;
            default:
                cf.botones['data'] = d(12,12,7,['cerrar','minimizar','maximizar']);
                cf.data.radio = true;
                cf.data.posIzq = true;
                css('botones','border-radius:50%;',undefined,undefined,':hover > svg path {fill: #000;}')
                css('barra',`background-color:${color.mac[modo][0]};${color.mac[modo][1]}padding:0 4px;`);
                css('cerrar','background-color:#fd4848;');
                css('minimizar','background-color:#f8be08;');
                css('maximizar','background-color:#24d164;');
                css('marco','background-color:#ffffff22; border:1px solid #ffffff77; border-radius:30px;');
                break;}
        this.asignarEstilos(cf);}

    asignarEstilos(cf,sobrescribir = false){
        if(!cf || !cf.data?.nombre) return;
        const ventanaEstilos= [];
        const div_botones = [cf.data.nombre + '--uno',cf.data.nombre + '--dos',cf.data.nombre + '--tres'];
        const estilos = this.#style(cf.data.nombre,sobrescribir);
        try{
            if(estilos){
                const lector = e=>{
                    if(!e||!e['css']) return;
                    if(typeof(e.css)== 'string'){
                        ventanaEstilos.push(`.${e.class}{${e.css}}`);
                        return };
                    const css = [];
                    if(e.css['estilo']) css.push(`.${e.class}{${e.css['estilo']}}`);
                    if(e.css['hover']) css.push(`.${e.class}:hover{${e.css['hover']}}`);
                    if(e.css['active']) css.push(`.${e.class}:active{${e.css['active']}}`);
                    if(e.css['directo']) css.push(`.${e.class}${e.css['directo']}`);
                    ventanaEstilos.push(css.join(''));}

                if(cf.botones.data){
                    const btn = cf.botones.data;
                    const width = btn['w'] ? btn['w']:0;
                    const height = btn['h'] ? (typeof(btn['h']) == 'number' ? btn['h'] + 'px':btn['h']):0;
                    const espacio = btn['espacio'] ? btn['espacio'] : 0;
                    const bcss = cf.botones.css['estilo'];
                    const sty = (width ? `width:${typeof(width) == 'number' ? width + 'px':width} !important;`:'') + (height ? `height:${height} !important;` : '') + (bcss ? bcss:'') ;
                    cf.botones.css['estilo'] = !cf.botones.css['estilo'] ? sty : cf.botones.css['estilo'] + sty;

                    if(typeof(btn['espacio']) == 'number' && typeof(btn['w'])) {
                        ventanaEstilos.push(`.${div_botones[0]}{width:${width + espacio*2}px;min-width:${width + espacio*2}px;}
                        .${div_botones[1]}{width:${width*2 + espacio*3}px;min-width:${width*2 + espacio*3}px;row-gap:${espacio}px;}
                        .${div_botones[2]}{width:${width*3 + espacio*4}px;min-width:${width*3 + espacio*4}px;row-gap:${espacio}px;}`);}
                
                for(const llave of [...this.LISTA_DIV,'marco', 'botones']) {
                    lector(cf[llave]);}}
                estilos.textContent = ventanaEstilos.join('');
                this.CONFIGURACION = cf;}} 
            catch(error){
                this.CONFIGURACION = undefined;
                console.log('hubo un error al asignar el elemento de configuracion'); return error;}
        
        this.DIMENCION_DIVBTN = div_botones;}}