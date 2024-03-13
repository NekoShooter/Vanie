class Vany {
    constructor(sistema){
        this.__cf = {dimencion:{inicial:{w:720,h:480},minima:{w:0,h:0},fija:undefined},
                     posicion:{apertura:{x:'center',y:'center'},origen:{x:0,y:0}},
                     cabecera:{str:undefined,justificado:undefined},
                     padre:GestorVany.instancia.padre,
                     hijoLienzo:undefined, url:undefined,
                     eliminar_al_carrar:true, posIzq:undefined};
        this.eliminar();
        this.MARCO = undefined;
        this.LLAVE = GestorVany.instancia.enlazarCon(this);
        this.__funciones = {minimizar:[],maximizar:[],media:[],cerrar:[],abrir:[]};
        this.sys = GestorVany.instancia.obtenerEstilo(sistema);
        if(!this.sys) this.sys = GestorVany.instancia.agregarEstilo(sistema);}

    eliminar(){
        this.removerPadre();
        this.__estado = {min:false,max:false,cerrar:false,media:false,mediaPos:undefined};
        this.__v = undefined;
        this.__r = undefined;
        this.__cache={min:{dimencion:this.__cf.dimencion.inicial, posicion: this.__cf.posicion.apertura},
                        max:{dimencion:this.__cf.dimencion.inicial, posicion: this.__cf.posicion.apertura},
                        media:{dimencion:this.__cf.dimencion.inicial, posicion: this.__cf.posicion.apertura}}}

    get estaConstruido(){return this.__v != undefined && this.__r != undefined;}

    removerPadre(){
        if(!this.estaConstruido) return;
        const p = this.padre;
        if(p) p.removeChild(this.__v.ventana);}

    get padre(){if(!this.estaConstruido || !this.__v.ventana.parentNode)
        return this.__cf.padre; this.__cf.padre = this.__v.ventana.parentNode; return this.__cf.padre;}
    set padre(padre){this.asignarPadre(padre);}
    
    asignarPadre(padre){
        if(!padre) return;
        try{
            const p = this.padre;
            if(p === padre) return;
            if(this.estaConstruido){
                if(p){p.removeChild(this.__v.ventana);}
                padre.appendChild(this.__v.ventana);
                this.__agregarContenidoACabecera();
                this.posicion = this.__cf.posicion.apertura;}
            this.__cf.padre = padre;
            this.__cf.padre.style.position = 'relative';
            this.__validarMarco();}
        catch(error){console.error('no es posible asignar el elemento como padre'); return error;}}

    __validarMarco(){
        if(this.MARCO || !this.padre) return;
        if(!this.MARCO) 
            this.MARCO = this.padre.querySelector(`#${this.sys.idMarco}`);

        if(!this.MARCO){
            this.MARCO = document.createElement('div');
            this.MARCO.setAttribute('id',this.sys.idMarco);
            this.padre.insertBefore(this.MARCO, this.padre.firstChild);}}

    set cabecera(str){this.__cf.cabecera.str = str; this.__modificarCabecera();}
    get cabecera(){return this__v?.cabecera;}
    set titulo(str){this.insertarContenidoCabecera(`<span class="${this.sys.class('bloqueado')}">${str}</span>`);}
    set justificadoTitulo(justificado){this.__cf.cabecera.justificado = justificado;}
    get justificadoTitulo(){return this.__cf.cabecera.justificado;}
    get titulo(){return this.__cf.cabecera.str;}

    insertarContenidoCabecera(str,justificado = 'start'){
        if(typeof(str) != 'string' || typeof(justificado) != 'string') return;
        this.__cf.cabecera.str = str;
        this.__cf.cabecera.justificado = justificado;
        this.__agregarContenidoACabecera();}

    limpiarCabecera(){
        if(!this.estaConstruido) return;
        this.__cf.cabecera.str = undefined;
        this.__modificarCabecera(false);}
        
    __agregarContenidoACabecera(){
        if(!this.estaConstruido || !this.__cf.cabecera.str) return;
        this.__v.cabecera.innerHTML = this.__cf.cabecera.str;
        this.__modificarCabecera();}

    __modificarCabecera(condicion = true){
        this.__reAjustarEspacioCabecera(condicion);
        this.__aplicarEstilosCabecera(condicion);}

    justificarCabecera(parametro){
        let condicion = true
        if(typeof(parametro) == 'boolean') condicion = parametro;
        else if(typeof(parametro) == 'string') this.__cf.cabecera.justificado = parametro;
        else return;
        if(!this.estaConstruido) return;
        this.__reAjustarEspacioCabecera(condicion);}

    __reAjustarEspacioCabecera(condicion = true){
        const padding = this.__v.divBotones.offsetWidth > this.__v.ico.offsetWidth ^ this.btnAlaDer?'paddingRight' : 'paddingLeft';
        if(!condicion) {
            this.__cf.cabecera.justificado = '';
            this.__v.cabecera.style.justifyContent = '';
            this.__v.cabecera.style[padding] = '';
            return;}

        const justificado = this.__cf.cabecera.justificado??this.sys.data.justificado;
        
        
        if(!justificado || justificado == '')return;
        if(this.__cf.cabecera.justificado == 'center'){
            const w = Math.abs(this.__v.divBotones.offsetWidth - this.__v.ico.offsetWidth);
            this.__v.cabecera.style[padding] = `${w}px`;}
        this.__v.cabecera.style.justifyContent = justificado;}

    __aplicarEstilosCabecera(condicion = true){
        if(!condicion){
            this.__v.cabecera.style.display = '';
            this.__v.cabecera.style.alignItems = '';
            return;}

        this.__v.cabecera.style.display = 'flex';
        this.__v.cabecera.style.alignItems = 'center';}

    addEventListener(strAccion, funcion){
        if(typeof(strAccion)!='string'|| this.__funciones[strAccion] == undefined
        || typeof(funcion) != 'function' || this.__funciones[strAccion]?.includes(funcion)) return;
        this.__funciones[strAccion].push(funcion);}

    __esquinasRedondeadas(accion){
        if(this.sys.data.radioSup) this.__v.ventana.classList[accion](this.sys.class('radioSup'));
        if(this.sys.data.radio) this.__v.ventana.classList[accion](this.sys.class('radio'));}

/* ███████████████████====================█ posicion y dimencion █=================███████████████████████ */

    __posX(x){
        if(typeof(x) == 'string'){
            switch (x){
                case 'start': case 'left':x = 0; break;
                case 'center': x = (this.dimencionPadre.w - this.ancho)/2; break;
                case 'end': case 'right':x = this.dimencionPadre.w - this.ancho; break;
                default: this.__v.ventana.style.left= x; return;}}

        this.__v.ventana.style.left=`${x}px`;}

    __posY(y){
        if(typeof(y) == 'string'){
            switch (y){
                case 'start': case 'top': y = 0; break;
                case 'center': y = (this.dimencionPadre.h - this.alto)/2; break;
                case 'end': case 'bottom': y = this.dimencionPadre.h - this.alto + .5; break;
                default: this.__v.ventana.style.top= y; return;}}
        this.__v.ventana.style.top=`${y}px`;}

    __reCalcularAncho(w){
        this.__v.ventana.style.width=typeof (w) == 'number'?`${w}px`:w;
        this.__r.sup.style.width =typeof (w) == 'number'?`${w-12}px`:w;
        this.__r.inf.style.width =typeof (w) == 'number'?`${w-12}px`:w;}

    __reCalcularAltura(h){
        this.__v.ventana.style.height=typeof (h) == 'number'?`${h}px`:h;
        this.__r.der.style.height =typeof (h) == 'number'?`${h-12}px`:h;
        this.__r.izq.style.height =typeof (h) == 'number'?`${h-12}px`:h;}

    get dimencion(){ return!this.__v?{w:0,h:0}:{w:this.__v.ventana.offsetWidth,h:this.__v.ventana.offsetHeight};}
    set dimencion(d){if(!this.estaConstruido)return; try{this.__reCalcularAncho(d.w); this.__reCalcularAltura(d.h);}catch{return;}}

    get posicion(){return !this.__v?{x:0,y:0}:{x:this.__v.ventana.offsetLeft,y:this.__v.ventana.offsetTop};}
    set posicion(c){if(!this.estaConstruido)return; try{this.__posX(c.x); this.__posY(c.y);}catch{return;}}

    get alto(){return this.estaConstruido ? this.__v.ventana.offsetHeight:0;}
    set alto(h){if(!this.estaConstruido) return; this.__reCalcularAltura(h);}

    get ancho(){return this.estaConstruido ? this.__v.ventana.offsetWidth:0;}
    set ancho(w){if(!this.estaConstruido) return; this.__reCalcularAncho(w);}

    get x(){return this.__v?.ventana.offsetLeft;}
    set x(num){if(!this.estaConstruido) return; this.__posX(num);}

    get y(){return this.__v?.ventana.offsetTop;}
    set y(num){if(!this.estaConstruido)return; this.__posY(num);}

    get dimencionPadre(){return {w:this.padre?.clientWidth??0,h:this.padre?.clientHeight??0};}
    get posicionPadre(){
        if(!this.padre) return{x:0,y:0}
        const p = this.padre.getBoundingClientRect()
        return {x:p.left,y:p.top};}

    verificarPosicion(){this.__validarPosicion(this);}

/* █████████====================████████████████ acciones ██████████████==================██████████████ */
    #__ejecutarFunciones(llave,condicion){this.__funciones[llave]?.forEach(funcion=>{funcion(condicion)});}

    __interruptorDeControles(llave,factivar = undefined,fdesactivar = undefined,fanimacion = undefined){
        if(this.__estado.cerrar) return;

        this.__v.ventana.classList.add(this.sys.class('animacion'));
        this.__estado[llave] = !this.__estado[llave];

        //if(this.__funciones[llave]) this.__funciones[llave](this.__estado[llave]);
        this.#__ejecutarFunciones(llave != 'media'?`${llave}imizar`:llave ,this.__estado[llave]);
        if(this.__estado[llave]){
            this.__cache[llave].dimencion = this.dimencion;
            this.__cache[llave].posicion = this.posicion;
            if(factivar)factivar();}
        else{
            this.dimencion = this.__cache[llave].dimencion;
            this.posicion = this.__cache[llave].posicion;
            if(fdesactivar) fdesactivar();}

        this.ventana?.addEventListener('transitionend',()=>{
            this.ventana?.classList.remove(this.sys.class('animacion'));
            if(fanimacion) fanimacion(this.__estado[llave]);});}

    minimizar(){
        if(!this.estaAbierto) return;
        this.__v.ventana.classList.remove(this.sys.class('desaparecer'));
        this.__v.divBotones.classList.remove(this.sys.class('bloqueado'));
        const accion =  this.__estado.max?'full':this.__estado.media?'media':undefined;
        this.__interruptorDeControles('min',
            ()=>{
                GestorVany.instancia.oculta();
                this.__v.ventana.classList.remove(...this.sys.class('full','media'));
                this.__v.divBotones.classList.add(this.sys.class('bloqueado'));
                this.posicion = this.pRetorno;
                this.dimencion = {w:0,h:0};},
            ()=>{
                GestorVany.instancia.visible();
                GestorVany.instancia.subirPosicion(this.LLAVE);
                if(accion) this.__v.ventana.classList.add(this.sys.class(accion));},
            (esta_minimizado)=>{
                if(esta_minimizado) this.__v.ventana.classList.add(this.sys.class('desaparecer'))});}

    maximizar(){
        if(!this.estaConstruido) return;
        this.__expandir('max');}

    __reglas(llave){
        const accion ={'add':'remove','remove':'add'}
        for(const reglas in this.__r)
            this.__r[reglas].classList[accion[llave]](...this.sys.class('bloqueado','none'));}

    __expandir(llave,e = undefined,data=undefined){
        if(this.__cf.dimencion.fija) return;
        if(llave == 'media' && this.__estado.mediaPos == 'sup'){
            this.__estado.mediaPos = undefined;
            llave = 'max';}

        const accion = llave == 'max'? 'full':'media';
        this.__interruptorDeControles(llave,
            ()=>{
                this.posicion = {x:0,y:0};
                if(llave == 'media' && this.__estado.mediaPos == 'der') {this.__posX('50%');}

                this.__esquinasRedondeadas('remove');

                if(llave == 'max'){
                    if(this.__estado.media) this.__v.ventana.classList.remove(this.sys.class('media'));
                    this.__reglas('remove');}
                
                this.__v.ventana.classList.add(this.sys.class(accion));},
            ()=>{
                this.__validarPosicion(this.__cache[llave]);
                if(llave == 'max'){
                    if(this.__estado.media) this.__v.ventana.classList.add(this.sys.class('media'));
                    this.__reglas('add')}
                else{
                    this.__estado.mediaPos = undefined;}
                
                this.__esquinasRedondeadas('add');
                this.__v.ventana.classList.remove(this.sys.class(accion));
                if(e){
                    this.__v.ventana.classList.remove(this.sys.class('animacion'));
                    if(!data) return;
                    const media = e.clientX - this.__cache[llave].dimencion.w/1.32;
                    const desborde = this.dimencionPadre.w - this.__cache[llave].dimencion.w;
                    let x = 0;

                    if(this.__cache[llave].dimencion.w < e.clientX){
                        if(this.__cache[llave].dimencion.w < (e.clientX - desborde/1.32)) x = desborde;
                        else x = media;}

                    this.__posX(x); 
                    this.__posY(0);
                    data.origen = this.posicion;}});}


    __validarPosicion(objeto){
        if(!this.estaAbierto || this.estaMaximizado) return;
        const d = this.dimencionPadre;
        if(objeto.posicion.y < 0) this.__posY(0);
        if(objeto.posicion.x <= this.__v.divBotones.offsetWidth - this.dimencion.w ||
            objeto.posicion.x >= d.w - this.__v.divBotones.offsetWidth)
            this.__posX('center');
        if(objeto.posicion.y > d.h - this.__v.barra.offsetHeight){
            this.__posY(this.dimencionPadre.h - this.__v.barra.offsetHeight);}}

    cerrar(){
        if(!this.estaAbierto) return;

        if(!this.estaMinimizado) GestorVany.instancia.oculta();
        
        this.__v.ventana.classList.add(...this.sys.class('animacion','transparente'));
        this.posicion = {x:(this.x + this.ancho)/2,y:(this.y + this.alto)/2};
        this.ventana.classList.remove(...this.sys.class('full','media'));
        this.dimencion = {w:0,h:0};

        this.__v.ventana.addEventListener('transitionend',()=>{
            this.ventana?.classList.remove(this.sys.class('animacion'));
            //if(this.__funciones.cerrar) this.__funciones.cerrar();
            this.#__ejecutarFunciones('cerrar');
            if(this.__cf.eliminar_al_carrar){
                this.eliminar();}
            else{
                if(this.estaMinimizado){
                    this.__estado.min = false;
                    this.dimencion = this.__cache.min.dimencion;
                    this.posicion = this.__cache.min.posicion;}
                this.__v.ventana.classList.add(this.sys.class('none'));
                this.__v.ventana.classList.remove(this.sys.class('transparente'))}
            
            this.__estado.cerrar = true;});}


    media(posicion){
        if(!this.estaAbierto || typeof(posicion) != 'string'||this.__estado.mediaPos == posicion) return;
        this.__estado.mediaPos = posicion;
        this.abrir();
        if(this.__estado.media){
            this.dimencion = this.__cache.media.dimencion;
            this.posicion = this.__cache.media.posicion;}
        this.__expandir('media');}

    eliminarAlCerrar(condicion){this.__cf.eliminar_al_carrar = condicion;}

    abrir(){
        if(this.__estado.cerrar && !this.__cf.eliminar_al_carrar && this.estaConstruido){
            if(this.__funciones.abrir)this.__funciones.abrir(this.__estado.cerrar);
            if(this.__estado.max) this.ventana.classList.add(this.sys.class('full'));
            else if(this.__estado.media) this.ventana.classList.add(this.sys.class('media'));
            else{
                this.posicion = this.__cf.posicion.apertura;
                this.dimencion = this.__cf.dimencion.inicial;}
            this.__v.ventana.classList.remove(this.sys.class('none'));}

        this.__estado.cerrar = false;

        if(this.__estado.min){ this.minimizar(); return;}
        if(this.__estado.max || this.__estado.media) return;
        if(!this.estaConstruido){
            this.__reConstruir();
            this.__cargarMotor();
            
            if(this.__cf.dimencion.fija)
                this.__reglas('remove');
            GestorVany.instancia.subirPosicion(this.LLAVE);
            GestorVany.instancia.visible();}

        this.#__ejecutarFunciones('abrir');}

/* ====================████████████████ construcion y conexiones ██████████████======================= */
    
    __reConstruir(){
        if(!this.sys) return;
        const elementos = this.sys.LISTA_DIV;

        this.__v = {};
        for(let i = 0; i < elementos.length; i++){
            this.__v[elementos[i]] = document.createElement('div');
            
            if(i + 1 < elementos.length && this.sys.div?.[elementos[i]]?.class) {
                this.__v[elementos[i]].classList.add(this.sys.class(elementos[i]));}}
        this.__v.ventana.style.zIndex = '0';

        const reglas = ['sup','inf','der','izq','esqsd','esqsi','esqid','esqii'];
        this.__r = {}
        for(let r of reglas){
            this.__r[r] = document.createElement('div');
            this.__v.ventana.appendChild(this.__r[r]);}

        this.__v.divBotones.classList.add(this.sys.classBtnVisibles(3),this.sys.class('controles'));
        this.__esquinasRedondeadas('add');

        this.sys.LISTA_BOTONES.forEach((btn)=>{
            if(this.btnAlaIzq && btn == 'cerrar')
                this.__v.divBotones.insertBefore(this.__v.cerrar,this.__v.minimizar);
            else this.__v.divBotones.appendChild(this.__v[btn]);
            this.__v[btn].classList.add(...this.sys.class(btn,'botones'));

            if(!this.sys.div[btn]['contenido'] || typeof(this.sys.div[btn]['contenido']) != 'string') return;
            
            const contenido = this.sys.div[btn]['contenido'].trim();
            if(/^-/.test(contenido)){
                const cli = contenido.split(' ');
                if((cli[0] == '-p' || cli[0] == '--p') && cli.length <= 4){
                    let color = '#000'; let w = 24; let h = 24; const version2 = cli[0] == '--p';
                    for(let i = 1; i < cli.length; i++){
                        if(i == 1 && /^#/.test(cli[i])) color = cli[1];
                        if(i == 2 && parseInt(cli[i])) w = h = parseInt(cli[i]);
                        if(i == 3 && parseInt(cli[i])) h = parseInt(cli[i]);}
                    this.__v[btn].innerHTML = this.sys.ICO(btn,w,h,color,version2);
                    return;}}
            this.__v[btn].innerHTML = this.sys.div[btn]['contenido']});

        this.__reacomodar();
        this.__v.ventana.appendChild(this.__v.barra);
        this.__v.ventana.appendChild(this.__v.lienzo);
        this.__v.ventana.classList.add(this.sys.idGlobal,this.sys.class('sombra'));
        this.dimencion = this.__cf.dimencion.fija ? this.__cf.dimencion.fija :this.__cf.dimencion.inicial;

        if(!this.#__conflictoLienzo()){
            if(this.__cf.url) this.__v.lienzo.innerHTML = this.__cf.url;
            if(this.__cf.hijoLienzo) this.__v.lienzo.appendChild(this.__cf.hijoLienzo);}

        const padre = this.__cf.padre;
        this.__cf.padre = undefined;
        this.asignarPadre(padre);}

    get btnAlaIzq(){return this.__cf.posIzq != undefined ? this.__cf.posIzq:(this.sys?.data.posIzq);}
    get btnAlaDer(){return !this.btnAlaIzq;}


    __reacomodar(){
        if (!this.__v.barra.childNodes.length)this.__v.barra.appendChild(this.__v.cabecera);
        else{
            this.__v.barra.removeChild(this.__v.ico);
            this.__v.barra.removeChild(this.__v.divBotones);}
        
        if(this.btnAlaIzq){
            this.__v.barra.insertBefore(this.__v.divBotones, this.__v.cabecera);
            this.__v.barra.appendChild(this.__v.ico);}
        else{
            this.__v.barra.insertBefore(this.__v.ico, this.__v.cabecera);
            this.__v.barra.appendChild(this.__v.divBotones);}}


    __cargarMotor(){
        if(!this.estaConstruido) return;
        const pul = {}; const limite = {}
        const f = e=>{
            pul["padre"] = this.posicionPadre;pul['valido']={x:true, y:true};
            pul['x']=e.clientX;pul["origen"]=this.posicion;
            pul['y']=e.clientY;pul["dimencion"]=this.dimencion;}

        let orden = 0;
         
        document.addEventListener('mouseup',()=>{orden=0;});
        

        const excluciones = this.sys.class('minimizar','maximizar','cerrar');

        this.__v.minimizar.addEventListener('click',()=>this.minimizar());
        this.__v.barra.addEventListener('dblclick',()=>this.maximizar());
        this.__v.maximizar.addEventListener('click',()=>this.maximizar());
        this.__v.cerrar.addEventListener('click',()=>this.cerrar());
        
        this.__v.ventana.addEventListener('click',()=>{GestorVany.instancia.subirPosicion(this.LLAVE)});

        this.__v.barra.addEventListener('mousedown',e=>{
            for(let t of e.target.className.split(' '))
                if(excluciones.includes(t)) return;
            f(e); orden=0x03;});
        this.__r.inf.addEventListener('mousedown',e=>{f(e);orden=0x04;});
        this.__r.sup.addEventListener('mousedown',e=>{f(e);orden=0x05;});
        this.__r.der.addEventListener('mousedown',e=>{f(e);orden=0x08;});
        this.__r.izq.addEventListener('mousedown',e=>{f(e);orden=0x0a;});
        this.__r.esqid.addEventListener('mousedown',e=>{f(e);orden=0x0c;});
        this.__r.esqsd.addEventListener('mousedown',e=>{f(e);orden=0x0d;});
        this.__r.esqii.addEventListener('mousedown',e=>{f(e);orden=0x0e;});
        this.__r.esqsi.addEventListener('mousedown',e=>{f(e);orden=0x0f;});

        document.addEventListener('mousemove',(e)=>{
            if(!orden) return;
            GestorVany.instancia.subirPosicion(this.LLAVE);

            let y = 0x01 & orden ? pul.y - e.clientY : e.clientY - pul.y;
            let x = 0x02 & orden ? pul.x - e.clientX : e.clientX - pul.x;

            if(!(0x0c & orden)){
                if(this.__estado.max) this.__expandir('max',e,pul);
                if(this.__estado.media) this.__expandir('media',e,pul);
                if(!this.__cf.dimencion.fija){
                    this.__mapearLimites(e,pul,limite);
                    this.__ampliadorDeMarco({x:e.clientX, y:e.clientY},limite);}}
            
            else{
                pul.valido.x = pul.dimencion.w+x > this.__cf.dimencion.minima.w;
                pul.valido.y = pul.dimencion.h+y > this.__cf.dimencion.minima.h;

                if(this.__estado.media){
                    this.__cache.media.dimencion = this.dimencion;
                    this.__cache.media.posicion = this.posicion;
                    this.__expandir('media',e);}}

            if(0x01 & orden && pul.valido.y) this.__posY(-y + pul.origen.y);
            if(0x02 & orden && pul.valido.x) this.__posX(-x + pul.origen.x);
            if(0x04 & orden && pul.valido.y) this.__reCalcularAltura(pul.dimencion.h+y)
            if(0x08 & orden && pul.valido.x) this.__reCalcularAncho(pul.dimencion.w+x);});


        document.addEventListener('mouseup',()=>{
            this.__modificaMARCO();
            
            if(!this.__estado.mediaPos || this.__estado.media || this.__estado.mediaPos == 'inf'){
                if(!this.estaMinimizado) this.__validarPosicion(this);
                if(this.__estado.mediaPos == 'inf') this.__estado.mediaPos = undefined;
                return;}

            
            this.__expandir('media');});}


    __mapearLimites(e,pul,limite){
        const pos = {x:e.clientX - pul.padre.x, y:e.clientY - pul.padre.y}
        const d = this.dimencionPadre;
        const px = 2;

        limite['izq'] = pos.x <= px;
        limite['der'] = pos.x >= d.w - px;
        limite['sup'] = pos.y <= px;
        limite['inf'] = pos.y >= d.h - px;}

    __ampliadorDeMarco(pos,limite){
        this.__modificaMARCO()

        if(limite.sup == limite.inf && limite.der == limite.izq) {
            this.__estado.mediaPos = undefined; return;}
        if(limite.inf){ this.__estado.mediaPos = 'inf'; return;}
            
        this.__modificaMARCO(pos.x,pos.y,0,0);

        let validar = limite[this.__estado.mediaPos] = false;
        const d = this.dimencionPadre;
        
        for(const dir in limite){if(limite[dir]) validar = true;}
        
        if(validar) this.MARCO.classList.add(this.sys.class('animacion'));
        else limite[this.__estado.mediaPos] = true;
        
        const margen = 10;

        if(limite.sup) {
            this.__modificaMARCO(margen,margen,d.w- margen*2,d.h- margen*2);
            this.__estado.mediaPos = 'sup';}
        else if(limite.der) {
            this.__modificaMARCO('50%',margen,d.w/2 - margen,d.h - margen*2);
            this.__estado.mediaPos = 'der';}
        else if(limite.izq) {
            this.__modificaMARCO(margen,margen,d.w/2 - margen,d.h - margen*2);
            this.__estado.mediaPos = 'izq'}
        

        this.MARCO.addEventListener('transitionend',()=>{
            this.MARCO.classList.remove(this.sys.class('animacion'));});}


    __modificaMARCO(x = '',y = '',w = '',h = ''){
        this.MARCO.style.top = typeof (y) == 'number'?`${y}px`:y;
        this.MARCO.style.left = typeof (x) == 'number'?`${x}px`:x;
        this.MARCO.style.width = typeof (w) == 'number'?`${w}px`:w;
        this.MARCO.style.height = typeof (h) == 'number'?`${h}px`:h;
        if(x === ''){
            this.MARCO.style.zIndex = '0';
            this.MARCO.classList.add(this.sys.class('transparente'));
            this.MARCO.classList.remove(...this.sys.class('sombra','marco'));}
        else{
            this.MARCO.style.zIndex = `${this.__v.ventana.style.zIndex}`;
            this.MARCO.classList.remove(this.sys.class('transparente'));
            this.MARCO.classList.add(...this.sys.class('sombra','marco'));}}

/****************************████████████████ adicionales ██████████████************************************/     

    get esVisible(){return !this.__estado.min && !this.estaAbierto}
    set ico(str){if(this.estaConstruido){this.__v.ico.innerHTML = str; this.actualizar();}}
    get ico(){return this.__v?.ico;}
    get sistema(){ return this.sys;}
    get lienzo(){return this.__v?.lienzo;}
    get ventana() {return this.__v?.ventana;}
    get estaMinimizado(){return this.__estado.min;}
    get estaMaximizado(){return this.__estado.max;}
    get estaCerrado(){return this.__estado.cerrar;}
    get estaAbierto(){return !this.__estado.cerrar && this.estaConstruido && this.padre;}
    set opacidad(num){
        if(typeof(num) != 'number' || !this.estaConstruido) return;
        this.__v.ventana.style.opacity = num;}

    get classList(){return this.__v.ventana.classList;}

    get opacidad(){this.__v?.ventana.style.opacity;}
    static data = [[0x6568,0x6f6863],0x3a726f70,0x6f6b654e,0x2605,[0x6f6f6853,0x726574]]


    cambiarPuntoDeRetorno(x,y){
        this.__cf.posicion.origen = {x:x,y:y};
        if(this.estaMinimizado) this.posicion = this.__cf.posicion.origen;}
    
    get pRetorno(){return this.__cf.posicion.origen;}
    set pRetorno(pos){this.cambiarPuntoDeRetorno(pos.x,pos.y);}

    cambiarPuntoDeAparicion(x,y){
        this.__cf.posicion.apertura = {x:x,y:y};
        if(!this.estaConstruido) this.__cache.max.posicion = this.__cache.min.posicion = this.__cf.posicion.apertura;}

    get pAparicion(){return this.__cf.posicion.apertura;}
    set pAparicion(pos){this.cambiarPuntoDeAparicion(pos.x,pos.y);}

    cambiarDimencionInicial(w,h){
        this.__cf.dimencion.inicial = {w:w,h:h};
        if(!this.estaConstruido)
            this.__cache.max.dimencion = this.__cache.min.dimencion = this.__cf.dimencion.inicial;}

    cambiarDimencionMinima(w,h){
        this.__cf.dimencion.minima = {w:w,h:h};
        if(this.estaConstruido){
            if(this.ancho > this.__cf.dimencion.minima.w) this.ancho = __cf.dimencion.minima.w;
            if(this.alto > this.__cf.dimencion.minima.h) this.alto = __cf.dimencion.minima.h;}}

    cambiarDimencionFija(w,h){ this.__cf.dimencion.fija = {w:w,h:h};
        if(this.estaConstruido) {
            this.__reglas('remove');
            this.dimencion = __cf.dimencion.fija;}}

    eliminarDimencionFija(){
        this.__cf.dimencion.fija = undefined;
        if(this.estaConstruido) this.__reglas('add');}

    desconectarseDelGestor(){ GestorVany.instancia.remover(this.LLAVE);}

    #__conflictoLienzo(){
        const conflicto = this.__cf.hijoLienzo && this.__cf.url;
        if(conflicto) console.warn('El [Lienzo] solo puede contener una instruccion');
        return conflicto;}

    cargarURL(url){
        if(typeof(url) != 'string') return;
        if(url == ''){ 
            this.__cf.url = undefined;
            if(this.estaAbierto){
                const iframe = this.__v.lienzo.querySelector('iframe');
                this.__v.lienzo.removeChild(iframe);}}
        else{
            this.__cf.url = `<iframe style="width:100%;height:100%;"frameborder="0"src="${url}"allowfullscreen></iframe>`;
            if(this.estaConstruido && !this.#__conflictoLienzo()) this.__v.lienzo.innerHTML = this.__cf.data.url;}}
    
    agregarHijo(objDOM){
        if(!objDOM) return;
        this.__cf.hijoLienzo = objDOM;
        if(this.estaConstruido && !this.#__conflictoLienzo()) this.__v.lienzo.appendChild(objDOM);}

    removerHijo(objDOM){
        if(objDOM !== this.__cf.hijoLienzo) return;
        if(this.estaConstruido) this.__v.lienzo.removeChild(this.__cf.hijoLienzo);
        this.__cf.hijoLienzo = undefined;}
}

/*████████████████████████████████████████████████████████████████████████████████████████████████████████████*/
/*███████████████████████████████████████████████████ GESTOR █████████████████████████████████████████████████*/
/*████████████████████████████████████████████████████████████████████████████████████████████████████████████*/

class GestorVany{
    static #__GESTOR_VANY__;
    #NODO;
    #Epersonalizados;
    #Epredefinidos;
    #ventanas_visibles;

    constructor(){
        this.#ventanas_visibles = 0;
        this.padre = undefined;
        this.sistemaBase = undefined;
        this.elementos = 0;
        this.#NODO = new Map();
        this.#Epersonalizados = [];
        this.#Epredefinidos = [];}

    oculta(){ --this.#ventanas_visibles;}

    visible(){ ++this.#ventanas_visibles;}

    get ventanasVisibles (){ return this.#ventanas_visibles;}

    subirPosicion(llave){
        const vanyV = this.#NODO.get(llave);
        if(!vanyV || !vanyV.estaAbierto) return;

        const zindex = vanyV.ventana.style.zIndex;
         
        if(zindex >= this.#ventanas_visibles) return;

        for(const [llave, nodo] of this.#NODO){
            if(nodo.ventana?.style.zIndex > zindex){
                nodo.ventana.style.zIndex= `${nodo.ventana.style.zIndex - 1}`;}}

        vanyV.ventana.style.zIndex = `${this.#ventanas_visibles}`;}

    remover(llave){ this.#NODO.delete(llave);}
    agregar(llave,objectDOM){
        const vanyV = this.#NODO.get(llave);
        if(vanyV) return;
        this.#NODO.set(llave,objectDOM);}

    conectarseA(padre){
        if(padre) this.padre = padre;
        return this;}

    enlazarCon(objVany){
        if(!objVany) return undefined;
        const llave = 'Vany_'+ ++this.elementos;
        this.#NODO.set(llave,objVany);
        this.subirPosicion(llave);
        return llave;}

    obtenerEstilo(sistema = undefined){
        if(!sistema) return this.sistemaBase;
        const personalizado = this.#__buscarEstiloPersonalizado(sistema);
        if(personalizado) return personalizado;
        return this.#__buscarEstiloPredeterminado(sistema);}

    establecerBase(estilo){
        let cf = undefined;
        if(typeof(estilo) == 'string') cf = this.agregarEstilo(estilo);
        else cf = this.agregarEstilo(estilo);
        if(cf) this.sistemaBase = cf;
        return this;}

    agregarEstilo(estilo){
        let cf = undefined;
        let base = !this.#Epredefinidos.length && !this.#Epersonalizados.length;

        if(typeof(estilo) == 'string'){
            if(!EstiladorVany.predeterminados.includes(estilo)) return undefined;
            if(!this.#__buscarEstiloPredeterminado(estilo)){
                cf = new EstiladorVany(estilo)
                this.#Epredefinidos.push(cf);}}
        else{
            try{
                if(!this.#__buscarEstiloPersonalizado(estilo.data.nombre)){
                    cf = new EstiladorVany(cf)
                    if(!cf.esValido) return undefined;
                    this.#Epersonalizados.push(cf);}
            }catch(error){
                console.error('se a producido un error al asignar el estilo'); return error;}}
        if(base && cf) this.sistemaBase = cf;
        return cf;}

    ventanasForEach(funcion){
        if(typeof(funcion) != 'function') return;
        this.#NODO.forEach(funcion);}

    #__buscarEstiloPredeterminado(nombre){
        if(this.#Epredefinidos.length)
            for(let i = 0; i < this.#Epredefinidos.length; i++)
                if(this.#Epredefinidos[i]?.data?.nombre == nombre) return this.#Epredefinidos[i];
        return undefined;}

    #__buscarEstiloPersonalizado(nombre){
        if(this.#Epersonalizados.length)
            for(let i = 0; i < this.#Epersonalizados.length; i++)
                if(this.#Epersonalizados[i]?.data?.nombre == nombre) return this.#Epersonalizados[i];
        return undefined;}

    
    static get instancia() {
        if(!GestorVany.#__GESTOR_VANY__)
            GestorVany.#__GESTOR_VANY__ = new GestorVany;
        return GestorVany.#__GESTOR_VANY__;}}

/*████████████████████████████████████████████████████████████████████████████████████████████████████████████*/
/*███████████████████████████████████████████████████ ESTILOS ████████████████████████████████████████████████*/
/*████████████████████████████████████████████████████████████████████████████████████████████████████████████*/

class EstiladorVany{
    constructor(nombre_sistema,global = 'VANY_GLOBAL'){
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
                            ,'none','full','media','radioSup','desaparecer','sombra'];
        this.GLOBAL = {id:id,id_marco:id + '_MARCO',class:{}}
        for(const llave of listaClases)
            this.GLOBAL.class[llave] = id + '--' + llave;
        this.cargarEstilosGlobales(true);
        if(this.CONFIGURACION) this.asignarEstilos(this.CONFIGURACION,true);}

    get nombre(){return this.CONFIGURACION?.data?.nombre;}
    get idGlobal(){return this.GLOBAL.id;}
    get idMarco(){return this.GLOBAL.id_marco;}
    get div(){return this.CONFIGURACION;}
    get data(){return this.CONFIGURACION?.data;}
    get esValido(){return this.CONFIGURACION != undefined;}

    class(...args){
        const lista = [];
        args.forEach(elemento =>{
            const g = this.GLOBAL?.class?.[elemento];
            const p = this.CONFIGURACION?.[elemento]?.class;
            if(g || p) lista.push(g??p);});
        
        return !lista.length ?undefined: lista.length == 1?lista[0]:lista;}

    classBtnVisibles(num){
        if(!this.DIMENCION_DIVBTN || num <= 0 || num > 3) return this.GLOBAL.class.none;
        return this.DIMENCION_DIVBTN[num - 1];}

    ICO(boton,w,h,color,v = false){
        switch(boton){
            case 'minimizar': return`<svg class="${this.class('bloqueado')}" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24" width="${w}" height="${h}"><path d="M19 13H5v-2h14v2z" fill="${color}"/></svg>`;
            case 'maximizar': if(v) return`<svg class="${this.class('bloqueado')}" viewBox="0 0 13 13" 
            width="${w/2}" height="${h/2}" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"
            stroke-linejoin="round" stroke-miterlimit="2"><path d="M9.26 12.03L.006 2.73v9.3H9.26zM2.735.012l9.3 9.3v-9.3h-9.3z"
            fill="${color}"></path></svg>`;
            return`<svg class="${this.class('bloqueado')}" xmlns="http://www.w3.org/2000/svg"viewBox="0 0 ${w} ${h}"
            width="${parseInt(.5+w/2)}" height="${parseInt(.5+h/2)}"><rect width="${w}"height="${h}"fill="none"
            stroke="${color}" stroke-width="5"/></svg>`;
            case 'cerrar':return`<svg class="${this.class('bloqueado')}" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 ${24 + w/12} ${24 + h/12}" width="${w}" height="${h}">
            <path d="M19 6.41l-1.41-1.41L12 10.17 6.41 4.59 5 6l6 6-6 6 1.41 1.41L12 13.83l5.59 5.58L19 18l-6-6 6-6z" fill="${color}"/></svg>`;
            default: return undefined;}}

    __validador(id,recargar = false){
        const estilo = document.head.getElementsByTagName('style');
        let style = undefined;

        for(let i = 0; i < estilo.length; i++){
            if(estilo[i].id == id){
                style = estilo[i]; break;}}

        if(!style){
            style = document.createElement('style');
            style.setAttribute('id',id);
            document.head.appendChild(style);}
        else if(!recargar) return undefined;
        return style;}

    cargarEstilosGlobales(sobrescribir = false){
        const estilo = this.__validador(this.idGlobal,sobrescribir);
        if(!estilo) return;
        
        const global = `.${this.idGlobal}`;
        const Div = num => `${global} > div:nth-child(${num})`;
        const divBtn = `${Div(9)} > div`;
        const marco = `#${this.idMarco}`;

        const d = 6; const m = parseInt(d/2 + .5);

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
            for(let i = 1; i < l.length; i++){
                if(l[i] == '-') continue;
                let v = l[i] == 'm' ? m : l[i] == 'd'? d : l[i]
                c.push(`${sty[i-1]}:${v}px;`);}
            return `${c.join('')}}`;}
        

        const u = `${apo(Vany.data)}${global}{position:absolute;display:flex;flex-direction: column; overflow:hidden;}
        ${marco},${Div('-n+8')}{position:absolute;display:inline-block;}${Div(9)} > div{height:100% !important;}
        ${Div(10)},${Div(9)} > div:nth-child(2){flex-grow:1;overflow:hidden;}${Div('n+8')}{width:100%;}
        ${Div('n+5')}:nth-child(-n+8){width:${d}px;height:${d}px;}${Div(9)}{display:flex;}
        ${efc('bloqueado','user-select:none;-webkit-user-select: none;-moz-user-select: none;',`,${marco},${global},${divBtn}`)}
        ${efc('sombra','box-shadow: 0 0 10px rgba(0,0,0,0.3),0 0 .7px 0 rgba(0,0,0);')}
        ${efc('controles','display:grid; grid-template-columns: 1fr 1fr 1fr;place-items:center;')}
        ${efc('controles','height:100%;display:grid; place-content:center;','> div')}
        ${efc('animacion','transition: all .3s ease;')}${efc('none','display:none;')}
        ${efc('radioSup','border-radius:8px 8px 0 0;')}${efc('bloqueado','pointer-events:none;')}
        ${efc('full','width:100% !important;height:100% !important;')}${efc('transparente','opacity:0;')}
        ${efc('media','width:50% !important;height:100% !important;')}${efc('radio','border-radius:8px;')}
        ${efc('desaparecer','visibility:hidden;')}${css(1,'n 0 d - - - m')}${css(2,'n - d 0 - - m')}
        ${css(3,'w m 0 - - m')}${css(4,'w d - - 0 m')}${css(5,'ne 0 0')}${css(6,'se 0 - - 0')}${css(7,'se - 0 0')}
        ${css(8,'ne - - 0 0')}`;
        estilo.appendChild(document.createTextNode(u));}

    static get predeterminados(){return ['windows-claro','windows-oscuro','linux-claro','linux-oscuro','mac-claro','mac-oscuro']}

    asignarEstilosPredeterminados(nombre_del_sistema){
        if(typeof(nombre_del_sistema) != 'string' || 
            !EstiladorVany.predeterminados.includes(nombre_del_sistema)) return;

        const sys = nombre_del_sistema.split('-');
        const sistema = sys[0];
        const modo = sys[1];
        const cf ={
            data:{
                nombre: nombre_del_sistema,
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
                oscuro:['#ccc','#060606','#cccccc44',undefined,'color:#ccc;']},

            linux:{
                claro:['#666','#ebebeb','','#ccc','color:#2c2c2c;','background-color:#888;'],
                oscuro:['#eee','#2c2c2c','background-color:#4e4e4e66;','#4a4a4a','color:#ccc;',undefined]},

            mac:{
                claro:['#f3f5f9','color:#3a4556;'],
                oscuro:['#3a4556','color:#f3f5f9;']}}

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

        const d = (w,h,e)=>{return{w:w,h:h,espacio:e};}

        switch (sistema) {
            case 'windows':
                cf.botones['data'] = d(45,'100%',0);
                css('botones',undefined,`background-color:${color.windows[modo][2]};`);
                css('barra',`height:30px; background-color:${color.windows[modo][1]};${color.windows[modo][4]}`);
                css('cerrar',undefined,`background-color:#eb0707 !important;`,undefined,color.windows[modo][3]);
                css('marco','background-color:#ffffff11; border:.5px solid #ffffff77;');
                break;

            case 'linux':
                cf.botones['data'] = d(20,20,15);
                cf.data.radioSup = true;
                css('botones',`align-self: center;${color.linux[modo][2]} border-radius:50%;`,`background-color:${color.linux[modo][3]};`);
                css('barra',`height:40px; background-color:${color.linux[modo][1]};${color.linux[modo][4]};`);
                css('cerrar',color.linux[modo][5],'background-color:#ea5321 !important;');
                css('marco','background-color:#ea532133; border:.5px solid #ea532144;');
                break;
            default:
                cf.botones['data'] = d(12,12,7);
                cf.data.radio = true;
                cf.data.posIzq = true;
                css('botones','border-radius:50%;',undefined,undefined,':hover > svg path {fill: #000;}')
                css('barra',`height:24px; background-color:${color.mac[modo][0]};${color.mac[modo][1]}padding:0 4px;`);
                css('cerrar','background-color:#fd4848 !important;');
                css('minimizar','background-color:#f8be08 !important;');
                css('maximizar','background-color:#24d164 !important;');
                css('marco','background-color:#ffffff22; border:1px solid #ffffff77; border-radius:30px;');
                break;}
        this.asignarEstilos(cf);}

    asignarEstilos(cf,sobrescribir = false){
        if(!cf || !cf.data?.nombre) return;
        const ventanaEstilos= [];
        const div_botones = [cf.data.nombre + '--uno',cf.data.nombre + '--dos',cf.data.nombre + '--tres'];
        const estilos = this.__validador(cf.data.nombre,sobrescribir);
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
                        ventanaEstilos.push(`.${div_botones[0]}{width:${width + espacio*2}px;}
                        .${div_botones[1]}{width:${width*2 + espacio*3}px;row-gap:${espacio}px;}
                        .${div_botones[2]}{width:${width*3 + espacio*4}px;row-gap:${espacio}px;}`);}
                
                for(const llave of [...this.LISTA_DIV,'marco', 'botones']) {
                    lector(cf[llave]);}}
                estilos.textContent = ventanaEstilos.join('');
                this.CONFIGURACION = cf;}} 
            catch(error){
                this.CONFIGURACION = undefined;
                console.log('hubo un error al asignar el elemento de configuracion'); return error;}
        
        this.DIMENCION_DIVBTN = div_botones;}}