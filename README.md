<h1 align="center">💻 Vanie 💻<h1/>

<p align="center"><a href="#"><img src="https://i.ibb.co/StFCMCP/vanie-hd.png" alt="imagen representativa de Taimy"></a><p/>


## **Vanie**

Vanie es una biblioteca diseñada para el desarrollo de interfaces de usuario interactivas en el front-end. Con un enfoque en la creación de ventanas arrastrables, Vanie ofrece una experiencia de usuario familiar, inspirada en los sistemas operativos más emblemáticos: Windows, macOS y Linux.

##### instalacion
``` bash
npm i vanie
```
### Contenido:
+ [Demo](#demo)


constructor(estilo)
+ [Conexión con el DOM]()
    removerPadre()
    get padre()
    set padre(padre)
    asignarPadre(padre)
+ [Estructura]()
    set cabecera(inner)
    get cabecera()
    set titulo(str)
    set justificarCabecera(str)
    get justificarCabecera()
    get titulo()
    limpiarCabecera()
    set ico(innerHTML)
    get ico()
    get ventana() 
    get lienzo()
    cargarURL(url)
    bloquearLienzo(boleano)
    bloquearIframe(boleano)
    lienzoAgrega(...args)
    lienzoRemueve(...args)
+ [Coordenadas y posición]()
    get posicion()
    set posicion(p)
    get x()
    set x(num)
    get y()
    set y(num)
    get posicionPadre()
    verificarPosicion()
    cambiarPuntoDeRetorno(x,y)
    get pRetorno()
    set pRetorno(pos)
    cambiarPuntoDeApertura
    get pApertura()
    set pApertura(pos)
    desplazar(dx,dy)
    get desplazo()
+ [Dimensión]()
    get dimension()
    set dimension(d)
    get alto()
    set alto(h)
    get ancho()
    set ancho(w)
    get dimensionPadre()
    cambiarDimensionInicial
    get dApertura()
    set dApertura(dim)
    cambiarDimensionMinima(w,h)
    get dMinima()
    set dMinima(dim)
    cambiarDimensionLienzo(w,h,fijar = false)
    fijarDimensionDelLienzo(condicion)
    cambiarDimensionFija(w,h)
    get dFija()
    set dFija(dim)
    eliminarDimensionLienzo()
+ [Botones y Eventos]()
    minimizar()
    maximizar()
    cerrar()
    media(posicion)
    abrir()
    addEventListener(evento, funcion)
    removeEventListener(evento, funcion)
+ [Modificar estilos]()
    cambiarEstiloBase(nuevoEstilo)
    cambiarEstilo(nuevoEstilo)
    get compiladorCss()
+ [Configuraciones]()
    set opacidad(num)
    get opacidad()
    get identificador()
    set identificador(id)
    animarApertura(boleano = true)
    redimensionar(boleano)
    eliminarAlCerrar(condicion)
    desconectarseDelGestor()
    classList(elemento,accion,clases)
    id(elemento,id)
    subir()
    eliminar()
+ [Validadores]()
    get esVisible()
    get esSuperior()
    get estaDividido()
    get estaMinimizado()
    get estaMaximizado()
    get estaCerrado()
    get estaAbierto()
    get estaConstruido()
    get btnAlaIzq()
    get btnAlaDer()
    get seMueve()
    get seRedimensiona()
+ [Sistema globlal]()

### Demo

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmp1bzBlOGI3ZzE4cDhwMWt2YjBqOG1rajRrcGIycnJrOWducDY5bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/U5AwzVnUJPawo1bmDQ/source.gif" alt="imagen representativa de Taimy"></a><p/>

Para correr la demo y probar su funcionamiento, solo instale las dependencias y ejecute:

``` bash
npm run demo
```