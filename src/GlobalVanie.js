import Vanie from "./Vanie.js";
import CompiladorCssVanie from "./CompiladorCssVanie.js";
//#region AdministradorVanie
class AdministradorVanie{
    nodos = new Map;
    trueColision = new Map;
    #ventanas_visibles = 0;
    #registros = 0;
    #mousemove;
    #mouseup;
    #limites = undefined;
    #eventos ={registro:[],vista:[],colision:[],pulsar:[]};

    constructor(){
        document.addEventListener('mousemove',e=>this.#mousemove?.(e));
        document.addEventListener('mouseup',e=>this.#mouseup?.(e));}

    set mousemove(fn){if(typeof fn == 'function') this.#mousemove = fn;}
    set mouseup(fn){if(typeof fn == 'function') this.#mouseup = fn;}

    get ventanasVisibles(){ return this.#ventanas_visibles;}
    get estilosPredeterminados(){return CompiladorCssVanie.predeterminados;}

    #iter(e,args){
        const fn = this.#eventos[e];
        for(let i = 0; i < fn.length; ++i) fn[i](args);}

    oculta(ventana){--this.#ventanas_visibles;this.#iter('vista',{vanie:ventana,visibles:this.#ventanas_visibles,seOculto:true,seMostro:false});}
    visible(ventana){++this.#ventanas_visibles;this.#iter('vista',{vanie:ventana,visibles:this.#ventanas_visibles,seOculto:false,seMostro:true});}
    validarColision(der=false,izq=false,sup=false,inf=false){
        this.#iter('colision',{der:der,izq:izq,sup:sup,inf:inf});}

    estaEnElLimite(){return !!this.trueColision.size;}
    registrarColision(llave,obj){this.trueColision.set(llave,obj); }
    eliminarRegistroColision(llave){this.trueColision.delete(llave);}
    eliminarLimites(){this.#limites = undefined;}

    subirPosicion(llave){
        const vanieNodo = this.nodos.get(llave);
        
        if(!vanieNodo || !vanieNodo.estaAbierto) return;

        const zindex = vanieNodo.ventana.style.zIndex;
        if(zindex >= this.#ventanas_visibles) return;
        
        for(const nodo of this.nodos.values()){
            nodo.bloquearIframe(true);
            if(nodo.ventana?.style.zIndex > zindex){
                nodo.ventana.style.zIndex = `${nodo.ventana.style.zIndex - 1}`;}}

        vanieNodo.bloquearIframe(false);
        vanieNodo.ventana.style.zIndex = `${this.#ventanas_visibles}`;}

    registrarNuevaVentana(vanie){
        if(!(vanie instanceof Vanie)) return undefined;
        const llave = 'Vanie'+ ++this.#registros;
        this.nodos.set(llave,vanie);
        this.subirPosicion(llave);
        return llave;}

    pulsar(llave,vanie){
        if(!llave) return;
        this.#iter('pulsar',vanie);
    }

    activarRegistro(llave,vanie){
        if(!llave) return;
        this.#iter('registro',vanie);}

    removerVentana(llave){
        const vanieNodo = this.nodos.get(llave);
        if(!vanieNodo) return;
        if(vanieNodo.esVisible) --this.#ventanas_visibles;
        this.nodos.delete(llave);}

    asignarLimites(der,izq,sup,inf,){ 
        this.#limites = {der:der,izq:izq,sup:sup,inf:inf}}

    limites(dimension,llave){
        if(!this.#limites ||!llave) return undefined;
        const f = (v,i)=>{
            if(typeof v == 'string')
                switch(v){
                    case 'bottom': return dimension.h;
                    case 'top':return 0;
                    case 'right': return 0;
                    case 'left':return dimension.w;
                    case 'start': return 0;
                    case 'end': return dimension.data[i];
                    default:
                        let res = 0;
                        let str = v.split('%');
                        if(str.length == 2) res = parseFloat(str[1]);
                        const num = parseFloat(str[0]);
                        if(isNaN(num)||isNaN(res)) return undefined;
                        return dimension.multiplica(num/100).data[i] + res;}
            else if(typeof v != 'number') return undefined;
            return v}
        const der = f(this.#limites.der,0);
        const izq = f(this.#limites.izq,0);
        const sup = f(this.#limites.sup,1);
        const inf = f(this.#limites.inf,1);
        if((der==undefined&&izq==undefined&&sup==undefined&&inf==undefined)||(sup??'')>=inf||(izq??'')>=der)return undefined;
        return{der:der,izq:izq,sup:sup,inf:inf,ref:this.colisiones(llave)}}

    get objLimites(){return this.#limites;}

    intColision(der,izq,sup,inf){ return der|izq<<1|sup<<2|inf<<3;}
    colisiones(llave){
        let colision = 0;
        for(const [clave,valor] of this.trueColision){if(clave != llave) colision |= valor;}
        return colision;}

    eventos(evento,fn){
        const listaDeEventos = this.#eventos[evento]
        if(listaDeEventos && !listaDeEventos.includes(fn)) listaDeEventos.push(fn);}

    eliminarEventos(evento, funcion){
        if(typeof(evento != 'string' || this.#eventos[evento] == undefined) || !(typeof funcion == 'function')) return;
        const i = this.#eventos.indexOf(funcion);
        if(i !== -1) this.#eventos.splice(indiceAEliminar, 1);}}

const VanieAdmin = new AdministradorVanie;
//#region GestorVanie
class GestorVanie{
    #Epersonalizados = [];
    #Epredefinidos = [];
    #padre;
    #sistemaBase;
    #idglobal = 'VANIE_GLOBAL';
/**
 * @readonly
 * Retorna el numero de ventanas visibles en pantalla
 * @returns {number}
 */
    get ventanasVisibles(){ return VanieAdmin.ventanasVisibles;}
/**
 * Retorna el elemento `HTMLElement` contenedor o `undefined` si no existe.
 * @returns {HTMLElement|undefined}
 */
    get padre(){return this.#padre;}
/**
 * Retorna el nombre de la id global.
 * @returns {string}
 */
    get idGlobal(){return this.#idglobal;}
/**
 * Retorna los nombre de los estilos predeterminados: [ `'windows-claro'` , `'windows-oscuro'` , `'linux-claro'` , `'linux-oscuro'` , `'mac-claro'` , `'mac-oscuro'` ]
 * @returns {string[]}
 */
    get estilosPredeterminados(){return CompiladorCssVanie.predeterminados;}
/**
 * Conecta el elemento del DOM para ser usado de forma global por todos los objetos **Vanie**.
 * @param {HTMLElement} padre Elemento del DOM que sera el contenedor principal.
 * @returns {this}
 */
    conectarseA(padre){
        if(padre instanceof HTMLElement) this.#padre = padre;
        return this;}
/**
 * Cambia y reescribe la clase global que controla parte de los estilos y comportamientos de los objetos **Vanie**.
 * @param {string} nuevoNombre Nuevo nombre de la clase global.  
 * > ⚠ Solo debería cambiar el nombre de la clase global si interfiere con su diseño y al principio de su código, ya que si está en ejecución podría causar problemas de compatibilidad.
 * @returns {this}
 */
    renombrarIdGlobal(nuevoNombre){
        if(typeof nuevoNombre == 'string' && nuevoNombre != this.#idglobal){
            if(this.#Epersonalizados.length) this.#Epersonalizados.forEach(css=>{css.modificarGlobal(nuevoNombre)});
            if(this.#Epredefinidos.length) this.#Epredefinidos.forEach(css=>{css.modificarGlobal(nuevoNombre)});
            if(this.#sistemaBase) this.#sistemaBase.modificarGlobal(nuevoNombre);
            this.#idglobal = nuevoNombre;}
        return this;}
/**
 * Obtiene el estilo almacenado.
 * + **String** El nombre del estilo almacenado en el sistema global.
 * @param {string|undefined} sistema Nombre del estilo.
 * + **String** El nombre del estilo almacenado en el sistema global.
 * + **undefined** Retorna el estilo principal que se encuentra almacenado.
 * @returns {CompiladorCssVanie}
 */
    obtenerEstilo(sistema = undefined){
        if(!sistema) return this.#sistemaBase;
        const personalizado = this.#__buscarEstiloPersonalizado(sistema);
        if(personalizado) return personalizado;
        return this.#__buscarEstiloPredeterminado(sistema);}
/**
 * Establece un estilo principal para ser usado de forma global.
 * + **String** El nombre del estilo almacenado en el sistema global.
 * + **object** El objeto con las características de estilo para ser asignadas.
 * + **CompiladorCssVanie** El complilador de estilos
 * @param {string|CompiladorCssVanie|{}}} sistema 
 * + **String** El nombre de los estilos almacenados o predeterminados: 
 * > [ `windows-claro` , `windows-oscuro` , `mac-claro` , `mac-oscuro` , `linux-claro` , `linux-oscuro` ]
 * + **object** El objeto con las características de estilo para ser asignadas.
 * + **CompiladorCssVanie** El complilador de estilos de algun objeto Vanie: *`instanciaVanie.compiladorCss`* 
 * @returns {this}
 */
    establecerBase(estilo){
        this.agregarEstilo(estilo);
        let cf = this.obtenerEstilo(estilo);
        if(cf && !this.esElEstiloBase(cf)){
            this.#sistemaBase = cf;
            VanieAdmin.nodos.forEach(ventana=>{ventana.cambiarEstilo(cf);});}
        return this;}
/**
 * Retorna el nombre del estilo principal o `undefined` si no está establecido.
 * @returns {string|undefined}
 */
    get estiloBase(){return this.#sistemaBase?.data.nombre;}
/**
 * Retorna `true` si existe un estilo principal o `false` si no existe.
 * @returns {boolean}
 */
    get hayEstiloBase(){return !!this.#sistemaBase;}
/**
 * Retorna `true` si existen estilos almacenados para ser usados de forma global o `false` si no es así.
 * @returns {boolean}
 */
    get hayEstilos(){return this.#Epredefinidos.length && this.#Epersonalizados.length && this.#sistemaBase;}
/**
 * Retorna el numero de instancias Vanie registradas.
 * @returns {number}
 */
    get registros(){return VanieAdmin.nodos.size;}
/**
 * Establece los límites que determinarán las colisiones de los objetos **Vanie** en pantalla.
 * @param {{der:undefined|number|string izq:undefined|number|string sup:undefined|number|string inf:undefined|number|string}} o Objeto con las siguientes características:
 * @example
 * {   
 *   der : undefined | number | string = 'right' 'end' '0%...100%' '100%-1' '100%+1',
 *   izq : undefined | number | string = 'left' 'start' '0%...100%' '100%-1' '100%+1',
 *   sup : undefined | number | string = 'top' 'start' '0%...100%' '100%-1' '100%+1',   
 *   inf : undefined | number | string = 'bottom' 'end' '0%...100%' '100%-1' '100%+1',
 * }
 */
    set limites(o){
        if(o == undefined || o == 0 || o == ''|| (o.der == undefined&&o.izq == undefined&&o.sup == undefined&&o.inf== undefined)){
                VanieAdmin.eliminarLimites();
                return;}
        try{
            this.#establecerLimites(o.der,o.izq,o.sup,o.inf);}catch(err){
            console.error('--OBJETO INVALIDO--');
            console.info(`Caracteristicas que debe contener un objeto valido:
            { 
                der : undefined | number | string = 'right' | 'end' | '0%' '100%' '100%-1' '100%+1',
                izq : undefined | number | string = 'left' | 'start' | '0%' '100%' '100%-1' '100%+1',
                sup : undefined | number | string = 'top' | 'start' | '0%' '100%' '100%-1' '100%+1',   
                inf : undefined | number | string = 'bottom' | 'end' | '0%' '100%' '100%-1' '100%+1',)
            } `);
            return err;}}

    #establecerLimites(der,izq,sup,inf){
        const s = typeof sup == 'string'?sup.trim():sup;
        const i = typeof inf == 'string'?inf.trim():inf;
        const d = typeof der == 'string'?der.trim():der;
        const iz =  typeof izq == 'string'?izq.trim():izq;
        VanieAdmin.asignarLimites(d,iz,s,i);}
/**
 * Si se ha hecho una asignación correcta, retornará los límites que determinarán las colisiones de los objetos **Vanie** en pantalla, de lo contrario devolverá `undefined`.
 * @returns {{der:undefined|number|string izq:undefined|number|string sup:undefined|number|string inf:undefined|number|string} | undefined}
 */        
    get limites(){return VanieAdmin.objLimites;}
 /**
  * Toma un CompiladorCssVanie para comprobar si es el estilo principal.
  * @param {CompiladorCssVanie} estilo 
  * @returns {boolean}
  */   
    esElEstiloBase(estilo){
        if(!(estilo instanceof CompiladorCssVanie) || !this.#sistemaBase)return false;
        return estilo.data.nombre == this.#sistemaBase.data.nombre;}
/**
 * Agrega un estilo a las listas globales para ser usado cuando se use su nombre.
 * + **String** El nombre del estilo almacenado en el sistema global.
 * + **object** El objeto con las características de estilo para ser asignadas.
 * + **CompiladorCssVanie** El complilador de estilos
 * @param {string|{}|CompiladorCssVanie} estilo 
 * + **String** El nombre de los estilos almacenados o predeterminados: 
 * > [ `windows-claro` , `windows-oscuro` , `mac-claro` , `mac-oscuro` , `linux-claro` , `linux-oscuro` ]
 * + **object** El objeto con las características de estilo para ser asignadas.
 * + **CompiladorCssVanie** El complilador de estilos de algun objeto Vanie: *`instanciaVanie.compiladorCss`* 
 */
    agregarEstilo(estilo){
        if(!estilo || (typeof estilo != 'string' && typeof estilo != 'object')) return undefined;
        let cf = undefined;
        let base = !this.#Epredefinidos.length && !this.#Epersonalizados.length;

        if(typeof(estilo) == 'string'){
            if(!CompiladorCssVanie.predeterminados.includes(estilo)) return undefined;
            if(!this.#__buscarEstiloPredeterminado(estilo)){
                cf = new CompiladorCssVanie(estilo,this.#idglobal)
                this.#Epredefinidos.push(cf);}}
        else{
            try{
                if(!this.#__buscarEstiloPersonalizado(estilo.data.nombre)){
                    cf = new CompiladorCssVanie(estilo,this.#idglobal);
                    if(!cf.esValido) return undefined;
                    this.#Epersonalizados.push(cf);}
            }catch(error){
            console.error('se a producido un error al asignar el estilo'); return error;}}
        if(base && cf) this.#sistemaBase = cf;
        return cf;}
/**
 * Ejecuta una función proporcionada una vez por cada ventana/llave en el sistema global, en el orden en el que se registro.
 * @param {function (ventana llave Map)} funcion 
 */
    ventanasForEach(funcion){VanieAdmin.nodos.forEach(funcion);}
/**
 * Otorga el nombre o la lista de nombres de la clase global a partir de un alias para su uso en los elementos del DOM.
 * @param {...string} alias El alias de la clase global que ejecutara las siguientes órdenes en CSS:  
 * + `titulo` : CSS personalizable, si no ha cambiado la id global podrá usarla como: **'VANIE_GLOBAL--titulo'** caso contrario, asigne el nombre que uso como id global `${idglobal}--titulo`.
 * + `animacion` : transition : **all .3s ease**;
 * + `none` : display : **none**;
 * + `transparente` : opacity : **0**;
 * + `desaparecer` : visibility : **hidden**;
 * + `bloqueado` : user-select : **none**; -webkit-user-select : **none**; -moz-user-select :**none**; pointer-events :**none**;
 * + `full` : width : **100%** !important; height : **100%** !important;
 * + `media` : width : **50%** !important; height : **100%** !important;
 * + `radio` : border-radius : **8px**;
 * + `radioSup` : border-radius : **8px 8px 0 0**;
 * @returns {string|string[]}
 */
    globalClass(...alias){return this.#sistemaBase?.globalClass(...alias);}
/**
 * Detecta los eventos relacionados al objeto **Vanie**.
 * @param {string} evento el Nombre del evento:
 * + `'registro'` : Detecta cada vez que se crea una nueva instancia del objeto **Vanie**.
 * + `'vista'` : Detecta todos los eventos que ocultan o muestran las ventanas en pantalla
 * + `'colision'` : Detecta la colisión de las ventanas con los límites impuestos en la variable _globalVenie.limites_ y emite una señal en el caso de que se haya cruzado y/o abandonado el límite.
 * + `'pulsar'` : Detecta cuando una ventana ha sido pulsada.
 * @param {function(Vanie|{vanie:Vanie visibles:number seMostro:boolean seOculto:boolean}|{der:boolean izq:boolean sup:boolean inf:boolean}):void} funcion La función a ejecutarse puede aceptar un argumento.
 * @example
 * globalVanie.addEventListener('registro', vanie=>{ 
 *      console.log(`la ventana ${vanie.identificador} se ha registrado`) });
 * 
 * globalVanie.addEventListener('vista', objeto=>{
 *      objeto.vanie; // Vanie: ventana que lanzo el evento.
 *      objeto.visibles; // number:  número de ventanas visibles en pantalla.
 *      objeto.seOculto; // boolean: true si la ventana se ocultó, false si no fue así.
 *      objeto.seMostro; // boolean: true si la ventana se mostró en pantalla, false si no fue así.
 *  });
 * 
 * globalVanie.addEventListener('colision', colision=>{
 *      colision.der; // boolean: true si excedió el límite derecho, false si salió del límite.
 *      colision.izq; // boolean: true si excedió el límite izquierdo, false si salió del límite.
 *      colision.sup; // boolean: true si excedió el límite superior, false si salió del límite.
 *      colision.inf; // boolean: true si excedió el límite inferior, false si salió del límite.
 *  });
 * 
 * globalVanie.addEventListener('pulsar', ventana=>{
 *      console.log('ventana' + ventana.identificador + 'ha sido seleccionada');
 *  });
 */
    addEventListener(evento,funcion){if(typeof evento == 'string' && typeof funcion == 'function') VanieAdmin.eventos(evento,funcion);}
/**
* Elimina las funciones enlazadas a los eventos.
* @param {string} evento el Nombre del evento:
* + `'registro'` : Detecta cada vez que se crea una nueva instancia del objeto **Vanie**.
* + `'vista'` : Detecta todos los eventos que ocultan o muestran las ventanas en pantalla
* + `'colision'` : Detecta la colisión de las ventanas con los límites impuestos en la variable _globalVenie.limites_ y emite una señal en el caso de que se haya cruzado y/o abandonado el límite.
* @param {function():void} funcion La función a Eliminar.
*/
    removeEventListener(evento, funcion){VanieAdmin.eliminarEventos(evento,funcion);}

    #__buscarEstiloPredeterminado(nombre){
        if(this.#Epredefinidos.length)
            for(let i = 0; i < this.#Epredefinidos.length; i++)
                if(this.#Epredefinidos[i]?.data?.nombre == nombre) return this.#Epredefinidos[i];
        return undefined;}

    #__buscarEstiloPersonalizado(nombre){
        if(this.#Epersonalizados.length)
            for(let i = 0; i < this.#Epersonalizados.length; i++)
                if(this.#Epersonalizados[i]?.data?.nombre == nombre) return this.#Epersonalizados[i];
        return undefined;}}
/**
 * La instancia global que controlara todos los objetos **Vanie**
 */
const globalVanie = new GestorVanie;

export {VanieAdmin,globalVanie}