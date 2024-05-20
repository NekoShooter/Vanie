import CompiladorCssVanie from "./CompiladorCssVanie.js";
import { VanieAdmin , globalVanie} from "./GlobalVanie.js";
import { Desplazo, Dimension , Punto ,escala} from "nauty";
/**
 * Clase que crea ventanas arrastrables para su uso en Front-end [saber mas...](https://github.com/NekoShooter/Vanie)
 */
export default class Vanie {
    #dimension ={inicial:new Dimension(720,480),minima:new Dimension(200,200),fija:undefined};
    #posicion = {apertura:new Punto,retorno:new Punto};
    #cabecera = {str:undefined,justificado:undefined,nodo:undefined,nodos:[],ico:{str:undefined,nodo:undefined,nodos:[]},titulo:{str:undefined,span:undefined}};
    #lienzo = {nodos:[],iframe:undefined,dimension:undefined,fija:false,str:undefined,nodo:undefined};
    #classList = {};#id = {};#padre = globalVanie.padre;
    #opciones = {eliminar_alcerrar: true, btnAlaIzq:undefined, redimensionar: true}
    #funciones = {minimizar:[],maximizar:[],media:[],cerrar:[],abrir:[]};
    #registro = {fnUp:undefined,fnMov:undefined}; #desplazo = new Desplazo;
    #animacionActiva = {minimizar:false,cerrar:false,abrir:false}
    #estado = {min:false,max:false,cerrar:true,media:false,mediaPos:undefined};
    #llave; #marco; #cache; #css; #v; #r; #animar_apertura = true; #estilo_pre; #identificador;
    #map = {archivado:false,data:0,tmp:0};#transformacion = {mov:0,dim:0}

/**
 * @constructor _`Opcional`_ encaso de usar **globalVanie** para asignar el estilo  
 * Inicia el objeto `Vanie`
 * + **String** El nombre del estilo almacenado en el sistema global.
 * + **object** El objeto con las características de estilo para ser asignadas.
 * + **CompiladorCssVanie** El complilador de estilos
 * @param {string|{}|CompiladorCssVanie|undefined} estilo 
 * + **String** El nombre de los estilos almacenados o predeterminados: 
 * > [ `windows-claro` , `windows-oscuro` , `mac-claro` , `mac-oscuro` , `linux-claro` , `linux-oscuro` ]
 * + **object** El objeto con las características de estilo para ser asignadas.
 * + **CompiladorCssVanie** El complilador de estilos de algun objeto Vanie: *`instanciaVanie.compiladorCss`*
 */

    constructor(estilo,identificador){
        this.identificador = identificador;
        this.#posicion.apertura.bNuevo('center','center');
        this.abrir = this.abrir.bind(this);
        this.minimizar = this.minimizar.bind(this);
        this.maximizar = this.maximizar.bind(this);
        this.cerrar = this.cerrar.bind(this);
        this.subir = this.subir.bind(this);
        this.animarApertura = this.animarApertura.bind(this);
        this.eliminarAlCerrar = this.eliminarAlCerrar.bind(this);
        this.eliminar = this.eliminar.bind(this);
        this.removerPadre = this.removerPadre.bind(this);
        this.limpiarCabecera = this.limpiarCabecera.bind(this);
        this.verificarPosicion = this.verificarPosicion.bind(this);
        this.eliminarDimensionFija = this.eliminarDimensionFija.bind(this);
        this.desconectarseDelGestor = this.desconectarseDelGestor.bind(this);
        this.eliminar();
        this.#funciones = {minimizar:[],maximizar:[],media:[],cerrar:[],abrir:[]};
        this.#marco = undefined;
        this.#css = globalVanie.agregarEstilo(estilo);
        if(!this.#css) this.#css = globalVanie.obtenerEstilo(estilo);
        this.#estilo_pre = this.#css && estilo;
        this.#llave = VanieAdmin.registrarNuevaVentana(this);
        VanieAdmin.activarRegistro(this.#llave,this);}
/**
 * Elimina la ventana creada, pero no las características almacenadas.
 */
    eliminar(){
        if(this.estaConstruido && !this.#estado.cerrar && !this.#animar_apertura && this.esVisible && this.#llave) 
            VanieAdmin.oculta(this);
        this.removerPadre();
        this.#estado = {min:false,max:false,cerrar:true,media:false,mediaPos:undefined};
        this.#v = undefined;
        this.#r = undefined;
        this.#cache={max:{dimension:this.#dimension.inicial, posicion: this.#posicion.apertura},
                    media:{dimension:this.#dimension.inicial, posicion: this.#posicion.apertura},
                    origen:{dimension:undefined,posicion:undefined}}}

//#region padre
/**
 * Se desconecta del elemento **HTMLElement** padre.
 */
    removerPadre(){
        if(!this.estaConstruido) return;
        const p = this.padre;
        if(p) p.removeChild(this.#v.ventana);}
/**
 * Retorna la referencia del objeto **HTMLElement** padre o **undefined** en caso de no existir.
 * @returns {HTMLElement|undefined}
 */
    get padre(){
        if(!this.estaConstruido || !this.#v?.ventana.parentNode) return this.#padre; 
        this.#padre = this.#v.ventana.parentNode; return this.#padre;}
/**
 * Asigna o remplaza un objeto **HTMLElement** como padre.
 * @param {HTMLElement} padre Contenedor principal del objeto **Vanie**.
 */
    set padre(padre){this.asignarPadre(padre);}

/**
 * Asigna o remplaza un objeto **HTMLElement** como padre.
 * @param {HTMLElement} padre Elemento del DOM que se convertirá en el contenedor principal para el objeto **Vanie**.
 */
    asignarPadre(padre){
        if(!(padre instanceof HTMLElement)) return;
        try{
            const p = this.padre;
            if(p === padre) return;
            if(this.estaConstruido){
                if(p){p.removeChild(this.#v.ventana);}
                padre.appendChild(this.#v.ventana);
                this.posicion = this.#posicion.apertura;}
            this.#padre = padre;
            this.#padre.style.position = 'relative';
            this.#validarMarco();
            this.#cabeceraAplicarMod();}
        catch(error){console.error('no es posible asignar el elemento como padre'); return error;}}

    #validarMarco(){
        if(this.#marco || !this.padre) return;
        if(!this.#marco ) 
            this.#marco = this.padre.querySelector(`#${this.#css?.idMarco}`);

        if(!this.#marco ){
            this.#marco = document.createElement('div');
            this.#marco.setAttribute('id',this.#css?.idMarco);
            this.padre.insertBefore(this.#marco,this.padre.firstChild);
            this.#marco.addEventListener('transitionend',()=>{
                this.#marco.classList.remove(`${globalVanie.idGlobal}--animacion`);});}}
//#region cebecera
/**
 * Asigna o modifica el contenido interno del `div` perteneciente a la cabecera del objeto **Vanie**.
 * @param {string|HTMLElement|HTMLElement[]} inner El contenido que tendrá el `div` asignado a la cabecera del objeto **Vanie**.
 * + `string` : Incorpora el contenido del string en el innerHTML del div de la cabecera. ⚠ Su grado de prioridad es máximo, por lo que cualquier modificación a objetos relacionados con la cabecera puede no aplicarse.
 * + `HTMLElement` : Incorpora el objeto HTMLElement como un nodo hijo a la cabecera.
 * + `Array HTMLElement` : Incorpora cada objeto HTMLElement del Array como un nodo hijo a la cabecera.
 */
    set cabecera(inner){
        const ok = this.#innerhtml(this.#v?.cabecera,inner,this.#cabecera,()=>{this.#cabecera.titulo.span = this.#cabecera.titulo.str = undefined;});
        this.#cabeceraAplicarMod(ok);}
/**
 * Retorna la referencia del objeto **HTMLElement** perteneciente a la cabecera de la ventana o **undefined** en caso de no existir.
 * @returns {HTMLElement|undefined}
 */
    get cabecera(){return this.#v?.cabecera;}
/**
 * Asignará un título a la cabecera del objeto **Vanie**.
 * @param {string} str El título que se establecerá en la cabecera del objeto **Vanie**, si se deja vacío `''` este se eliminará.
 */
    set titulo(str){
        if(typeof str != 'string' || this.#cabecera.str || !this.#css) return;
        const TITULO = str.trim();
        if(!this.#cabecera.titulo.span && TITULO != ''){
            const span = document.createElement('span');
            span.style.overflow = 'hidden';
            span.style.whiteSpace = 'nowrap';
            span.style.textOverflow = 'ellipsis';
            span.classList.add(...this.#css.class('bloqueado','titulo'));
            span.innerText = TITULO;
            this.#cabecera.titulo.span = span;
            if(this.estaConstruido){
                if(this.#cabecera.nodo || this.#cabecera.nodos.length) this.#v.cabecera.insertBefore(this.#cabecera.titulo.span,this.#v.cabecera.firstChild);
                else this.#v.cabecera.appendChild(this.#cabecera.titulo.span);}}
        else if(TITULO == '') {
            if(this.estaConstruido) this.#v.cabecera.removeChild(this.#cabecera.titulo.span);
            this.#cabecera.titulo.span = this.#cabecera.titulo.str =undefined;}
        else{
        this.#cabecera.titulo.str = 
        this.#cabecera.titulo.span.innerText = TITULO;}
    }
/**
 * Modifica el justificado del `div` de la cabecera del objeto **Vanie**.
 * @param {string} str El justificado `center` | `end` | `start`
 */
    set justificarCabecera(str){ 
        if(typeof str != 'string') return;
        const justificado = str.trim();
        this.#cabecera.justificado = justificado; this.#cabeceraAplicarMod();}
/**
 * Retorna el `string` del justificado del `div` perteneciente a la cabecera del objeto **Vanie**.
 * @returns {string}
 */
    get justificarCabecera(){return this.#cabecera.justificado??'';}
/**
 * Retorna el `string` del título.
 * @returns {string}
 */
    get titulo(){return this.#cabecera.titulo.str??'';}
/**
 * Elimina el contenido del `div` asignado a la cabecera para dejarlo completamente limpio.
 */
    limpiarCabecera(){
        if(!this.estaConstruido) return;
        this.#cabecera.str = undefined;
        this.#cabeceraAplicarMod(false);
        while (this.#v.cabecera.firstChild) {
            this.#v.cabecera.removeChild(this.#v.cabecera.firstChild);}}

    #cabeceraAplicarMod(condicion = true){
        if(!this.estaConstruido) return;
        this.#cabeceraAjustarEspacio(condicion);
        this.#cabeceraAplicarEstilo(condicion);}

    #cabeceraAjustarEspacio(condicion = true){
        const padding = this.#v.divBotones.offsetWidth > this.#v.ico.offsetWidth ^ this.btnAlaDer?'paddingRight' : 'paddingLeft';
        if(!condicion) {
            this.#cabecera.justificado = '';
            this.#v.cabecera.style.justifyContent = '';
            this.#v.cabecera.style[padding] = '';
            return;}

        const justificado = this.#cabecera.justificado??this.#css.data.justificado;
        
        if(!justificado || justificado == '')return;
        if(this.#cabecera.justificado == 'center'){
            const w = Math.abs(this.#v.divBotones.offsetWidth - this.#v.ico.offsetWidth);
            this.#v.cabecera.style[padding] = `${w}px`;}
        this.#v.cabecera.style.justifyContent = justificado;}

    #cabeceraAplicarEstilo(condicion = true){
        if(!condicion){
            this.#v.cabecera.style.display = '';
            this.#v.cabecera.style.alignItems = '';
            return;}

        this.#v.cabecera.style.display = 'flex';
        this.#v.cabecera.style.alignItems = 'center';}

// #region posicion
    #xStr(x){
        switch (x){
            case 'start': case 'left':return 0;
            case 'center': return (this.dimensionPadre.w - this.ancho)/2; 
            case 'end': case 'right': return this.dimensionPadre.w - this.ancho;
            default: return x;}}

    #yStr(y){
        switch (y){
            case 'start': case 'top': return 0;
            case 'center': return (this.dimensionPadre.h - this.alto)/2;
            case 'end': case 'bottom': return Math.abs(this.dimensionPadre.h - this.alto + .5);
            default: return y;}}

    #posX(x){
        if(typeof(x) == 'string'){
            const cx = this.#xStr(x);
            if(cx == x) {this.#v.ventana.style.left= x;return;}
            x = cx;}
        this.#v.ventana.style.left=`${x}px`;}

    #posY(y){
        if(typeof(y) == 'string'){
            const cy = this.#yStr(y);
            if(cy == y) {this.#v.ventana.style.top= y;return;}
            y = cy;}
        this.#v.ventana.style.top=`${y}px`;}
/**
 * 
 * @returns {Punto}
 */
    get posicion(){return new Punto(this.#v?.ventana);}
/**
 * Modifica la posicion actual del objeto **Vanie**.
 * @param {Punto|{x:number|string y:number|string}} p Objeto `Punto` o `{x,y}`
 * @property {number|string} p.x - Posición en x: `number` | `'right'` | `'end'` | `'left'` | `'start'` | `'center'`.
 * @property {number|string} p.y - Posición en y: `number` | `'top'` | `'end'` | `'bottom'` | `'start'` | `'center'`.
 */
    set posicion(p){if(!this.estaConstruido)return; try{this.#posX(p.x); this.#posY(p.y);}catch{return;}}
/**
 * Retorna la posición en el eje **`x`** del objeto **Vanie**.
 * @returns {number}
 */
    get x(){return this.#v?.ventana.offsetLeft??0;}
/**
 * Modifica la posición en el eje **`x`**
 * @param {number} num Posición en x: `number` | `'right'` | `'end'` | `'left ` | `'start'` | `'center'`.
 */
    set x(num){if(!this.estaConstruido) return; this.#posX(num);}
/**
 * Retorna la posición en el eje **`y`** del objeto **Vanie**.
 * @returns {number}
 */
    get y(){return this.#v?.ventana.offsetTop??0;}
/**
 * Modifica la posición en el eje **`y`**
 * @param {number} num Posición en y: `number` | `'top'` | `'end'` | `'bottom'` | `'start'` | `'center'`.
 */
    set y(num){if(!this.estaConstruido)return; this.#posY(num);}
/**
 * Retorna un objeto `Punto` con la posición global del contenedor padre de la instancia **Vanie**.
 * @returns {Punto}
 */
    get posicionPadre(){ return new Punto(this.padre,true);}
/**
 * En caso de que el objeto **Vanie** salga de pantalla, rectifica su posición para que este se mantenga al alcance del usuario.
 */
    verificarPosicion(){this.#validarPosicion(this);}

    #validarPosicion(objeto){
        if(!this.estaAbierto || this.estaMaximizado) return;
        const d = this.dimensionPadre;
        if(objeto.posicion.y < 0) this.#posY(0);

        const altura = this.#alturaBarra();
        const limiteIzq = (this.#v.divBotones.offsetWidth + (this.btnAlaIzq?-altura:altura))-this.ancho;
        const limiteDer = d.w - (this.btnAlaDer?altura:this.#v.divBotones.offsetWidth+altura);

        if(objeto.posicion.x <= limiteIzq) this.#posX(limiteIzq);
        if(objeto.posicion.x >= limiteDer) this.#posX(limiteDer);

        if(objeto.posicion.y > d.h - this.#v.barra.offsetHeight){
            this.#posY(d.h - this.#v.barra.offsetHeight);}}
/**
 * Modifica la posición de retorno para la acción `minimizar` del objeto **Vanie**.
 * @param {number} x Posición en x: `number` | `'right'` | `'end'` | `'left ` | `'start'` | `'center'`.
 * @param {number} y Posición en y: `number` | `'top'` | `'end'` | `'bottom'` | `'start'` | `'center'`.
 */
    cambiarPuntoDeRetorno(x,y){
        this.#posicion.retorno.bNuevo(typeof x == 'string'? this.#xStr(x):x,typeof y == 'string'? this.#yStr(y):y);
        if(this.estaMinimizado) this.posicion = this.#posicion.retorno;}
/**
 * Retorna la referencia del objeto `Punto` con la posición de retorno de la acción `minimizar` del objeto **Vanie**.
 * @returns {Punto}
 */   
    get pRetorno(){return this.#posicion.retorno;}
/**
 * Remplaza la posición de retorno para la acción `minimizar` del objeto **Vanie**.
 * @param {Punto|{x:number|string y:number|string}} pos Objeto `Punto` o `{x,y}`
 * @property {number|string} pos.x - Posición en x: `number` | `'right'` | `'end'` | `'left ` | `'start'` | `'center'`.
 * @property {number|string} pos.y - Posición en y: `number` | `'top'` | `'end'` | `'bottom'` | `'start'` | `'center'`.
 */
    set pRetorno(pos){if(pos) this.cambiarPuntoDeRetorno(pos.x,pos.y);}
/**
 * Modifica la posición de apertura para la acción `abrir` del objeto **Vanie**.
 * @param {number} x Posición en x: `number` | `'right'` | `'end'` | `'left ` | `'start'` | `'center'`.
 * @param {number} y Posición en y: `number` | `'top'` | `'end'` | `'bottom'` | `'start'` | `'center'`.
 */
    cambiarPuntoDeApertura(x,y){
        this.#posicion.apertura.bNuevo(x,y);
        if(!this.estaConstruido) this.#cache.max.posicion = this.#posicion.apertura.copia; }
/**
 * Retorna la referencia del objeto `Punto` con la posición de apertura de la acción `abrir` del objeto **Vanie**.
 * @returns {Punto}
 */ 
    get pApertura(){return this.#posicion.apertura;}
/**
 * Remplaza la posición de apertura para la acción `abrir` del objeto **Vanie**.
 * @param {Punto|{x:number|string y:number|string}} pos Objeto `Punto` o `{x,y}`
 * @property {number|string} pos.x - Posición en x: `number` | `'right'` | `'end'` | `'left ` | `'start'` | `'center'`.
 * @property {number|string} pos.y - Posición en y: `number` | `'top'` | `'end'` | `'bottom'` | `'start'` | `'center'`.
 */
    set pApertura(pos){if(pos)this.cambiarPuntoDeApertura(pos.x,pos.y);}
/**
 * Desplaza el objeto **Vanie** en el eje XY.
 * @param {number} dx Desplazo en el eje X.
 * @param {number} dy Desplazo en el eje Y.
 */
    desplazar(dx,dy){
        this.#desplazo.bNuevo(dx,dy);
        this.#v.ventana.style.transform = `translate(${dx}px,${dy}px)`;}
/**
 * Retorna el objeto `Desplazo` usado para mover el elemento **Vanie** en los ejes XY.
 * @returns {Desplazo}
 */
    get desplazo(){return this.#desplazo;}
    
//#region dimension
    #reCalcularAncho(w){
        this.#v.ventana.style.width=typeof (w) == 'number'?`${w}px`:w;}

    #reCalcularAltura(h){
        this.#v.ventana.style.height=typeof (h) == 'number'?`${h}px`:h;}
/**
 * Retorna un objeto `Dimension` que contiene la dimensión del objeto **Vanie**.
 * @returns {Dimension}
 */
    get dimension(){ return new Dimension(this.#v?.ventana);}
/**
 * Modifica la dimensión actual del objeto **Vanie**.
 * @param {Dimension|{w:number h:number}} d Objeto `Dimension` o `{w,h}`
 * @property {number|string} d.w - Ancho: `number` | `string` el porcentaje en relación con el ancho del contenedor padre.
 * @property {number|string} d.h - Alto: `number` | `string` el porcentaje en relación con el alto del contenedor padre.
 */
    set dimension(d){if(!this.estaConstruido)return; try{this.#reCalcularAncho(d.w); this.#reCalcularAltura(d.h);}catch{return;}}
/**
 * Retorna la altura del objeto **Vanie**
 * @returns {number}
 */
    get alto(){return this.estaConstruido ? this.#v.ventana.offsetHeight:0;}
/**
 * Modifica la altura actual del objeto **Vanie**
 * @param {number|string} h Alto: `number` | `string` el porcentaje en relación con el alto del contenedor padre. 
 */
    set alto(h){if(!this.estaConstruido) return; this.#reCalcularAltura(h);}
/**
 * Retorna el ancho del objeto **Vanie**
 * @returns {number}
 */
    get ancho(){return this.estaConstruido ? this.#v.ventana.offsetWidth:0;}
/**
 * Modifica el ancho actual del objeto **Vanie**
 * @param {number|string} w Ancho: `number` | `string` el porcentaje en relación con el ancho del contenedor padre. 
 */
    set ancho(w){if(!this.estaConstruido) return; this.#reCalcularAncho(w);}
/**
 * Retorna la dimensión del objeto contendor de la instancia **Vanie**.
 * @returns {Dimension}
 */
    get dimensionPadre(){return new Dimension(this.padre);}

/**
 * Modifica la dimensión del objeto **Vanie** con la que aparecerá al momento de ejecutar la acción `abrir`.
 * @param {number|string} w Ancho: `number` | `string` el porcentaje en relación con el ancho del contenedor padre.
 * @param {number|string} h Alto: `number` | `string` el porcentaje en relación con el alto del contenedor padre.
 */
    cambiarDimensionInicial(w,h){
        this.#dimension.inicial.bNuevo(w,h);
        if(!this.estaConstruido)this.#cache.max.dimencion = this.#dimension.inicial.copia;}

    get dApertura(){return this.#dimension.inicial;}

/**
 * Modifica la dimensión del objeto **Vanie** con la que aparecerá al momento de ejecutar la acción `abrir`.
 * @param {Dimension|{w:number h:number}} dim
 * @property {number|string} dim.w Ancho: `number` | `string` el porcentaje en relación con el ancho del contenedor padre.
 * @property {number|string} dim.h Alto: `number` | `string` el porcentaje en relación con el alto del contenedor padre.
 */
    set dApertura(dim){if(dim)this.cambiarDimensionInicial(dim.w,dim.h);}
/**
 * Modifica la dimensión minima que tendra objeto **Vanie**.
 * @param {number} w Ancho
 * @param {number} h Alto
 */
    cambiarDimensionMinima(w,h){
        this.#dimension.minima.nuevo(w,h);
        if(this.estaConstruido){
            this.#v.ventana.style.minWidth = `${w}px`;
            this.#v.ventana.style.minHeight = `${h}px`;
            if(this.ancho > this.#dimension.minima.w) this.ancho = this.#dimension.minima.w;
            if(this.alto > this.#dimension.minima.h) this.alto = this.#dimension.minima.h;}}
/**
 * Retorna la referencia del objeto `Dimension` con la dimensión mínima de la instancia **Vanie**.
 * @returns {Dimension}
 */
    get dMinima(){return this.#dimension.minima;}
/**
 * Modifica la dimensión minima que tendra objeto **Vanie**.
 * @param {Dimension|{w:number h:number}} dim
 * @property {number} dim.w Ancho
 * @property {number} dim.h Alto
 */
    set dMinima(dim){if(dim)this.cambiarDimensionMinima(dim.w,dim.h);}
/**
 * Modifica la dimensión del lienzo del objeto **Vanie** sin contar con la altura de la cabecera. 
 * > ⚠ esta función tiene un estatus de **MAXIMA** prioridad con respecto a otras funciones de cambio de dimensión.
 * @param {number} w Ancho
 * @param {number} h Alto
 * @param {boolean} [fijar=false] Por defecto es `false`, pero si se cambia a `true` fijará la dimensión haciéndola inmutable.
 */
    cambiarDimensionDelLienzo(w,h,fijar = false){
        const dimension = new Dimension(w,h);
        if(!dimension.esValido) return;
        this.#lienzo.dimension = dimension;
        if(this.estaConstruido){
            const alto_barra = this.#alturaBarra();
            if(fijar) this.cambiarDimensionFija(dimension.w,dimension.h + alto_barra)
            else this.dimension = {w:dimension.w,h:dimension.h + alto_barra};}
        this.#lienzo.fija = fijar;}
/**
 * Retorna un objeto `Dimension` con la dimensión del lienzo.
 * @returns {Dimension}
 */
    get dLienzo(){
        if(this.estaConstruido) return new Dimension(this.#v.lienzo);
        return this.#lienzo.dimension;}
/**
 * Modifica la dimensión del lienzo que tendra objeto **Vanie**.
 * @param {Dimension|{w:number h:number}} dim
 * @property {number} dim.w Ancho
 * @property {number} dim.h Alto
 */
    set dLienzo(dim){if(dim)this.cambiarDimensionDelLienzo(dim.w,dim.h,this.#lienzo.fija);}
/**
 * Puede usar o no la dimensión de lienzo como una dimensión inmutable del objeto **Vanie**. 
 * > ⚠ esta función tiene un estatus de **MAXIMA** prioridad con respecto a otras funciones de cambio de dimensión.
 * @param {boolean} condicion Si es **`false`** eliminará la inmutabilidad de la dimensión, pero si es **`true`** fijará la dimensión haciéndola inmutable.
 */
    fijarDimensionDelLienzo(condicion){
        if(this.estaConstruido && condicion){
            const nuevaDimension = new Dimension(this.#v.lienzo);
            this.cambiarDimensionDelLienzo(...nuevaDimension.data, true);}
        else if(this.estaConstruido && !condicion){
            this.#lienzo.dimension = undefined;
            if(this.#lienzo.fija) this.eliminarDimensionFija();
            this.#lienzo.fija = false;}
        else this.#lienzo.fija = !!condicion;}
/**
 * Modifica la dimensión del objeto **Vanie** haciendola inmutable.
 * > ⚙ esta función tiene un estatus de prioridad alta con respecto a otras funciones de cambio de dimensión
* @param {number} w Ancho: `number`.
 * @param {number} h Alto: `number`.
 */
    cambiarDimensionFija(w,h){
        const dimension = new Dimension(w,h)
        if(this.#lienzo.fija || !dimension.esValido) return;
        this.#dimension.fija = dimension;
        if(this.estaConstruido) {
            this.#reglas('remove');
            this.dimension = this.#dimension.fija;}}
/**
 * Retorna un objeto `Dimension` con la dimensión fija de la instancia **Vanie**.
 * @returns {Dimension}
 */
    get dFija(){return this.dimension = this.#dimension.fija;}
/**
 * Remplaza la dimensión del objeto **Vanie** haciendola inmutable.
 * > ⚙ esta función tiene un estatus de prioridad alta con respecto a otras funciones de cambio de dimensión
 * @param {Dimension|{w:number h:number}} dim
 * @property {number} dim.w Ancho
 * @property {number} dim.h Alto
 */
    set dFija(dim){if(dim)this.cambiarDimensionFija(dim.w,dim.h);}
/**
 * Elimina la inmutabilidad del objeto **Vanie**
 */
    eliminarDimensionFija(){
        this.#dimension.fija = undefined;
        if(this.estaConstruido) this.#reglas('add');}

    #recompilarDimension(css_anterior){
        if(this.#dimension.fija && !this.#lienzo.fija) return;

        const altura = this.#alturaBarra();
        if(this.#lienzo.dimension){
            const [w,h] = this.#lienzo.dimension.data;
            if(this.#lienzo.fija){
                if(!this.#dimension.fija) this.#dimension.fija = new Dimension;
                this.#dimension.fija.bNuevo(w,h + altura);
                this.dimension = this.#dimension.fija ? this.#dimension.fija :this.#dimension.inicial;}
            else this.#dimension.inicial.bNuevo(w,h + altura);}

        if(css_anterior && this.estaConstruido && this.#v.lienzo && !(this.estaDividido||this.estaMaximizado)){
            const nuevaDimension = new Dimension(this.#v.lienzo);
            nuevaDimension.h += altura;
            this.dimension = nuevaDimension;}

        else if(css_anterior && this.estaConstruido){
            const altura_anterior = css_anterior.CONFIGURACION.data.alturaBarra;
            if(this.estaMaximizado){
                const maxNueva = this.#cache.max.dimension;
                maxNueva.h = (maxNueva.h - altura_anterior) + altura;
                this.#cache.max.dimension = maxNueva;}
            if(this.estaDividido){
                const mitadNueva = this.#cache.media.dimension;
                mitadNueva.h = (mitadNueva.h - altura_anterior) + altura;
                this.#cache.media.dimension = mitadNueva;}}}

    #alturaBarra(){
        let altura = this.#css.CONFIGURACION.data.alturaBarra;
        if(typeof altura != 'number') altura = this.#v?.barra.offsetHeight;
        return altura;}

//#region colision
    #ejecutarFunciones(llave,condicion){this.#funciones[llave]?.forEach(funcion=>{funcion(condicion)});}

    #eventoColision(x,y,xm,ym,limite){
        this.#map.data = VanieAdmin.intColision(xm>=limite.der,x<=limite.izq,y<=limite.sup,ym>=limite.inf);
        const exclusion = limite.ref | this.#map.tmp;
        const data = limite.ref | this.#map.data;

        if( this.#map.data != this.#map.tmp){
            this.#map.archivado = true;
            VanieAdmin.registrarColision(this.#llave,this.#map.data);}

        else if(!this.#map.data && this.#map.archivado){
            this.#map.archivado = false;
            VanieAdmin.eliminarRegistroColision(this.#llave);}

        if(data != exclusion){ VanieAdmin.validarColision(!!(data&1),!!(data&2),!!(data&4),!!(data&8));}

        this.#map.tmp = this.#map.data;}

    #verificarColision(x,y,xm,ym){
        const limite = VanieAdmin.limites(this.dimensionPadre,this.#llave);
        if(!limite) return;
        this.#eventoColision(x,y,xm,ym,limite);}

    #desaparecerColision(condicion = false){
        if(!this.#llave || !VanieAdmin.objLimites) return;
        if(condicion){
            if(!this.#map.archivado) return;

            const colision = VanieAdmin.colisiones(this.#llave);
            
            if((colision | this.#map.data) != colision){ 
                VanieAdmin.validarColision(!!(colision&1),!!(colision&2),!!(colision&4),!!(colision&8));}
                
            VanieAdmin.eliminarRegistroColision(this.#llave);
            this.#map.archivado = false;
            this.#map.tmp = this.#map.data = undefined;}
        else{
            this.#verificarColision(this.x,this.y,this.ancho + this.x,this.alto+this.y);}}

//#region minimizar
/**
 * Ejecuta la acción de minimizado si se encuentra visible y en caso de que este esté minimizado lo des-minimiza.
 */
    minimizar(){
        if(!this.estaAbierto) return;
        this.#v.divBotones.classList.remove(this.#css.class('bloqueado'));
        this.#animacionActiva.minimizar = true;
        this.#estado.min = !this.#estado.min;
        if(this.#estado.min){
            const [w,h] = this.dimension.data;
            const [x,y] = this.posicion.data;
            if(this.#llave) {
                VanieAdmin.oculta(this);
                this.#v.ventana.style.zIndex = VanieAdmin.ventanasVisibles +1;}
            const matrix = escala(.1,.1).desplazar(this.pRetorno.x - x - w/2,this.pRetorno.y-y-h/2);
            setTimeout(() => {
                this.#v.ventana.classList.add(this.#css.class('animacion'));
                this.#v.ventana.style.transform = matrix.str;
            },80);}
        else {
            if(this.#llave){
                VanieAdmin.visible(this);
                VanieAdmin.subirPosicion(this.#llave);}
            this.#v.ventana.classList.add(this.#css.class('animacion'));
            this.#v.ventana.classList.remove(this.#css.class('desaparecer'));
            this.#v.ventana.style.transform = 'matrix(1,0,0,1,0,0)';}}

//#region maximizar
/**
 * Si el objeto **Vanie** está visible en pantalla, lo maximiza al 100%. Si este ya se encuentra maximizado, lo devuelve a su tamaño original.
 */
    maximizar(){
        if(!this.esVisible) return;
        this.#expandir('max');
        if(!this.estaMaximizado && this.#estado.mediaPos && this.#cache.origen.posicion){
            this.#ejecutarFunciones('media',{lado: this.#estado.mediaPos, estado: this.#estado.media});
            this.#posX({der:'50%',izq:0}[this.#estado.mediaPos]);
            this.#posY(0);}
        else if(this.#estado.mediaPos && this.#cache.origen.posicion){
            this.#estado.media = false;
            this.#ejecutarFunciones('media',{lado: this.#estado.mediaPos, estado: this.#estado.media});}}

    #reglas(llave){
        if(!this.#opciones.redimensionar) return;
        const accion ={'add':'remove','remove':'add'}
        for(const reglas in this.#r)
            this.#r[reglas].div.classList[accion[llave]](...this.#css.class('bloqueado','none'));}

    #expandir(llave,e = undefined,data=undefined){
        if(this.#dimension.fija || this.#estado.cerrar) return;

        if(llave == 'media' && this.#estado.mediaPos == 'sup'){
            this.#estado.mediaPos = undefined;
            llave = 'max';}

        if(data === undefined) this.#v.ventana.classList.add(this.#css.class('animacion'));
        this.#estado[llave] = !this.#estado[llave];

        const accion = llave == 'max'? 'full':'media';
        this.#ejecutarFunciones(llave != 'media'?`${llave}imizar`:llave ,llave != 'media' ? this.#estado[llave]:{lado: this.#estado.mediaPos,estado: this.#estado.media});
        if(this.#estado[llave]){
            this.#cache[llave].dimension = this.dimension;
            this.#cache[llave].posicion = this.posicion;
            this.posicion = {x:0,y:0};

            const [w,h] = this.dimensionPadre.data;
            VanieAdmin.subirPosicion(this);

            if(llave == 'media' && this.#estado.mediaPos == 'der') {
                this.#verificarColision(w/2,0,w,h);
                this.#posX('50%');}
            else if(llave == 'media' && this.#estado.mediaPos == 'izq'){
                this.#verificarColision(0,0,w/2,h);}

            this.#redondearEsquinas('remove');

            if(llave == 'max'){
                if(this.#estado.media) this.#v.ventana.classList.remove(this.#css.class('media'));
                this.#reglas('remove');
                
                this.#verificarColision(0,0,w,h);}
            
            this.#v.ventana.classList.add(this.#css.class(accion));}
        else{
            const d = this.#cache.origen.dimension??this.#cache[llave].dimension;
            const p = this.#cache.origen.posicion??this.#cache[llave].posicion;
            this.dimension = d;
            this.posicion = p;
            
            this.#validarPosicion(this.#cache.origen.posicion ? this.#cache.origen : this.#cache[llave]);

            if(llave == 'max'){
                if(this.#estado.media) 
                    this.#v.ventana.classList.add(this.#css.class('media'));
                this.#reglas('add')}
            else{
                this.#estado.mediaPos = undefined;}            
            
            this.#redondearEsquinas(['add','remove'][+(this.#estado.media | this.#estado.max)]);
            this.#v.ventana.classList.remove(this.#css.class(accion));
            //#region reposicionador
            if(e && data?.sinAnimacion){
                const dimension = this.#cache.origen.dimension ?? this.#cache[llave].dimension
                const anchoP = data.dim_padre.w;
                const media = dimension.w/2;
                let x = e.clientX - media;

                if((e.clientX + media) > anchoP){x = anchoP - dimension.w;}
                else if(x < 0) x = 0;

                this.#posX(x); 
                this.#posY(0);
                data.origen = this.posicion;}
            else{
                //this.#verificarColision(this.x,this.y,this.ancho,this.alto);
                this.#verificarColision(p.x,p.y,d.w + p.x,d.h+p.y);
                //this.#desaparecerColision(true);
            }

            if(!this.#estado.mediaPos && !this.#estado.max){
                this.#cache.origen.dimension = this.#cache.origen.posicion = undefined;}}}
//#region cerrar
/**
 * Al accionar, `cerrar` ejecuta una de las siguientes dos acciones:
 * + `Defecto`: Elimina completamente su contenido y se desconecta del contenedor padre.
 * + `eliminarAlCerrar(false)`: Solo oculta el contenido.
 */
    cerrar(){
        if(!this.estaAbierto) return;
        if(!this.estaMinimizado && this.#llave && this.#opciones.eliminar_alcerrar) VanieAdmin.oculta(this);
        this.#animacionActiva.cerrar = true;
        this.#estado.cerrar = true;
        this.#v.ventana.classList.add(...this.#css.class('animacion','transparente'));
        this.#v.ventana.style.transform = escala(.95,.95).str;}

// #region media
/**
 * Coloca el objeto **Vanie** en la posición asignada con un tamaño del 50% de la pantalla, Solo si se encuentra visible.
 * @param {string} posicion Parámetros aceptados: `'der'` = derecha, `'izq'`= izquierda.
 */
    media(posicion){
        const pos = {der:'50%',izq:0};
        let arranque = false;

        if(typeof posicion != 'string' || !this.esVisible || pos[posicion] == undefined || this.#dimension.fija) return;
        if(this.#cache.origen.dimension == undefined){
            arranque = true;
            const asignar = (estado)=>{
                this.#cache.origen.dimension = estado ? this.#cache[estado].dimension.copia:this.dimension;
                this.#cache.origen.posicion = estado ? this.#cache[estado].posicion.copia:this.posicion;}

            if(this.estaMaximizado){
                if(this.#estado.mediaPos){
                    asignar('media');}
                else asignar('max');}
            else if(this.estaDividido){asignar('media');}
            else asignar();}

        const lado = this.#estado.mediaPos;
        const esDiferente = this.#estado.mediaPos != posicion;
        this.#estado.mediaPos = posicion;

        if(esDiferente && this.#estado.media) {
            if(this.estaMaximizado){this.#expandir('max');}
            this.#v.ventana.classList.add(this.#css.class('animacion'));
            this.#posX(pos[this.#estado.mediaPos]);
            this.#posY(0);}

        else {
            if(this.estaMaximizado && this.#estado.media){
                this.#expandir('max');
                if(arranque) this.#estado.media = false;
                else this.#estado.media = lado == posicion; }
            this.#expandir('media');}
        this.#ejecutarFunciones('media',{lado: this.#estado.mediaPos, estado: this.#estado.media});}
// #region abrir
/**
 * La acción `abrir` ejecuta las siguientes acciones:
 * + Si la instancia **Vanie** no se ha construido, esta la construye y la muestra en pantalla.
 * + Si se ejecutó la función `cerrar` la construirá y la mostrará nuevamente.
 * + Si esta `minimizada` la des-minimizara.
 * + Si ya se encuentra visible en pantalla, esta subirá la posición de la instancia de **Vanie** con respecto a los otros objetos **Vanie** que se encuentren en pantalla.
 */
    abrir(){
        if(this.#estado.cerrar && !this.#opciones.eliminar_alcerrar && this.estaConstruido){
            this.#ejecutarFunciones('abrir');
            this.#v.ventana.classList.remove(this.#css.class('none'));
            this.#desaparecerColision(false);}

        this.#estado.cerrar = false;

        if(this.#estado.min){ this.minimizar(); return;}

        if(!this.estaConstruido){
            this.#reConstruir();
            this.#accionadores();
            this.#animacionActiva.abrir = this.#animar_apertura;
            
            if(this.#dimension.fija) this.#reglas('remove');
            if(this.#llave){
                VanieAdmin.visible(this);
                VanieAdmin.subirPosicion(this.#llave);}
            if(this.#padre && this.#animar_apertura){
                setTimeout(()=>{
                    this.#v.ventana.classList.remove(this.#css.class('transparente'));
                    this.#v.ventana.style.transform = 'scale(1,1)';
                },100);}
            this.#transitionend();
            this.#desaparecerColision(false);
            this.#ejecutarFunciones('abrir');
            this.#validarPosicion(this);}

        else this.subir();}
        
// #region transitionend
        #transitionend(){
            this.#v.ventana.addEventListener('transitionend',()=>{
                if(!this.estaConstruido) return;

                this.#v.ventana.classList.remove(this.#css.class('animacion'));

                if(this.#animacionActiva.minimizar){
                    this.#ejecutarFunciones('minimizar', this.#estado.min);
                    this.#animacionActiva.minimizar = false;
                    this.#v.ventana.classList.remove(this.#css.class('transparente'));
                    if(this.#estado.min){
                        this.#v.ventana.style.zIndex = 0;
                        this.#v.ventana.classList.add(this.#css.class('desaparecer'));}
                    else this.#v.ventana.style.transform = '';
                    this.#desaparecerColision(this.#estado.min);}

                else if(this.#animacionActiva.abrir || this.#animacionActiva.cerrar){
                    this.#v.ventana.style.transform = '';
                    if(this.#animacionActiva.cerrar){
                        this.#animacionActiva.cerrar=false;
                        this.#desaparecerColision(true);
                        if(this.#opciones.eliminar_alcerrar){
                            this.eliminar();}
                        else{
                            if(this.estaMinimizado){this.#estado.min = false;}
                            this.#v.ventana.classList.add(this.#css.class('none'));
                            this.#v.ventana.classList.remove(this.#css.class('transparente'));}
                        this.#ejecutarFunciones('cerrar',this.#estado.cerrar);}
                    else this.#animacionActiva.abrir=false;}});}

//#region reconstruir
    #reConstruir(){
        if(!this.#css) throw('no se ha asignado ningun estilo');
        this.#v = {};
        this.#estilizar();
        for(const div in this.#classList){this.#v[div].classList.add(...this.#classList[div]);}
        for(const div in this.#id){this.#v[div].setAttribute('id',this.#id[div]);}
        this.#v.ventana.style.zIndex = '0';

        if(this.#animar_apertura){
            this.#v.ventana.style.transform = 'scale(.95,.95)';
            this.#v.ventana.classList.add(...this.#css.class('animacion','transparente'));}

        if(this.#dimension.minima.esValido){
            this.#v.ventana.style.minWidth = `${this.#dimension.minima.w}px`;
            this.#v.ventana.style.minHeight = `${this.#dimension.minima.h}px`;}

        const reglas = ['sup','inf','der','izq','esqsd','esqsi','esqid','esqii'];
        const data = [0x05,0x04,0x08,0x0a,0x0d,0x0f,0x0c,0x0e];
        this.#r = {}
        for(let i = 0; i < reglas.length; i++){
            this.#r[reglas[i]] = {div:document.createElement('div'),val:data[i]};
            this.#v.ventana.appendChild(this.#r[reglas[i]].div);}

        this.#v.ventana.appendChild(this.#v.barra);
        this.#v.ventana.appendChild(this.#v.lienzo);
        this.#v.ventana.classList.add(this.#css.idGlobal,this.#css.class('sombra'));
        this.#recompilarDimension();
        this.dimension = this.#dimension.fija ? this.#dimension.fija :this.#dimension.inicial;

        this.#asignarContenido(this.#v.lienzo,this.#lienzo);

        const padre = this.#padre;
        this.#padre = undefined;
        this.asignarPadre(padre);}

    #reacomodar(){
        if (!this.#v.barra.childNodes.length)this.#v.barra.appendChild(this.#v.cabecera);
        else{
            this.#v.barra.removeChild(this.#v.ico);
            this.#v.barra.removeChild(this.#v.divBotones);}
        
        if(this.btnAlaIzq){
            this.#v.barra.insertBefore(this.#v.divBotones, this.#v.cabecera);
            this.#v.barra.appendChild(this.#v.ico);}
        else{
            this.#v.barra.insertBefore(this.#v.ico, this.#v.cabecera);
            this.#v.barra.appendChild(this.#v.divBotones);}}

// #region estilos
/**
 * retorna el nombre del estilo que se encuentra usado la ventana.
 * @returns {string}
 */
get estilo(){return this.#css?.CONFIGURACION.data.nombre??'';}
/**
 * Cambia el estilo del objeto **Vanie** y lo fija.
 * + **String** El nombre del estilo almacenado en el sistema global.
 * + **object** El objeto con las características de estilo para ser asignadas.
 * + **CompiladorCssVanie** El complilador de estilos
 * @param {string|{}|CompiladorCssVanie} nuevoEstilo 
 * + **String** El nombre de los estilos almacenados o predeterminados: 
 * > [ `windows-claro` , `windows-oscuro` , `mac-claro` , `mac-oscuro` , `linux-claro` , `linux-oscuro` ]
 * + **object** El objeto con las características de estilo para ser asignadas.
 * + **CompiladorCssVanie** El complilador de estilos de algun objeto Vanie: *`instanciaVanie.compiladorCss`*
 */
    cambiarEstiloBase(nuevoEstilo){
        this.#estilo_pre = false;
        if(!this.#css){
            this.#css = globalVanie.agregarEstilo(nuevoEstilo);
            if(!this.#css) this.#css = globalVanie.obtenerEstilo(nuevoEstilo);}
        else{
            this.cambiarEstilo(nuevoEstilo);}
        this.#estilo_pre = !!this.#css;}
/**
 * Cambia el estilo del objeto **Vanie**
 * + **String** El nombre del estilo almacenado en el sistema global.
 * + **object** El objeto con las características de estilo para ser asignadas.
 * + **CompiladorCssVanie** El complilador de estilos
 * @param {string|{}|CompiladorCssVanie} nuevoEstilo 
 * + **String** El nombre de los estilos almacenados o predeterminados: 
 * > [ `windows-claro` , `windows-oscuro` , `mac-claro` , `mac-oscuro` , `linux-claro` , `linux-oscuro` ]
 * + **object** El objeto con las características de estilo para ser asignadas.
 * + **CompiladorCssVanie** El complilador de estilos de algun objeto Vanie: *`instanciaVanie.compiladorCss`* 
 */

    cambiarEstilo(nuevoEstilo){
        if(this.#estilo_pre) return;
        const viejo_css = this.#css;
        
        if(nuevoEstilo instanceof CompiladorCssVanie && nuevoEstilo.esValido) this.#css = nuevoEstilo;
        else if(typeof nuevoEstilo == 'string' && nuevoEstilo != this.#css?.CONFIGURACION.data.nombre){
            globalVanie.agregarEstilo(nuevoEstilo);
            this.#css = globalVanie.obtenerEstilo(nuevoEstilo);
            }
        else if(typeof nuevoEstilo == 'object'){
            globalVanie.agregarEstilo(nuevoEstilo);
            this.#css = globalVanie.obtenerEstilo(nuevoEstilo); }
        else return;
        if(!this.#css) {
            this.#css = viejo_css;
            throw('error al introducir el nuevo estilo');}
        if(this.estaConstruido) {
            this.#estilizar(viejo_css);
            this.#validarPosicion(this);}}

    #redondearEsquinas(accion){
        if(this.#css.data.radioSup) this.#v.ventana.classList[accion](this.#css.class('radioSup'));
        if(this.#css.data.radio) this.#v.ventana.classList[accion](this.#css.class('radio'));}

    #estilizar(viejo_css = undefined){
        if(!(this.#css instanceof CompiladorCssVanie)) return;
        const elementos = this.#css.LISTA_DIV;

        for(let i = 0; i < elementos.length; i++){
            if(!viejo_css) {this.#v[elementos[i]] = document.createElement('div');}
            else if(i + 1 < elementos.length && viejo_css.div?.[elementos[i]]?.class) {
                this.#v[elementos[i]].classList.remove(viejo_css.class(elementos[i]));}
            if(i + 1 < elementos.length && this.#css.div?.[elementos[i]]?.class) {
                this.#v[elementos[i]].classList.add(this.#css.class(elementos[i]));}}

        if(viejo_css){
            this.#recompilarDimension(viejo_css);
            while(this.#v.divBotones.firstChild) this.#v.divBotones.removeChild(this.#v.divBotones.firstChild);
            this.#v.divBotones.classList.remove(viejo_css.classBtnVisibles(3),viejo_css.class('controles'));
            if(viejo_css.CONFIGURACION.data.radioSup && this.#v.ventana.classList.contains(viejo_css.class('radioSup')))
                this.#v.ventana.classList.remove(viejo_css.class('radioSup'));
            if(viejo_css.CONFIGURACION.data.radio && this.#v.ventana.classList.contains(viejo_css.class('radio')))
                this.#v.ventana.classList.remove(viejo_css.class('radio'));}
        if(!(this.estaMaximizado || this.estaDividido))this.#redondearEsquinas('add');

        this.#v.divBotones.classList.add(this.#css.classBtnVisibles(3),this.#css.class('controles'));
        this.#v.barra.style.height = `${this.#css.CONFIGURACION.data.alturaBarra}px`;
        
        this.#css.CONFIGURACION.botones.data.distribucion.forEach((btn)=>{
            this.#v.divBotones.appendChild(this.#v[btn]);
            if(viejo_css) this.#v[btn].classList.remove(...viejo_css.class(btn,'botones'));
            this.#v[btn].classList.add(...this.#css.class(btn,'botones'));

            if(viejo_css && !viejo_css.div[btn]['contenido']) this.#v[btn].innerHTML = '';
            if(!this.#css.div[btn]['contenido'] || typeof(this.#css.div[btn]['contenido']) != 'string') return;
            
            const contenido = this.#css.div[btn]['contenido'].trim();
            if(/^-/.test(contenido)){
                const cli = contenido.split(' ');
                if((cli[0] == '-p' || cli[0] == '--p') && cli.length <= 4){
                    let color = '#000'; let w = 24; let h = 24; const version2 = cli[0] == '--p';
                    for(let i = 1; i < cli.length; i++){
                        if(i == 1 && /^#/.test(cli[i])) color = cli[1];
                        if(i == 2 && parseInt(cli[i])) w = h = parseInt(cli[i]);
                        if(i == 3 && parseInt(cli[i])) h = parseInt(cli[i]);}
                    this.#v[btn].innerHTML = this.#css.ICO(btn,w,h,color,version2);
                    return;}}
            this.#v[btn].innerHTML = this.#css.div[btn]['contenido']});
            
        this.#reacomodar();

        const modificarCabecera = this.#cabecera.str || this.#cabecera.titulo.span || this.#cabecera.nodo || this.#cabecera.nodos.length;
        const nodos = this.#v.cabecera.childNodes.length;
        if(nodos || modificarCabecera){
            this.#v.cabecera.style.padding = '';
            if(this.#cabecera.str){this.#v.cabecera.innerHTML = this.#cabecera.str;}
            else {
                if(this.#cabecera.titulo.span)this.#v.cabecera.appendChild(this.#cabecera.titulo.span);
                this.#asignarContenido(this.#v.cabecera,this.#cabecera);}}

        this.#asignarContenido(this.#v.ico,this.#cabecera.ico);

        this.#cabeceraAplicarMod(modificarCabecera);}

// #region accionadores
    #accionadores(){
        if(!this.estaConstruido) return;
        const pul = {}; const limite = {}
        const f = (e)=>{
            pul['sinAnimacion'] = true;
            pul["padre"] = this.posicionPadre;pul['valido']={x:true, y:true};
            pul['x']=e.clientX;pul["origen"]=this.posicion;
            pul['y']=e.clientY;pul["dimension"]=this.dimension;
            pul['dim_padre'] = this.dimensionPadre;
            pul['limite'] = VanieAdmin.limites(this.dimensionPadre,this.#llave);            
            VanieAdmin.subirPosicion(this.#llave);
            this.bloquearIframe(true);}

        const desplazo = new Desplazo;
        let orden = 0;
        this.#registro.fnMov = (e)=>{
            if(!orden) return;
            let y = 0x01 & orden ? pul.y - e.clientY : e.clientY - pul.y;
            let x = 0x02 & orden ? pul.x - e.clientX : e.clientX - pul.x;

            if(!(0x0c & orden)){
                if(this.#estado.max) this.#expandir('max',e,pul);
                if(this.#estado.media) this.#expandir('media',e,pul);

                if(!this.#dimension.fija){
                    this.#maperaLimites(e,pul,limite);
                    this.#ampliadorDeMarco({x:e.clientX, y:e.clientY},limite);}}
            
            else{
                pul.valido.x = pul.dimension.w+x > this.#dimension.minima.w;
                pul.valido.y = pul.dimension.h+y > this.#dimension.minima.h;

                if(this.#estado.media){
                    this.#cache.origen.dimension = this.#cache.origen.posicion = undefined;
                    const dimencion = this.dimension 
                    this.#cache.media.posicion = this.posicion;
                    this.#expandir('media',e,'no animar');
                    this.dimension = dimencion;}}

            if(0x01 & orden && pul.valido.y) desplazo.dy = -y;
            if(0x02 & orden && pul.valido.x) desplazo.dx = -x;
            if(0x03 & orden){this.#v.ventana.style.transform = `translate(${desplazo.dx}px,${desplazo.dy}px)`;}
            if(0x04 & orden && pul.valido.y) this.#v.ventana.style.height=`${pul.dimension.h+y}px`;
            if(0x08 & orden && pul.valido.x) this.#v.ventana.style.width=`${pul.dimension.w+x}px`;
        
            if(pul.limite && (pul.valido.x || pul.valido.y)){
                const _x = desplazo.dx + pul.origen.x;
                const xm = _x + this.#v.ventana.offsetWidth;
                const _y = desplazo.dy + pul.origen.y;
                const ym = _y + this.#v.ventana.offsetHeight;
                this.#eventoColision(_x,_y,xm,ym,pul.limite);}}
       
        this.#registro.fnUp = ()=>{
            if(orden){
                this.#modificaMARCO();
                this.bloquearIframe(false);
                if(desplazo.dx) this.#posX(desplazo.dx + pul.origen.x);
                if(desplazo.dy) this.#posY(desplazo.dy + pul.origen.y);
                this.#v.ventana.style.transform = '';
                desplazo.resetear();
                this.#transformacion.dim = this.#transformacion.mov = orden = 0;
            }
            
            if(!this.#estado.mediaPos || this.#estado.media || this.#estado.mediaPos == 'inf'){
                if(!this.estaMinimizado) this.#validarPosicion(this);
                if(this.#estado.mediaPos == 'inf') this.#estado.mediaPos = undefined;
                return;}

            this.#expandir('media');};

        this.#registro.fnMov = this.#registro.fnMov.bind(this);
        this.#registro.fnUp = this.#registro.fnUp.bind(this);
        
        this.#v.barra.addEventListener('dblclick',(e)=>{
            const validos = this.#css.class('controles','cabecera','ico','barra');
            for(const clase of e.target.classList){
                if(validos.includes(clase)){
                    this.maximizar();
                    return;}}});
        
        this.#v.ventana.addEventListener('click',(e)=>{
            if(this.#v.minimizar === e.target) this.minimizar();
            else if(this.#v.cerrar === e.target) this.cerrar();
            else{
                VanieAdmin.subirPosicion(this.#llave);
                if(this.#v.maximizar === e.target)this.maximizar();}});

        this.#v.ventana.addEventListener('mousedown',(e)=>{
            if(e.target === this.#v.barra || e.target === this.#v.cabecera || e.target === this.#v.divBotones){
                this.#transformacion.mov = orden = 0x03;}
            else if (e.target !== this.#v.lienzo)
                for(const obj in this.#r){
                    if(this.#r[obj].div === e.target){
                        orden = this.#r[obj].val;
                        this.#transformacion.dim = !this.#dimension.fija && !!orden;
                        break;}}
            if(e.target === this.#v.lienzo){this.subir();}
//#region orden
            if(orden){
                f(e);
                VanieAdmin.mousemove = this.#registro.fnMov;
                VanieAdmin.mouseup = this.#registro.fnUp;}});}


    #maperaLimites(e,pul,limite){
        const pos = {x:e.clientX - pul.padre.x, y:e.clientY - pul.padre.y}
        const px = 2;

        limite['izq'] = pos.x <= px;
        limite['der'] = pos.x >= pul.dim_padre.w - (px + 1);
        limite['sup'] = pos.y <= px;
        limite['inf'] = pos.y >= pul.dim_padre.h - px;}

    #ampliadorDeMarco(pos,limite){
        this.#modificaMARCO()

        if(limite.sup == limite.inf && limite.der == limite.izq) {
            this.#estado.mediaPos = undefined; return;}
        if(limite.inf){ this.#estado.mediaPos = 'inf'; return;}
            
        this.#modificaMARCO(pos.x,pos.y,0,0);

        let validar = limite[this.#estado.mediaPos] = false;
        const d = this.dimensionPadre;
        
        for(const dir in limite){if(limite[dir]) validar = true;}

        if(validar) this.#marco.classList.add(globalVanie.globalClass('animacion'));
        else limite[this.#estado.mediaPos] = true;
        
        const margen = 10;

        if(limite.sup) {
            this.#modificaMARCO(margen,margen,d.w- margen*2,d.h- margen*2);
            this.#estado.mediaPos = 'sup';}
        else if(limite.der) {
            this.#modificaMARCO(d.w/2,margen,d.w/2 - margen,d.h - margen*2);
            this.#estado.mediaPos = 'der';}
        else if(limite.izq) {
            this.#modificaMARCO(margen,margen,d.w/2 - margen,d.h - margen*2);
            this.#estado.mediaPos = 'izq'}}


    #modificaMARCO(x = '',y = '',w = '',h = ''){
        if(this.#marco.style.top='')return;
        this.#marco.style.top = typeof (y) == 'number'?`${y}px`:y;
        this.#marco.style.left = typeof (x) == 'number'?`${x}px`:x;
        this.#marco.style.width = typeof (w) == 'number'?`${w}px`:w;
        this.#marco.style.height = typeof (h) == 'number'?`${h}px`:h;
        if(x === ''){
            this.#marco.style.zIndex = '0';
            this.#marco.classList.add(this.#css.class('transparente'));
            this.#marco.classList.remove(...this.#css.class('sombra','marco'));}
        else{
            this.#marco.style.zIndex = `${this.#v.ventana.style.zIndex}`;
            this.#marco.classList.remove(this.#css.class('transparente'));
            this.#marco.classList.add(...this.#css.class('sombra','marco'));}}  

//#region configuradores
    #innerhtml(elemento,inner,almacen,fnAsig){
        if(inner == undefined) return;
        while(elemento?.firstChild) elemento.removeChild(elemento.firstChild);

        almacen.nodo = almacen.str = undefined;
        almacen.nodos = [];

        const html = (nuevoNodo)=>{
            if(!(nuevoNodo instanceof HTMLElement) || nuevoNodo === almacen.nodo || almacen.nodos.includes(nuevoNodo)) return undefined;
            elemento?.appendChild(nuevoNodo);
            return nuevoNodo;}

        if(typeof inner == 'string'){
            const contenido = inner.trim();
            if(fnAsig) fnAsig();
            if(contenido != '') almacen.str = contenido;
            if(this.estaConstruido) elemento.innerHTML = contenido;}
        else if(inner instanceof Array){
            let validos = 0;
            for(let i = 0;i<inner.length; ++i){
                const nodo = html(inner[i]);
                if(!nodo) continue; 
                ++validos;
                almacen.nodos.push(nodo);}
            return !!validos;}

        else{
            const nodo = html(inner);
            if(nodo) almacen.nodo = nodo;
            else return false;}
        return true;}

    #asignarContenido(elemento,almacen){
            if(almacen.str) elemento.innerHTML = almacen.str;
            else if(almacen.iframe) elemento.appendChild(almacen.iframe);
            else if(almacen.nodo && !almacen.nodos.length) elemento.appendChild(almacen.nodo);
            else if(almacen.nodos.length) almacen.nodos.forEach(nodo=>elemento.appendChild(nodo));}
/**
 * Modifica el contenido del `div` perteneciente al icono representativo del objeto **Vanie**.
 * @param {string|HTMLElement|HTMLElement[]} innerHTML El contenido que tendrá el `div` asignado al ico del objeto **Vanie**.
 * + `string` : Incorpora el contenido del string en el innerHTML del div del icono.
 * + `HTMLElement` : Incorpora el objeto HTMLElement como un nodo hijo del ico.
 * + `Array HTMLElement` : Incorpora cada objeto HTMLElement del Array como un nodo hijo del ico.
 */
    set ico(innerHTML){
        const ok = this.#innerhtml(this.#v?.ico,innerHTML,this.#cabecera.ico);
        this.#cabeceraAplicarMod(ok);}
/**
 * Retorna la referencia `div` perteneciente al icono representativo del objeto **Vanie** si se encuentra construido, de lo contrario retornará `undefined`.
 * @returns {HTMLElement|undefined}
 */
    get ico(){return this.#v?.ico;}

/**
 * Retornará la referencia del objeto `CompiladorCssVanie` perteneciente al objeto **Vanie** si se asignó un estilo, de lo contrario retornara `undefined`.
 * @returns {CompiladorCssVanie|undefined}
 */
    get compiladorCss(){ return this.#css;}

/**
 * Retornará la referencia `div` perteneciente a la ventana del objeto **Vanie** si se encuentra construido, si no lo está, retornará `undefined`.
 * @returns {HTMLElement|undefined}
 */
    get ventana() {return this.#v?.ventana;}
/**
 * Modificará la opacidad del objeto **Vanie** si se encuentra construido.
 */
    set opacidad(num){
        if(typeof(num) != 'number' || !this.estaConstruido) return;
        this.#v.ventana.style.opacity = num;}
/**
 * Retornará la opacidad del objeto **Vanie**.
 * @returns {number|string}
 */
    get opacidad(){this.#v?.ventana.style.opacity;}
/**
 * Retornará el identificador asignado al objeto **Vanie**, si no se ha asignado ninguno retornará `undefined`.
 * @returns {string|number|undefined}
 */
    get identificador(){return this.#identificador;}
/**
 * Asigna un identificador al objeto **Vanie**.
 * @param {string|number} id Identificador. 
 */
    set identificador(id){if(typeof id == 'number' || typeof id == 'string') this.#identificador = id;}
/**
 * Permite activar/desactivar la animación de apertura usada con la acción `abrir`.
 * @param {boolean} boleano `true`: Activa las animaciones, `false`: Desactiva las animaciones.
 */
    animarApertura(boleano = true){this.#animar_apertura = boleano;}
/**
 * Permite activar/desactivar la re-dimension del objeto **Vanie**.
 * @param {boolean} boleano `true`: Activa la posibilidad de redimensionar. `false`: Desactiva la re-dimension.
 */ 
    redimensionar(boleano){
        if(this.#dimension.fija) return;
        this.#opciones.redimensionar = true;
        this.#reglas(boleano ? 'add':'remove');
        this.#opciones.redimensionar = !!boleano;}
/**
 * Permite activar/desactivar la opción de eliminar el contenido del objeto **Vanie** con la acción `cerrar`.
 * @param {boolean} condicion 
 */
    eliminarAlCerrar(condicion){this.#opciones.eliminar_alcerrar = condicion;}
/**
 * Desconecta el objeto **Vanie** del gestor global
 */
    desconectarseDelGestor(){
        if(!this.#llave) return;
        this.#desaparecerColision(true);
        VanieAdmin.removerVentana(this.#llave);
        if(this.estaConstruido) this.#v.ventana.style.zIndex = 0; 
        this.#llave = undefined;}
/**
 * Agrega o remueve clases a los objetos seleccionados.
 * @param {string} elemento Nombre clave de los div del objeto **Vanie**:  
 * + `'ventana'` : El div perteneciente a la ventana.
 * + `'barra'` : El contenedor que contiene la cabecera, divBotones, ico.
 * + `'cabecera'` : El div perteneciente a la cabecera.
 * + `'divBotones'` : El contenedor de los botones: _cerrar, minimizar, maximizar_.
 * + `'cerrar'` : El div que funciona como el botón para cerrar.
 * + `'minimizar'` : El div que funciona como botón para minimizar.
 * + `'maximizar'` : El div que funciona como el botón para maximizar.
 * + `'lienzo'` : El contenedor del lienzo.
 * + `'ico'` : El div que funge para poner un icono representativo del objeto **Vanie**.
 * @param {string} accion La accion que tomara: `add` = agregar clase, `remove` = remover la clase
 * @param {string} clases El nombre de la clase.
 */
    classList(elemento,accion,clases){
        if(!this.#css?.LISTA_DIV.includes(elemento)) return;

        const fnActiva = {add:'add',remove:'delete'}

        if(fnActiva[accion] && typeof clases == 'string'){
            if(!this.#classList[elemento])this.#classList[elemento] = new Set;
            const l = clases.split(' ');
            for(let i = 0; i < l.length; ++i){
                if(l[i] =='') continue;
                if(this.estaConstruido) this.#v[elemento].classList[accion](l[i]);
                this.#classList[elemento][fnActiva[accion]](l[i]);}
            if(!this.#classList[elemento].size) delete this.#classList[elemento]}}
/**
 * Asignará un id al elemento seleccionado.
 * @param {string} elemento Nombre clave de los div del objeto **Vanie**:  
 * + `'ventana'` : El div perteneciente a la ventana.
 * + `'barra'` : El contenedor que contiene la cabecera, divBotones, ico.
 * + `'cabecera'` : El div perteneciente a la cabecera.
 * + `'divBotones'` : El contenedor de los botones: _cerrar, minimizar, maximizar_.
 * + `'cerrar'` : El div que funciona como el botón para cerrar.
 * + `'minimizar'` : El div que funciona como botón para minimizar.
 * + `'maximizar'` : El div que funciona como el botón para maximizar.
 * + `'lienzo'` : El contenedor del lienzo.
 * + `'ico'` : El div que funge para poner un icono representativo del objeto **Vanie**.
 * @param {string} id Nombre del `id` si se define vacio `''` se eliminara el id.  
 * @returns 
 */
    id(elemento,id){
        if(!this.#css?.LISTA_DIV.includes(elemento)) return;
        const ID = typeof id == 'string' ? id.trim():'';
        if(this.estaConstruido) this.#v[elemento].setAttribute('id',ID);
        if(ID == '' && this.#id[elemento]) delete this.#id[elemento];
        else if(ID != '')this.#id[elemento] = ID;}
/**
 * Detecta los eventos relacionados al objeto **Vanie**.
 * @param {string} evento el Nombre del evento:
 * + `'cerrar'`: Detecta el evento cerrar.
 * + `'minimizar'` Detecta el evento minimizar.
 * + `'maximizar'` Detecta el evento maximizar.
 * + `'media'` Detecta el evento de posicionamiento a los lados del objeto **Vanie**
 * + `'abrir'` Detecta el evento abrir solo al momento de construir y mostrar el objeto **Vanie**.
 * @param {function (boolean):void } funcion La función a ejecutarse puede aceptar un argumento booleano para determinar si el evento cambió `true` o `false` si el evento regresó a su estado original. 
 */
    addEventListener(evento, funcion){
        if(typeof(evento)!='string'|| this.#funciones[evento] == undefined
        || typeof(funcion) != 'function' || this.#funciones[evento]?.includes(funcion)) return;
        this.#funciones[evento].push(funcion);}
/**
 * Elimina las funciones enlazadas a los eventos.
 * @param {string} evento el Nombre del evento:
 * + `'cerrar'`: Detecta el evento cerrar.
 * + `'minimizar'` Detecta el evento minimizar.
 * + `'maximizar'` Detecta el evento maximizar.
 * + `'media'` Detecta el evento de posicionamiento a los lados del objeto **Vanie**
 * + `'abrir'` Detecta el evento abrir solo al momento de construir y mostrar el objeto **Vanie**.
 * @param {function ():void } funcion La función a eliminar. 
 */
    removeEventListener(evento, funcion){
        if(typeof(evento != 'string' || this.#funciones[evento] == undefined) || !(typeof funcion == 'function')) return;
        const i = this.#funciones.indexOf(funcion);
        if(i !== -1) this.#funciones.splice(indiceAEliminar, 1);}
/**
 * Subirá de posición el objeto **Vanie** con respeto a otros objetos **Vanie** que se encuentren en pantalla.
 */   
    subir(){
        if(this.esSuperior || !this.esVisible) return;
        VanieAdmin.subirPosicion(this.#llave);}

// #region lienzo
/**
 * Retorna una referencia al elemento `div` perteneciente al lienzo del objeto **Vanie** si no está construido se retornará `undefined`.
 * @returns {HTMLElement|undefined}
 */
    get lienzo(){return this.#v?.lienzo;}
/**
 * Modifica el contenido del `div` perteneciente al lienzo representativo del objeto **Vanie**.
 * @param {string|HTMLElement|HTMLElement[]} inner El contenido que tendrá el `div` asignado al lienzo del objeto **Vanie**.
 * + `string` : Incorpora el contenido del string en el innerHTML del div del lienzo. ⚠ Su grado de prioridad es máximo, por lo que cualquier modificación a objetos relacionados con el lienzo puede no aplicarse.
 * + `HTMLElement` : Incorpora el objeto HTMLElement como un nodo hijo del lienzo.
 * + `Array HTMLElement` : Incorpora cada objeto HTMLElement del Array como un nodo hijo del lienzo.
 */
    set lienzo(inner){
        this.#innerhtml(this.#v?.lienzo,inner,this.#lienzo);
        if(inner == '') this.#lienzo.iframe = undefined;}

    #errorLienzo(){
        const conflicto = this.#lienzo.nodos.length && this.#lienzo.iframe;
        if(conflicto) console.warn('El [Lienzo] solo puede contener una instruccion');
        return conflicto;}
/**
 * Asigna una página web al contenido del lienzo.
 * @param {string} url La `url` del sitio web si se asigna un string vacío `''` se eliminará el contenido.
 */
    cargarURL(url){
        if(typeof(url) != 'string') return;
        
        if(url == ''){this.lienzo = '';}
        else if (!this.#lienzo.iframe){
            this.lienzo = '';
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', url);
            iframe.setAttribute('frameborder', 0);
            iframe.setAttribute("allowfullscreen", "");
            iframe.style.width = iframe.style.height = '100%';
            this.#lienzo.iframe = iframe;
            if(this.estaConstruido && !this.#errorLienzo())this.#v.lienzo.appendChild(this.#lienzo.iframe);}
        else this.#lienzo.iframe.setAttribute('src', url);}
/**
 * Bloquea/desbloquea todos los eventos del mouse del contenido del lienzo.
 * @param {boolean} boleano `true`: bloquea el lienzo, `false`: desbloquea el lienzo.
 */
    bloquearLienzo(boleano){
        if(!this.estaConstruido) return;
        this.#v?.lienzo.classList[boleano?'add':'remove'](this.#css.class('bloqueado'));}
/**
 * Si se ha asignado una **URL** al `lienzo`, este puede bloquear/desbloquear el \<iframe\> enlazado a este.
 * @param {boolean} boleano `true`: bloquea el \<iframe\>, `false`: desbloquea el \<iframe\>
 */
    bloquearIframe(boleano){
        if(!this.estaConstruido) return;
        this.#lienzo.iframe?.classList[boleano?'add':'remove'](this.#css.class('bloqueado'));}
/**
 * Agrega los elementos `HTMLElement` como hijos del lienzo.
 * @param  {...HTMLElement} args Nodos hijos del lienzo.
 */
    lienzoAgrega(...args){
        if(!this.#lienzo.nodos.length) this.lienzo = '';
        for(let i = 0; i < args.length; ++i){
            if(!(args[i] instanceof HTMLElement) || this.#lienzo.nodos.includes(args[i])) continue;
            this.#lienzo.nodos.push(args[i]);
            if(this.estaConstruido && !this.#errorLienzo())
                this.#v.lienzo.appendChild(args[i]);}}
/**
 * Remueve los elementos `HTMLElement` hijos del lienzo.
 * @param {...HTMLElement} args Nodos hijos a remover del lienzo.
 */
    lienzoRemueve(...args){
        for(let i = 0; i < args.length; ++i){
            if(!(this.#lienzo.nodos.includes(args[i]))) continue;
            if(this.estaConstruido) this.#v.lienzo.removeChild(args[i]);
            this.#lienzo.nodos = this.#lienzo.nodos.filter(nodo=>nodo !== args[i]);}}

// #region boleanos
/**
 * Retorna `true` si el objeto **Vanie** es visible en pantalla o `false` si no lo es.
 * @returns {boolean}
 */
    get esVisible(){return !this.#estado.min && this.estaAbierto}
/**
 * Retorna `true` si el objeto **Vanie** se encuentra por encima de los demás objetos Vanie o `false` si no es así.
 * @returns {boolean}
 */
    get esSuperior(){return this.#llave && this.#v && parseInt(this.#v.ventana.style.zIndex) >= VanieAdmin.ventanasVisibles;}
/**
 * Retorna `true` si el objeto **Vanie** se encuentra posicionado a la derecha o izquierda con un 50% del tamaño de la pantalla o `false` si no es así.
 * @returns {boolean}
 */
    get estaDividido(){return this.#estado.media}
/**
 * Retorna `true` si el objeto **Vanie** se encuentra minimizado `false` si no es así.
 * @returns {boolean}
 */
    get estaMinimizado(){return this.#estado.min;}
/**
 * Retorna `true` si el objeto **Vanie** se encuentra maximizado `false` si no es así.
 * @returns {boolean}
 */
    get estaMaximizado(){return this.#estado.max;}
/**
 * Retorna `true` si el objeto **Vanie** se encuentra cerrado `false` si no es así.
 * @returns {boolean}
 */
    get estaCerrado(){return this.#estado.cerrar;}
/**
 * Retorna `true` si el objeto **Vanie** se encuentra abierto y disponible para su uso `false` si no es así.
 * @returns {boolean}
 */
    get estaAbierto(){return !this.#estado.cerrar && this.estaConstruido && this.padre;}
/**
 * Retorna `true` si el objeto **Vanie** se ha construido correctamente `false` si no es así.
 * @returns {boolean}
 */
    get estaConstruido(){return this.#v != undefined && this.#r != undefined;}
/**
 * Retorna `true` los botones que controlan las acciones: _**cerrar**, **minimizar**_ y _**maximizar**,_ se encuentra a la izquierda o `false` si no es así.
 * @returns {boolean}
 */
    get btnAlaIzq(){return this.#opciones.btnAlaIzq != undefined ? this.#opciones.btnAlaIzq:(this.#css?.data.posIzq);}
/**
 * Retorna `true` los botones que controlan las acciones: _**cerrar**, **minimizar**_ y _**maximizar**,_ se encuentra a la derecha o `false` si no es así.
 * @returns {boolean}
 */
    get btnAlaDer(){return !this.btnAlaIzq;}
/**
 * Retorna `true` si el objeto **Vanie** se esta moviendo por la pantalla `false` si no es así.
 * @returns {boolean}
 */
    get seMueve(){return !!this.#transformacion.mov;}
/**
 * Retorna `true` si el objeto **Vanie** se esta redimencionando `false` si no es así.
 * @returns {boolean}
 */
    get seRedimensiona(){return !!this.#transformacion.dim;}
}