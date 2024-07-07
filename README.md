<h1 align="center">💻 Vanie 💻<h1/>

<p align="center"><a href="#"><img src="https://i.ibb.co/StFCMCP/vanie-hd.png" alt="imagen representativa de Vanie"></a></p>


## **Vanie**

Vanie es una librería diseñada para el desarrollo de interfaces de usuario interactivas en el front-end. Con un enfoque en la creación de ventanas arrastrables, Vanie ofrece una experiencia de usuario familiar, inspirada en los sistemas operativos más emblemáticos: Windows, macOS y Linux.  

</br>

Versión | Novedades
--- | ---  
0.0.4 ~ 0.0.5 | <ul><li>Nuevo Metodo [limitar movimiento](#limitarmovimiento)</li></ul>

##### instalacion:
``` bash
npm i vanie
```
### Contenido:
+ [Demo](#demo)   
+ [Constructor e inicio](#constructor)
+ [Conexión con el DOM y arranque.](#conexión-con-el-dom-y-arranque)
+ [Estructura.](#estructura)
+ [Persistencia](#persistencia)
+ [Coordenadas y posición.](#coordenadas-y-posición)
+ [Dimensión.](#dimensión)
+ [Botones y Eventos.](#botones-y-eventos)
+ [Gestos.](#gestos)
+ [Modificar estilos.](#modificar-estilos)
+ [Configuraciones.](#configuraciones)
+ [Validadores.](#validadores)
+ [globalVenie.](#globalvenie)
+ [Recomendaciones finales.](#recomendaciones-finales)
---
### Demo

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmp1bzBlOGI3ZzE4cDhwMWt2YjBqOG1rajRrcGIycnJrOWducDY5bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/U5AwzVnUJPawo1bmDQ/source.gif" alt="gif del demo de Vanie"></a></p>

Para correr esta demostración y probar su funcionamiento, solo instale las dependencias y ejecute:

``` bash
npm run demo
```
---  
<br/> 

### Constructor

_`Opcional`_ : En caso de usar **[globalVanie](#globalvenie)** para asignar el estilo.  

``` JavaScript
import Vanie from 'vanie';

// Crear una nueva instancia de Vanie con un estilo predefinido y un identificador
const ventana1 = new Vanie('windows-claro','ventana 1');

const estilos = {
    /* Ver la sección de como -- Modificar estilos -- para más detalles */
};
// Crear una nueva instancia de Vanie con un conjunto de estilos personalizado.
const ventana2 = new Vanie(estilos);

// Crear una nueva instancia de Vanie usando el compilador CSS de otra instancia existente.
const ventana3 = new Vanie(ventana2.compiladorCss);
 ```
**Parámetros del estilo**:
 + **String** : El nombre del estilo almacenado en el sistema global.  
 Estilos predefinidos disponibles: `windows-claro`, `windows-oscuro` , `mac-claro` , `mac-oscuro` , `linux-claro` , `linux-oscuro`  

+ **object** : Un objeto que contiene las características del estilo a asignar. Una vez asignado, estará disponible globalmente para su uso posterior, lo que significa que solo necesitarás especificar el nombre del estilo en futuras instancias sin necesidad de reutilizar el objeto.  
*Para obtener más detalles, consulta la sección sobre cómo [Modificar estilos](#modificar-estilos).*

+ **CompiladorCssVanie** : El compilador de estilos de una instancia existente de Vanie.

**Parámetros del identificador** : *(-opcional-)* Acepta un string o un número para más detalle, vaya a la sección [identificador](#identificador) para saber más.

---
<br/> 

### Conexión con el DOM y arranque.

_`Opcional`_ : En caso de usar **[globalVanie](#globalvenie)** para conectarse al **DOM**.  

``` JavaScript
import Vanie from 'vanie';

const ventana1 = new Vanie('windows-claro');
const ventana2 = new Vanie('linux-oscuro');

// Asignar el elemento del DOM como contenedor principal para la ventana.
ventana1.asignarPadre(document.body);
ventana1.removerPadre(); // Desconectar la ventana del elemento del DOM

ventana2.padre = document.body; // También se puede asignar usando la propiedad padre
ventana2.abrir(); // Construye la Ventana y la muestra en pantalla.
 ```
**Métodos y Propiedades**:
+ `asignarPadre( HTMLElement )` : Esta función asigna un elemento del DOM como el contenedor principal donde se alojará la ventana.  

+ `[get/set] padre` : Esta propiedad asigna y retorna el contenedor padre que aloja la ventana.  

+ `removerPadre()` : Este método desconecta la ventana del elemento del DOM.

+ `abrir()` : Esta función construye y muestra la ventana en pantalla.

<p align="center"><a href="#"><img src="https://i.ibb.co/z4pysfs/ventana-vacia-1.webp" alt="imagen que muestra el resultado del codigo usado en el ejemplo: Conexión con el DOM y arranque "></a></p>

> Se recomienda usar el mismo **padre** para todas las instancias que cree o usar **[globalVanie](#globalvenie)** para conectarse al DOM; de lo contrario, las funciones de posicionamiento y bloqueo se verán afectadas. Si se ve en la necesidad de usar diferentes padres, puede ir a [Configuradores](#configuraciones)->[desconectarseDelGestor](#desconectarseDelGestor) para más información.

---
<br/> 

### Estructura

Demostración gráfica de los elementos `div` que conforman las ventanas creadas con Vanie:
<p align="center"><a href="#"><img src="https://i.ibb.co/k1bRtHP/estructura.jpg" alt="imagen que representa la estructura de una ventana creada con Vanie"></a></p>

#### ventana:

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const instanciaVanie = new Vanie('mac-claro');
instanciaVanie.padre = raiz;

instanciaVanie.abrir();
console.log(instanciaVanie.ventana);// retorna el div asociado al elemento ventana.
```
**get** -  _**ventana**_ Si se ha construido satisfactoriamente la instancia Vanie retornara el `HTMLElement` que pertenece a la ventana de lo contrario retornara `undefined`.

#### cabecera:
Esta propiedad te permite personalizar el contenido de la cabecera de la ventana.
``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('linux-oscuro');
const ventana3 = new Vanie('windows-claro');
ventana1.padre = ventana2.padre = ventana3.padre = raiz;

// Cambiando el contenido de la cabecera usando innerHtml.
ventana1.cabecera = '<h2> ventana1 <h2>'; 

const boton = document.createElement('button');
boton.innerText = 'accion';
boton.style.width = '100px';
boton.style.height = '70%';
boton.style.backgroundColor = '#dd4814';

// Cambiando el contenido de la cabercera con un objeto HTMLElement.
ventana2.cabecera = boton;

const listaDeDiv = ()=>{
    const list = [];
    for(let i = 0; i < 5; i++){
        const div = document.createElement('div');
        div.style.height = div.style.width = '20px';
        div.style.backgroundColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
        list.push(div);
    }
    return list;
}
// Cambiando el contenido de la cabercera con una lista de objetos HTMLElement.
ventana3.cabecera = listaDeDiv(); 

ventana1.abrir();
ventana2.abrir();
ventana3.abrir();
 ```

**get** -  _**cabecera**_ Si se ha construido satisfactoriamente la instancia Vanie retornara el `HTMLElement` que pertenece a la cabecera de la ventana de lo contrario retornara `undefined`.  

**set** -  _**cabecera**_ Acepta tres tipos de parámetros:
+ `string` : Incorpora el contenido del string en el innerHTML del div de la cabecera. ⚠ Su grado de prioridad es máximo, por lo que cualquier modificación a objetos relacionados con la cabecera puede no aplicarse.
+ `HTMLElement` : Incorpora el objeto HTMLElement como un nodo hijo a la cabecera.
+ `Array HTMLElement` : Incorpora cada objeto HTMLElement del Array como un nodo hijo a la cabecera.

 <p align="center"><a href="#"><img src="https://i.ibb.co/c24rBTL/cabacera.jpg" alt="imagen que muestra el resultado del codigo usado en el ejemplo de la propiedad cabecera"></a></p>

 Si por alguna razón decide eliminar el contenido de la cabecera, puede hacerlo con el método `limpiarCabecera()` o asignarle un string vacío `''` a la propiedad `cabecera` directamente.

 ``` JavaScript
ventana1.cabecera = '';
ventana2.cabecera = '';
ventana3.limpiarCabecera();
 ```
 <p align="center"><a href="#"><img src="https://i.ibb.co/vXtWSy1/cabecera-limpia.jpg" alt="imagen que muestra el resultado del codigo usado en el ejemplo del metodo limpiarCabecera()"></a></p>

 #### titulo:  
Esta propiedad te permite asignar un titulo a la ventana.
``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-claro');
const ventana2 = new Vanie('linux-oscuro');
ventana2.padre = ventana1.padre = raiz;

// Usando innerHtml para establecer un título en la cabecera.
ventana1.cabecera = '<h2> ventana 1 <h2>';

// Asignando un string como título a la ventana2.
ventana2.titulo = 'ventana 2';

ventana1.abrir();
ventana2.abrir();
```
`[get/set] titulo` : Esta propiedad asigna y retorna el string del titulo.
 <p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2E4cnptYXhiMXplbmVycHVxZDZzdzFiamxjdTdqY2ZxandtODl3MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ovIuIfEgL54IYJi6zJ/giphy.gif" alt="gif animado que muestra el resultado del codigo usado en el ejemplo de la propiedad titulo"></a></p>


**¿Por qué usar título?**

Aunque inicialmente el resultado de las propiedades `cabecera` y `titulo` pueda parecer similar, la diferencia radica en que el contenido asignado a la **cabecera** impide el arrastre de la ventana, mientras que **título** no interfiere con esta funcionalidad.

Si tu intención es darle un título a cada ventana sin afectar su capacidad de ser arrastrada, utiliza la propiedad `titulo`. Esto proporciona una manera clara de distinguir entre el contenido de la **cabecera** y el **título** de la ventana, asegurando una mejor experiencia al mantener la funcionalidad de arrastre intacta.

#### justificarCabecera:

Esta propiedad te permite controlar cómo se justifica el contenido dentro de la cabecera de la ventana. Puedes usar valores como 'space-evenly', 'center', entre otros, para ajustar la disposición del contenido de la cabecera según tus necesidades de diseño.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-claro');
const ventana2 = new Vanie('linux-oscuro');
ventana2.padre = ventana1.padre = raiz;

const boton = document.createElement('button');
boton.innerText = '➕';
boton.style.height = '100%';
boton.style.aspectRedio = 1;
boton.style.backgroundColor = 'transpatern';
ventana1.cabecera = boton;

ventana1.titulo = 'ventana 1'
ventana2.titulo = 'ventana 2'

ventana1.justificarCabecera = 'space-evenly'; // justificado uniforme
ventana2.justificarCabecera = 'center'; // justificado en el centro

ventana1.abrir();
ventana2.abrir();
```
`[get/set] justificarCabecera` : Esta propiedad asigna y retorna el string con la justificación del contenido de la [cabecera](#cabecera).
 <p align="center"><a href="#"><img src="https://i.ibb.co/HNpBZN5/justificado.jpg" alt="imagen que muestra el resultado del codigo usado en el ejemplo de la propiedad justificarCabecera"></a></p>

> Si por alguna razón decide eliminar el justificado de la cabecera, puede hacerlo asignando un string vacío `''`.
#### ico:
Esta propiedad te permite asignar un icono a la ventana, que se mostrará junto al título en la cabecera. Puedes usar elementos HTML, como imágenes (\<img\>) o cualquier otro contenido HTML, para personalizar el icono de acuerdo a tus necesidades de diseño. Esto puede ayudar a identificar visualmente las ventanas.
``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-claro');
const ventana2 = new Vanie('linux-oscuro');
ventana2.padre = ventana1.padre = raiz;

ventana1.titulo = 'ventana 1'
ventana2.titulo = 'ventana 2'

const img = new Image;
img.style.height = '100%';
img.style.aspectRatio = 1;
img.setAttribute('src','https://cdn.icon-icons.com/icons2/643/PNG/512/mac-apple-osx-desktop-software-hardware_icon-icons.com_59289.png');

// Asignando un HTMLElement como nodo hijo de ico.
ventana1.ico = img;

// Usando innerHtml para establecer el contenido de ico.
ventana2.ico = '<div style ="font-size:30px;">💬</div>';

ventana1.justificarCabecera = ventana2.justificarCabecera = 'center';

ventana1.abrir();
ventana2.abrir();
```
**get** -  _**ico**_ Si se ha construido satisfactoriamente la instancia Vanie retornara el `HTMLElement` que pertenece al ico de la ventana de lo contrario retornara `undefined`.  

**set** -  _**ico**_ Acepta tres tipos de parámetros:
+ `string` : Incorpora el contenido del string en el innerHTML del div ico.
+ `HTMLElement` : Incorpora el objeto HTMLElement como un nodo hijo del ico.
+ `Array HTMLElement` : Incorpora cada objeto HTMLElement del Array como un nodo hijo del ico.

<p align="center"><a href="#"><img src="https://i.ibb.co/m80Zq6Y/ico.jpg" alt="imagen que muestra el resultado del codigo usado en el ejemplo de la propiedad ico"></a></p>


> Si por alguna razón decide eliminar el icono de la cabecera, puede hacerlo asignando un string vacío `''`.

#### lienzo:
La propiedad lienzo te permite proporcionar contenido dinámico y personalizado a las ventanas **Vanie**, lo que es fundamental para crear interfaces de usuario interactivas y atractivas. Puedes utilizar una variedad de elementos HTML, esto proporciona una manera flexible de mostrar información y funcionalidades dentro de las ventanas.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('linux-oscuro');
const ventana3 = new Vanie('windows-claro');

ventana3.padre = ventana2.padre = ventana1.padre = raiz;

ventana1.titulo = 'ventana 1';
ventana2.titulo = 'ventana 2';
ventana3.titulo = 'ventana 3';

ventana3.justificarCabecera = ventana2.justificarCabecera = ventana1.justificarCabecera = 'center';

const listaDiv = ()=>{
    const list = [];
    for(let i = 0; i < 5; i++){
        const div = document.createElement('div');
        div.style.height = div.style.width = '80px';
        div.style.backgroundColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
        list.push(div);}
    return list;
}
// asigna cada HTMLElement contenida en el Array como un nodo hijo al lienzo;
ventana3.lienzo = listaDiv(); 

const img = new Image;
img.style.width = img.style.height = '100%';
img.setAttribute('src','https://get.wallhere.com/photo/sky-digital-art-nature-clouds-anime-2304638.jpg');

// asigna el HTMLElement como nodo hijo al contenedor HTMLElement del lienzo.
ventana2.lienzo = img;

// asigna el string al innerHTML al contenedor HTMLElement del lienzo.
ventana1.lienzo = 
    `<div style="width:100%; height:100%; background-color:#252850; color:white; font-size:24px;">
        contenido del lienzo
    </div>`;

ventana1.abrir();
ventana2.abrir();
ventana3.abrir();

// retorna la referencia del contenedor HTMLElement del lienzo.
console.log(ventana1.lienzo, ventana2.lienzo, ventana3.lienzo); 
```

**get** -  _**lienzo**_ Si se ha construido satisfactoriamente la instancia **Vanie**, retornará el `HTMLElement` que pertenece al lienzo de la ventana de lo contrario, retornará `undefined`.  

**set** -  _**lienzo**_ Acepta tres tipos de parámetros:
+ `string` : Incorpora el contenido del string en el innerHTML del div lienzo. ⚠ Su grado de prioridad es máximo, por lo que cualquier modificación puede no aplicarse.
+ `HTMLElement` : Incorpora el objeto HTMLElement como un nodo hijo del lienzo.
+ `Array HTMLElement` : Incorpora cada objeto HTMLElement del Array como un nodo hijo del lienzo.  

<p align="center"><a href="#"><img src="https://i.ibb.co/82PNPhC/lienzo.jpg" alt="imagen que muestra el resultado del codigo usado en el ejemplo de la propiedad lienzo"></a></p>

> Si por alguna razón decide eliminar el contenido del lienzo, puede hacerlo asignando un string vacío `''`.

#### lienzoAgrega:
La función `lienzoAgrega` te permite añadir elementos adicionales al lienzo sin eliminar los elementos que ya están presentes. A diferencia de la asignación directa que reemplaza los elementos almacenados previamente por los nuevos elementos.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('linux-oscuro');

ventana2.padre = ventana1.padre = raiz;

ventana1.titulo = 'ventana 1';
ventana2.titulo = 'ventana 2';

ventana2.justificarCabecera = ventana1.justificarCabecera = 'center';

const listaDiv = ()=>{
    const list = [];
    for(let i = 0; i < 5; i++){
        const div = document.createElement('div');
        div.style.height = div.style.width = '50px';
        div.style.backgroundColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
        list.push(div);}
    return list;
}

ventana1.lienzo = listaDiv();

// Borra los elementos anteriores para asignar los nuevos elementos al lienzo
ventana1.lienzo = listaDiv(); 

ventana2.lienzo = listaDiv();

// Agrega los elementos adicionales al lienzo
ventana2.lienzoAgrega(...listaDiv()); 

ventana1.abrir();
ventana2.abrir();

//asignar el display una vez construido
ventana2.lienzo.style.display = ventana1.lienzo.style.display = 'flex';
```
`lienzoAgrega(...HTMLElement)`: La funcion solo acepta objetos **HTMLElement** como argumentos. Si el lienzo previamente posee nodos hijos estos no seran eliminados como con la asignacion directa del lienzo.

<p align="center"><a href="#"><img src="https://i.ibb.co/hMY9WQd/lienzo-agrega.jpg" alt="imagen que muestra el resultado del codigo usado en el ejemplo de la funcion lienzoAgrega"></a></p>

#### lienzoRemueve:
La función `lienzoRemueve` te permite remover los elementos del lienzo especificados.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');

ventana1.padre = raiz;
ventana1.titulo = 'ventana 1';
ventana1.justificarCabecera = 'center';

const listaDiv = ()=>{
    const list = [];
    for(let i = 0; i < 10; i++){
        const div = document.createElement('div');
        div.style.height = div.style.width = '50px';
        div.style.display = 'grid';
        div.style.placeContent = 'center';
        div.style.fontSize = '20px';
        div.style.backgroundColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
        div.innerText = i;
        list.push(div);}
    return list;
}

const lista = listaDiv()

ventana1.lienzo = lista;
ventana1.lienzoRemueve(lista[2],lista[5]); // elimina los elementos del lienzo

ventana1.abrir();
ventana1.lienzo.style.display = 'flex';
```
`lienzoRemove(...HTMLElement)`: La función solo acepta objetos **HTMLElement** como argumentos para poder removerlos del lienzo.

<p align="center"><a href="#"><img src="https://i.ibb.co/K5GKZFy/lienzo-Remueve.png" alt="imagen que muestra el resultado del codigo usado en el ejemplo de la funcion lienzoRemueve"></a></p>

#### cargarURL:
La función `cargarURL` te permite integrar sitios web como contenido de un lienzo.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('windows-claro');

ventana2.padre = ventana1.padre = raiz;
ventana2.justificarCabecera = ventana1.justificarCabecera = 'center';

ventana1.titulo = 'ventana 1';
ventana2.titulo = 'ventana 2';

// Agregando el sitio con un iframe
ventana1.lienzo = `
    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/GrG2-oX5z24?si=UPiNV_e5HOBdC7lE" 
    title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
    encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen></iframe>`;

// Carga el sitio usando solo la URL
ventana2.cargarURL('https://www.youtube.com/embed/GrG2-oX5z24?si=UPiNV_e5HOBdC7lE'); 

ventana1.abrir();
ventana2.abrir();
```
`cargarURL(string)`: Esta función aceptará una cadena con la **URL** del sitio web como parámetro para poder asignarlo al lienzo.

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnY0MjVkNW85bnY2OTZsejZ6d3BucXIydm40d3Q5a2s3ZzAwMXpiOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hLSj1K2obKcrDcxvJx/source.gif" alt="imagen que muestra el resultado del codigo usado en el ejemplo de la funcion cargarURL"></a></p>

#### ¿Por que usar cargarURL?
Deberías usar la función `cargarURL` en lugar de asignar directamente un iframe con la dirección del sitio web, ya que esto último puede impedir toda la interactividad de la ventana, lo que podría causar problemas. `cargarURL` resuelve este problema utilizando un bloqueador interno que impide que los eventos del mouse se desactiven.  

#### bloquearLienzo y bloquearIframe:
Como su nombre indica, `bloquearLienzo` y `bloquearIframe` desactivan la interactividad del mouse para estos elementos.
``` JavaScript
ventana1.bloquearLienzo(true); // Bloquea la interactividad del lienzo.
ventana2.bloquearIframe(true); // Bloquea la interactividad del iframe creado al usar la función cargarURL.
```
`bloquearLienzo(booleano)` : Si el valor del parámetro es `true`, bloqueará la interactividad del mouse en el lienzo. Si es `false`, activará los eventos en el lienzo.  

`bloquearIframe(booleano)` : Si el valor del parámetro es `true`, bloqueará la interactividad del mouse en el iframe si se ha cargado una **URL** con la función `cargarURL` de lo contrario, no surtirá efecto. Si es `false`, activará los eventos en el **iframe**. Es importante tener en cuenta que los objetos **Vanie** poseen un bloqueador automático, por lo que esta función no tendrá un efecto tan significativo a menos que se utilice dentro de los [eventos](#botones-y-eventos) de los objetos **Vanie**.  

---
<br/> 

### Persistencia

Las ventanas creadas con **Vanie**, los elementos `HTMLElement` devueltos por las propiedades relacionadas a la [estructura](#estructura) pueden ser estilizados y recibir nodos hijos mediante sus propias funciones miembro.  
Sin embargo, es importante tener en cuenta dos problemas:
1. Acceder a las funciones miembro de estos elementos antes de que la ventana se abra generará un error.
2. **Vanie** está diseñado para optimizar el uso de recursos, por lo que asignar directamente parámetros a estas propiedades mediante sus funciones miembro puede resultar en la pérdida de estas configuraciones al [cerrar](#cerrar) la ventana.  

Para garantizar que las configuraciones se conserven, se recomienda utilizar los métodos y asignaciones mostrados anteriormente o realizar los cambios dentro del evento de [apertura](#evento-abrir) para asegurar la persistencia de su diseño.

``` JavaScript
const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('windows-claro');
const ventana3 = new Vanie('linux-oscuro');

ventana3.padre = ventana2.padre = ventana1.padre = raiz;
ventana3.justificarCabecera = ventana2.justificarCabecera = ventana1.justificarCabecera = 'center';

ventana1.titulo = 'ventana 1';
ventana2.titulo = 'ventana 2';
ventana3.titulo = 'ventana 3';

const iframe = `
    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/GrG2-oX5z24?si=UPiNV_e5HOBdC7lE" 
    title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
    encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen></iframe>`;

// Si bien esto no es lo ideal, para efectos prácticos sirve como ejemplo.
ventana1.lienzo = iframe; // Aseguramos la persistencia del diseño

// Vaya a la sección de botones y eventos para conocer más detalles de esta función.
ventana2.addEventListener('abrir',()=>{
    /* Una forma de falsear la persistencia.
    Cada vez que el objeto sea construido y mostrado,
    las configuraciones hechas también serán ingresadas.*/
    ventana2.lienzo.innerHTML = iframe;
});

ventana1.abrir();
ventana2.abrir();
ventana3.abrir();

/* Una vez construido, se mostrará el diseño, 
pero al cerrar la ventana, el elemento no conservará las configuraciones previas.*/
ventana3.lienzo.innerHTML = iframe; 

// Reabrimos las ventanas al hacer doble click
document.addEventListener('dblclick',()=>{
    ventana1.abrir();
    ventana2.abrir();
    ventana3.abrir();
});
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3FzN2ljaGtwdTB6ZWtwc2x4dnRkcXd2M2VsMXVnN3Ntc2pxeDZyaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/im6QQ7InUKWdZ4c4Tf/source.gif" alt="imagen que muestra el resultado del codigo usado en el ejemplo de persistencia"></a></p>

---
<br/>

### Coordenadas y posición

Son un conjunto de propiedades y funciones que lo ayudaran a gestionar de una forma facil el posicionamiento de las ventanas creadas por **Vanie**.

#### posicion:
La propiedad posicion le permite tanto modificar como obtener la posición de la ventana **Vanie**.

**get** - **posicion** : Retorna un objeto `Punto` que contiene la posición actual del objeto **Vanie**.  

**set** - **posicion** : Permite cambiar la posición actual del objeto **Vanie**. Puede hacerse de dos formas:
+ Mediante un objeto **Punto**
+ A través de un objeto con los parámetros **x** e **y**.
> Se aceptan tanto `números` como `strings`. Los strings permitidos son los utilizados para el posicionamiento de los elementos en **CSS**, tales como:
> + **x**: `'right'`  `'end'`  `'left'` `'start'`  `'center'`.
> + **y**:  `'top'`  `'end'`  `'bottom'`  `'start'`  `'center'`.

``` JavaScript
import Vanie from 'vanie';
import {Punto} from 'nauty'; // npm i nauty

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');

ventana1.padre = raiz;
ventana1.justificarCabecera = 'center';

ventana1.titulo = 'ventana 1';

ventana1.abrir();

// Retorna el punto donde se encuentra la ventana.
console.log(ventana1.posicion); 

// Modifica la posición de la ventana mediante un objeto Punto.
venatan1.posicion = new Punto(0,0);

// Modifica la posición de la ventana mediante un objeto con los parámetros {x,y}.
ventana1.posicion = {x:0, y:0} 

/* Modificando la posición de la ventana mediante parámetros de posicionamiento de CSS.
Es especialmente útil cuando se desconoce la dimensión del contenedor padre o cuando este es dinámico.*/
const pos = new Punto;
pos.bNuevo('end','start');
ventana1.posicion = pos;
ventana1.posicion = {x:'center',y:'bottom'}
```
> Si quiere saber más sobre el objeto `Punto`, revise la documentación de [nauty](https://www.npmjs.com/package/nauty).

#### coordenadas x, y:

Estas propiedades permiten tanto modificar como obtener las coordenadas **x** e **y** de la ventana.
+ **x** : Retorna y modifica la coordenada en el eje x.
+ **y** : Retorna y modifica la coordenada en el eje y.
> Se aceptan tanto `números` como `strings`. Los strings permitidos son los utilizados para el posicionamiento de los elementos en **CSS**:
> + **x**: `'right'`  `'end'`  `'left'` `'start'`  `'center'`.
> + **y**:  `'top'`  `'end'`  `'bottom'`  `'start'`  `'center'`.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');

ventana1.padre = raiz;
ventana1.justificarCabecera = 'center';

ventana1.titulo = 'ventana 1';

ventana1.abrir();

// Retorna las coordenadas en X, Y.
console.log(ventana1.x, ventana1.y); 

// Modifica la posición de la ventana.
venatan1.x = 0; 
ventana1.y = 0; 

// Modificando la posición de la ventana mediante parámetros de posicionamiento de CSS.
ventana1.x = 'center';
ventana1.y = 'center';
```

#### verificarPosicion:

La función `verificarPosicion` permite asegurar que la ventana se mantenga dentro del alcance del usuario, evitando que quede fuera de la pantalla y sea inaccesible.
> Esta función se aplica automáticamente, pero está disponible en caso de requerirla explícitamente.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');

ventana1.padre = raiz;
ventana1.justificarCabecera = 'center';

ventana1.titulo = 'ventana 1';

ventana1.abrir();

/* Se aplica automáticamente.
No es necesario aplicarla, pero está disponible si la necesita.*/
ventana1.verificarPosicion(); 
```
#### posicionPadre:
La propiedad `posicionPadre` retorna un objeto `Punto` con las coordenadas globales del contenedor principal.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');

ventana1.padre = raiz;

// Retorna un objeto Punto con las coordenadas globales del contenedor padre.
console.log(ventana1.posicionPadre); 

ventana1.abrir();
```
#### cambiarPuntoDeApertura y pApertura:

La función `cambiarPuntoDeApertura` y la propiedad `pApertura` permiten definir la posición de apertura de la ventana. Se pueden especificar las coordenadas en los ejes x e y utilizando números o strings que representan posiciones en **CSS**, como:  
+ **x**: `'right'`  `'end'`  `'left'` `'start'`  `'center'`.
+ **y**:  `'top'`  `'end'`  `'bottom'`  `'start'`  `'center'`.

`pApertura` ofrece una forma alternativa de realizar esta tarea, aceptando un objeto `Punto` o un objeto con las propiedades `{x, y}` para definir la posición de apertura.
``` JavaScript
import Vanie from 'vanie';
import { Punto } from "nauty"; // npm i nauty

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('windows-claro');
const ventana3 = new Vanie('linux-oscuro');

ventana3.padre = ventana2.padre = ventana1.padre = raiz;

// Cambia la posición de apertura.
ventana1.cambiarPuntoDeApertura(0,0);
// Utiliza un objeto {x, y} para definir la posición de apertura.
ventana2.pApertura = {x:'right',y:'bottom'};  

const posicion = new Punto;
posicion.bNuevo('center','center');
// Cambia la posición de apertura apartir de un objeto Punto.
ventana3.pApertura = posicion;

ventana1.abrir();
ventana2.abrir();
ventana3.abrir();

ventana1.lienzo.style.backgroundColor =
ventana2.lienzo.style.backgroundColor =
ventana3.lienzo.style.backgroundColor = '#00000077';
```
> Si quiere saber más sobre el objeto `Punto`, revise la documentación de [nauty](https://www.npmjs.com/package/nauty).

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWJ0cWF3YTIyZmY3eDhpbXk3MG1jY25wdmVheW44a2ZkYm1oNGFyZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L06TMJBTfVMT6tN1py/source.gif" alt="gif animado que muestra el resultado del codigo usado en el ejemplo de CambiarPuntoDeApertura"></a></p>

#### cambiarPuntoDeRetorno y pRetorno:
La función `cambiarPuntoDeRetorno` y la propiedad `pRetorno` permiten definir la posición a la cual regresará la ventana cuando se [minimice](#minimizar). Se pueden especificar las coordenadas en los ejes x e y utilizando números o strings que representan posiciones en **CSS**, como:  
+ **x**: `'right'`  `'end'`  `'left'` `'start'`  `'center'`.
+ **y**:  `'top'`  `'end'`  `'bottom'`  `'start'`  `'center'`.

`pRetorno` ofrece una forma alternativa de realizar esta tarea, aceptando un objeto `Punto` o un objeto con las propiedades `{x, y}` para definir la posición de retorno.

``` JavaScript
import Vanie from 'vanie';
import { Punto } from "nauty"; //npm i nauty

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('windows-claro');
const ventana3 = new Vanie('linux-oscuro');

ventana3.padre = ventana2.padre = ventana1.padre = raiz;

// Cambia la posición de retorno de la ventana 1.
ventana1.cambiarPuntoDeRetorno(0,0);

// Utiliza un objeto {x, y} para definir la posición de retorno de la ventana 2.
ventana2.pRetorno = {x:'right',y:0};  

const posicion = new Punto;
posicion.bNuevo(0,'bottom');

// Cambia la posición de retorno de la ventana 3 utilizando un objeto Punto.
ventana3.pRetorno = posicion;

ventana1.abrir();
ventana2.abrir();
ventana3.abrir();

ventana1.lienzo.style.backgroundColor =
ventana2.lienzo.style.backgroundColor =
ventana3.lienzo.style.backgroundColor = '#00000077';
```
> Si quiere saber más sobre el objeto `Punto`, revise la documentación de [nauty](https://www.npmjs.com/package/nauty).

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWs3ZmRjeDJsZ3Z3NGxycW9ldzRmMnRpeXVzaHV3cTZqd3UwY3NwcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EeWuJJCY1hbhn5OcY4/source.gif" alt="gif animado que muestra el resultado del codigo usado en el ejemplo de CambiarPuntoDeRetorno"></a></p>

#### desplazar y desplazo:
La función `desplazar` modifica el desplazamiento de la ventana en los ejes **x** e **y**. Mientras que la propiedad `desplazo` retorna un objeto `Desplazo` con los valores de desplazamiento.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');

ventana1.padre = raiz;

ventana1.abrir();
ventana1.lienzo.style.backgroundColor = '#00000077';

let desplazamiento = 0;
document.addEventListener('wheel',e=>{
    desplazamiento += e.deltaY <0? 1 : -1;
    // Modifica el desplazamiento en los ejes x e y.
    ventana1.desplazar(desplazamiento,desplazamiento); 
});

// Retorna el objeto `Desplazo` con los parámetros de desplazamiento en dx y dy
console.log(ventana1.desplazo); 
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2U5bWI2NTNxbnk5MWcybTRxc2dwcDcwanFiaXQyaGQ1NnB0d2tsNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GYz05NAdwGv7oUTkLN/source.gif" alt="gif animado que muestra el resultado del codigo usado en el ejemplo de desplazar"></a></p>

> ⚠ Tener en cuenta que el desplazamiento afecta a otras transformaciones, por lo que si desea que el desplazamiento se convierta en las coordenadas finales de la ventana, necesita hacer los cálculos necesarios y asignarlo a la [posicion](#posicion) de la ventana.

#### limitarMovimiento:

El método `limitarMovimiento` permite **activar** o **desactivar** el movimiento de una ventana. Esto es útil para evitar que una ventana se pueda arrastrar cuando no se desea esta funcionalidad.

Acepta un valor booleano que determina si se debe activar o desactivar el movimiento de la ventana.
+ `true`: Desactiva el movimiento de la ventana.
+ `false`: Activa el movimiento de la ventana.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana_noMove = new Vanie('windows-claro');
const ventana = new Vanie('linux-oscuro');

ventana_noMove.padre = ventana.padre = raiz;

//desactiva el movimiento de la ventana.
ventana_noMove.limitarMovimiento(true);

ventana_noMove.abrir();
ventana.abrir();

ventana_noMove.lienzo.style.backgroundColor = '#00000077';
ventana.lienzo.style.backgroundColor = '#059b9add';
```

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWZ2bmp5eHVxeXFtNW12dDgxbGU3bGZ6a21qZHZnaTZteWJjb3JseiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qSm75pkks62xEP2Iib/giphy.gif" alt="gif animado que muestra el resultado del codigo usado en el ejemplo de limitarMovimiento"></a></p>

---
</br>

### Dimensión
Son un conjunto de propiedades y funciones que lo ayudaran a gestionar de una forma facil la dimensión de las ventanas creadas con **Vanie**.

#### dimension:
**get** - **dimension** : Retorna un objeto `Dimension` que contiene la dimensión actual del objeto **Vanie**.  
**set** - **dimension** : Permite cambiar la dimensión actual del objeto **Vanie**. Puede hacerse de dos formas:
+ Mediante un objeto **Dimension**
+ A través de un objeto con los parámetros **w** y **h**.
> Se aceptan tanto `números` como `strings`. Los strings permitidos son porcentajes.

``` JavaScript
import Vanie from 'vanie';
import {Dimension} from 'nauty';//npm i nauty

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('windows-claro');

ventana2.padre = ventana1.padre = raiz;

ventana1.abrir();
ventana2.abrir();

// asignando la dimension a la ventana 1 usando un objeto con los parametros {w,h}.
ventana1.dimension = {w:'80%', h:500} 

const dimension = new Dimension;
dimension.bNuevo(180,'20%');

// asignando la dimension a la venatan 2 usando un objeto Dimension.
ventana2.dimension = dimension;

ventana1.lienzo.style.backgroundColor =
ventana2.lienzo.style.backgroundColor = '#00000077';
```
> Si quiere saber más sobre el objeto `Dimension`, revise la documentación de [nauty](https://www.npmjs.com/package/nauty).

#### alto y ancho:
Retornan y modifican la altura y el ancho actuales de la ventana, respectivamente. Aceptan tanto `números` como `strings`, donde los strings pueden representar porcentajes.  

`alto`: retorna y modifica la altura actual de la ventana.  
`ancho`: retorna y modifica el ancho actual de la ventana.

``` JavaScript
import Vanie from 'vanie';
const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');

ventana1.padre = raiz;

ventana1.abrir();

ventana1.alto = '50%';// asignando la altura.
ventana1.ancho = 200; // asignando el ancho.
console.log(ventana1.alto, ventana1.ancho); // retorna el alto y ancho.

ventana1.lienzo.style.backgroundColor = '#00000077';
```
#### dimensionPadre:
La propiedad `dimensionPadre` devuelve un objeto `Dimension` que representa las dimensiones del contenedor principal de la ventana.

``` JavaScript
import Vanie from 'vanie';
const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
ventana1.padre = raiz;
ventana1.abrir();

// Retorna un objeto Dimension con las dimensiones del contenedor padre.
console.log(ventana1.dimensionPadre);
```
#### cambiarDimensionInicial y dApertura:
La función `cambiarDimensionInicial` y la propiedad `dApertura` permiten establecer las dimensiones con las que se abrirá inicialmente la ventana. Se pueden especificar tanto `números` como `porcentajes`.

`dApertura` Proporciona una alternativa para realizar esta tarea, aceptando un objeto `Dimension` o un objeto con las propiedades `{w, h}` para definir las dimensiones de apertura, ademas de retorna la un objeto `Dimension` con las dimension inicial.

``` JavaScript
import Vanie from 'vanie';
import { Dimension } from "nauty";

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('windows-claro');
const ventana3 = new Vanie('linux-oscuro');

ventana3.padre = ventana2.padre = ventana1.padre = raiz;

// Cambia la dimension de apertura de la ventana 1.
ventana1.cambiarDimensionInicial(200,200);

// Utiliza un objeto {w, h} para definir la dimensión de apertura de la ventana 2.
ventana2.dApertura = {w:'100%',h:'20%'};  
const dimension = new Dimension;
dimension.bNuevo(500,'100%');

// Cambia la dimensión de apertura de la ventana 3 utilizando un objeto Dimension.
ventana3.dApertura = dimension;

ventana1.abrir();
ventana2.abrir();
ventana3.abrir();

ventana1.lienzo.style.backgroundColor =
ventana2.lienzo.style.backgroundColor =
ventana3.lienzo.style.backgroundColor = '#00000077';
```
<p align="center"><a href="#"><img src="https://i.ibb.co/bKKvt9Y/Screenshot-2024-05-12-at-00-54-55-Screenshot.png" alt="imagen que muestra el resultado del codigo usado en el ejemplo de cambiarDimensionInicial"></a></p>

#### cambiarDimensionMinima y dMinima:
La función `cambiarDimensionMinima` y la propiedad `dMinima` permiten establecer las dimensiones mínimas con las que la ventana estará limitada. Solo se pueden utilizar `números` como parámetros.

`dMinima` proporciona una alternativa para realizar esta tarea, aceptando un objeto `Dimension` o un objeto con las propiedades `{w, h}` para definir las dimensiones mínimas. Además, retorna un objeto `Dimension` con las dimensiones mínimas.

``` JavaScript
import Vanie from 'vanie';
import { Dimension } from "nauty";//npm i nauty

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('windows-claro');
const ventana3 = new Vanie('linux-oscuro');

ventana3.padre = ventana2.padre = ventana1.padre = raiz;

// Cambia la dimension minima de la ventana 1.
ventana1.cambiarDimensionMinima(200,200);

// Utiliza un objeto {w, h} para definir la dimensión minima de la ventana 2.
ventana2.dMinima = {w:200,h:200};  

// Cambia la dimensión minima de la ventana 3 utilizando un objeto Dimension.
ventana3.dMinima = new Dimension(200,200);

ventana1.abrir();
ventana2.abrir();
ventana3.abrir();

ventana1.lienzo.style.backgroundColor =
ventana2.lienzo.style.backgroundColor =
ventana3.lienzo.style.backgroundColor = '#00000077';
```
> Si quiere saber más sobre el objeto `Dimension`, revise la documentación de [nauty](https://www.npmjs.com/package/nauty).

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNms1bWYxenZnenRvamIwaGQ1M2p4OXAweGgzNXVob2M5MzF2bzlvZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/po45vKoGM9y762Vk3t/source.gif" alt="gif animado que muestra el resultado del codigo usado en el ejemplo de cambiarDimensionMinima"></a></p>

#### cambiarDimensionFija y dFija:

La función `cambiarDimensionFija` y la propiedad `dFija` permiten establecer una dimensión inmutable con la que la ventana estará limitada, además de desactivar el botón y el evento [maximizar](#maximizar). Solo se pueden utilizar `números` como parámetros.

`dFija` ofrece una alternativa para realizar esta tarea, aceptando un objeto `Dimension` o un objeto con las propiedades `{w, h}` para definir la dimensión. Además, retorna un objeto `Dimension` con la dimensión fija.

``` JavaScript
import Vanie from 'vanie';
import { Dimension } from "nauty";//npm i nauty

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('windows-claro');
const ventana3 = new Vanie('linux-oscuro');

ventana3.padre = ventana2.padre = ventana1.padre = raiz;

// Establece la dimensión fija de la ventana 1.
ventana1.cambiarDimensionFija(200,200);

// Utiliza un objeto {w, h} para definir la dimensión fija de la ventana 2.
ventana2.dFija = {w:200,h:200};

// Establece la dimensión fija de la ventana 3 utilizando un objeto Dimension.
ventana3.dFija = new Dimension(200,200);

ventana1.abrir();
ventana2.abrir();
ventana3.abrir();

ventana1.lienzo.style.backgroundColor =
ventana2.lienzo.style.backgroundColor =
ventana3.lienzo.style.backgroundColor = '#00000077';
```
> Si quiere saber más sobre el objeto `Dimension`, revise la documentación de [nauty](https://www.npmjs.com/package/nauty).

<p align="center"><a href="#"><img src="https://i.ibb.co/5nnnVGk/fija.jpg" alt="imagen que muestra el resultado del codigo usado en el ejemplo de cambiarDimensionFija"></a></p>

#### eliminarDimensionFija:

Esta función elimina la inmutabilidad de la dimensión de la ventana para permitir su redimensionamiento nuevamente.

``` JavaScript
ventana1.eliminarDimensionFija();
ventana2.eliminarDimensionFija();
ventana3.eliminarDimensionFija();
```

#### cambiarDimensionDelLienzo y dLienzo:

La función `cambiarDimensionDelLienzo` permite ajustar la dimensión de la ventana con respecto al tamaño del lienzo, con la opción adicional de hacerla inmutable. Los dos primeros parámetros solo admiten `números`, mientras que el último parámetro es opcional. Si se desea hacer la dimensión inmutable, se asigna `true`.  

La propiedad`dLienzo` ofrece una alternativa para realizar esta tarea, aceptando un objeto `Dimension` o un objeto con las propiedades `{w, h}` para definir el tamaño del liezo. Además, retorna un objeto `Dimension` con el ancho y la altura del lienzo.
> ⚠ La opción de inmutabilidad de esta función tiene MÁXIMA prioridad sobre otras funciones de redimensionamiento.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('windows-claro');

ventana2.padre = ventana1.padre = raiz;

ventana1.cargarURL('https://www.youtube.com/embed/GrG2-oX5z24?si=UPiNV_e5HOBdC7lE');
ventana2.cargarURL('https://www.youtube.com/embed/GrG2-oX5z24?si=UPiNV_e5HOBdC7lE');


const r16_9 = {w:720,h:(720 * 9)/16}; // Relación de aspecto 16:9.

ventana1.dLienzo = r16_9; // Cambiando la dimensión del lienzo.

// Cambiando la dimensión del lienzo y haciéndola inmutable.
ventana2.cambiarDimensionDelLienzo(r16_9.w, r16_9.h,true);

ventana1.abrir();
ventana2.abrir();
```
`cambiarDimensionDelLienzo(w, h, fijar)` : **w** modifica el ancho, **h** modifica la altura, **fijar** al aignarle `true`  la vuelve inmutable además de desactivar el botón y el evento [maximizar](#maximizar).

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3NkZTV2Z251ZmUxYWxmN2FnajAzOXF2eXo2dWNldTNnMTByYXJlcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/y2hIlE2w3akjFvJdGR/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo de cambiarDimensionDelLienzo"></a></p>

#### fijarDimensionDelLienzo:
`fijarDimensionDelLienzo(boolean)` permite tomar la dimensión actual del lienzo y hacerla inmutable en caso de asignar `true` como parámetro. Si se asigna `false`, el lienzo se vuelve mutable nuevamente.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');

const ventana1 = new Vanie('mac-oscuro');
const ventana2 = new Vanie('windows-claro');

ventana2.padre = ventana1.padre = raiz;

ventana1.cargarURL('https://www.youtube.com/embed/GrG2-oX5z24?si=UPiNV_e5HOBdC7lE');
ventana2.cargarURL('https://www.youtube.com/embed/GrG2-oX5z24?si=UPiNV_e5HOBdC7lE');

const r16_9 = {w:720,h:(720 * 9)/16};

// Cambiando la dimensión del lienzo.
ventana1.cambiarDimensionDelLienzo(r16_9.w, r16_9.h);

// Cambiando la dimensión del lienzo y haciéndola inmutable.
ventana2.cambiarDimensionDelLienzo(r16_9.w, r16_9.h,true);

// Vuelve inmutable el lienzo.
ventana1.fijarDimensionDelLienzo(true) 

ventana1.abrir();
ventana2.abrir();

// Remueve la inmutabilidad del lienzo.
ventana2.fijarDimensionDelLienzo(false) 
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDBudWNiM3JjbjZrNTU5ZnhsMjMzY2E2Y25rOHFmbHBoN214c3AwaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sc5Pw2ZxTpPdte2sbd/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo de fijaDimensionDelLienzo"></a></p>

#### redimensionar:
Redimensionar impide que se redimensione la ventana por parte del usuario asignado `false`, o vuelva a redimensionarse al asignar `true`.
``` JavaScript
import Vanie from 'vanie';

const ventana = new Vanie('linux-oscuro');
ventana.padre = document.body;
ventana.redimensionar(false);// bloquea la redimension.
vantana.redimensionar(true); // desbloquea la redimension.
ventana.abrir();
```
---
</br>

### Botones y Eventos

#### abrir:
Cumple varias tareas críticas como:
1. Permite la creación y visualización en pantalla de las ventanas.
2. Si la ventana está minimizada al ejecutar la función **abrir**, se restaurará a su estado anterior.
3. Si la ventana está visible en pantalla junto a otras ventanas al ejecutar **abrir**, tendrá el mismo efecto que la función [`subir`](#subir) colocándola por encima de las demás ventanas.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');

const ventana1 = new Vanie('linux-oscuro');
const ventana2 = new Vanie('windows-claro');

ventana2.padre = ventana1.padre = raiz;

ventana1.cargarURL('https://www.youtube.com/embed/GrG2-oX5z24?si=UPiNV_e5HOBdC7lE');

//Establece la posición de retorno al lugar donde se posiciona el botón cuando se minimiza.
ventana1.pRetorno = { 
    x: boton.getBoundingClientRect().left + boton.offsetWidth/2,
    y: boton.getBoundingClientRect().top
}

const r16_9 = {w:720,h:(720 * 9)/16};
ventana1.cambiarDimensionDelLienzo(r16_9.w, r16_9.h);

ventana2.abrir(); // Abre una ventana de apoyo.
ventana2.lienzo.style.backgroundColor = '#00000077';

// Al hacer clic en el botón, se construirá y mostrará en pantalla.
// Si está minimizado, se desminimizará.
// Si ya está en pantalla, se posicionará por encima de otras ventanas.
boton.addEventListener('click',ventana1.abrir);
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmx3YnFhdmU0YjZoNXp3OXVtcTh0dmhvanY1M2tma2hidGVobHhmYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pzgZr1jOaJjL4ZDmTv/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo de la función abrir"></a></p>


#### Evento abrir:

El evento abrir ejecutará una función que tú asignes únicamente en el momento en que la ventana se construya y se muestre en pantalla. No pasa ningún parámetro a la función otorgada.  

Este evento es útil para ejecutar acciones específicas tan pronto como una ventana se muestre en pantalla.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;

ventana1.pRetorno = {
    x: boton.getBoundingClientRect().left + boton.offsetWidth/2,
    y: boton.getBoundingClientRect().top
    }

let numDeVecesAbierta = 0;

// Ejecurara la funcion unicamente cuando la ventana sea construida y se muestre en pantalla.
ventana1.addEventListener('abrir',()=>{ 
    const color = { r: Math.random()*255, g: Math.random()*255, b: Math.random()*255}

    ventana1.lienzo.innerText = ++numDeVecesAbierta;
    ventana1.lienzo.style.color = `rgb(${255-color.r},${255-color.g},${255-color.b})`;
    ventana1.lienzo.style.fontSize = '120px';
    ventana1.lienzo.style.display = 'grid';
    ventana1.lienzo.style.placeContent = 'center';
    ventana1.lienzo.style.backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
    });

boton.addEventListener('click',ventana1.abrir);
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjRlNnZxZGF6bjd2aWZ5ejV5bjh3Mjd4a2s2YTQ1dHN0c3Uzam9oYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KWi4Q4G9h8fHjKB1o5/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo del evento abrir"></a></p>

#### animarApertura:
La función `animarApertura` permite controlar si se desea animar la apertura de la ventana o anular dicha animación. Si se asigna `false`, se cancela la animación de apertura; de lo contrario, se carga la animación predeterminada.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;

ventana1.pRetorno = {
    x: boton.getBoundingClientRect().left + boton.offsetWidth/2,
    y: boton.getBoundingClientRect().top
    }
ventana1.animarApertura(false);// false anula la animación de apertura de la ventana.
ventana1.abrir();

ventana1.addEventListener('abrir',()=>{
    ventana1.lienzo.style.backgroundColor = `#000000dd`;
    ventana1.animarApertura(true); // true carga la animación de apertura.
    });

boton.addEventListener('click',ventana1.abrir);
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXFtb3hweW1lYjNwdXZ1bGF0cTNqbGZiNXllNWt3emlzcWo3dm04byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6o7fnVDhhkdVsxKbqj/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo de la función animarApertura"></a></p>

#### ¿Por que anular la animacion de la ventana?
Al proporcionar esta funcionalidad, tienes el control sobre si deseas animar la apertura de la ventana o si prefieres que se abra de manera instantánea. Esto puede ser útil, por ejemplo, si deseas evitar una animación en una ventana que ya está abierta desde el principio.

#### minimizar:

El **boton** y la **función** `minimizar` tienen la capacidad de transformar la ventana: 
+ Si la ventana está visible, la escala hasta que desaparece de la vista del usuario.
+ Si la ventana está minimizada, la devuelve a su estado anterior.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;
ventana1.abrir();

ventana1.lienzo.style.backgroundColor = `#000000dd`;

ventana1.pRetorno = {
    x: boton.getBoundingClientRect().left + boton.offsetWidth/2,
    y: boton.getBoundingClientRect().top
    }
/* Si la ventana está visible, la transforma para desaparecerla de la vista del usuario; 
de lo contrario, la devuelve a su estado anterior.*/
boton.addEventListener('click',ventana1.minimizar); 
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2kyMXhjY3hqanBmNnY1MWZ2ajA5ZzgyN2h6dmF2OTd5cGRoNXU1OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTAK4Okb5KdzDyPQ0P/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo de la función minimizar"></a></p>

#### Evento minimizar:
El evento minimizar ejecutará una función que tú asignes únicamente en el momento en que la ventana se minimice o desminimize. Pasa como argumento a la función un booleano: `true` si la ventana se ha minimizado y `false` si ha regresado a su estado anterior.  

Es útil para ejecutar acciones específicas tan pronto como una ventana se termine de minimizar o desminimizar.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;
ventana1.abrir();

ventana1.lienzo.style.backgroundColor = `#000000dd`;

ventana1.pRetorno = {
    x: boton.getBoundingClientRect().left + boton.offsetWidth/2,
    y: boton.getBoundingClientRect().top
    }

ventana1.addEventListener('minimizar',seMinimizo=>{ 
// La función se ejecutará únicamente cuando la ventana se haya terminado de minimizar o desminimizar.
    if(seMinimizo){
        boton.style.transform = 'scale(1.4) rotate(360deg)';
    }
    else 
        boton.style.transform = '';
    });

boton.style.transition = 'transform .5s ease';
boton.addEventListener('click',ventana1.minimizar);
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzhnZTFkN2VoMnVibnAwcDllcHk5M3Y3dWNtb3lzZmYzNWNveGM1dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8nYIUdUbWqQeT5p32i/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo del evento minimizar"></a></p>

#### maximizar:

El **botón** y la **función** maximizar tienen la capacidad de modificar la dimensión de la ventana:
+ Si la ventana está visible, la dimensiona al 100% del tamaño del contendor padre.
+ Si la ventana está maximizada, la devuelve a su tamaño anterior.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;
ventana1.abrir();

ventana1.lienzo.style.backgroundColor = `#059b9add`;

/* Si la ventana está visible, la dimensiona al 100% del tamaño del contenedor padre; 
de lo contrario, la devuelve a su tamaño anterior.*/
boton.addEventListener('click',ventana1.maximizar);
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmRhZTR3cjI2dGQwOGJjbmV5MXpxMmYyNzRtcDJrZDVvdW1lbjJleiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/n4mB7vSvvPTVitEY2i/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo de la función maximizar"></a></p>

#### Evento maximizar:

Ejecutará una función que asignes únicamente en el momento en que la ventana se maximice o desmaximice.  
Pasa como argumento a la función un booleano: `true` si la ventana se ha maximizado y `false` si ha regresado a su tamaño anterior.  

Es útil para ejecutar acciones específicas tan pronto como una ventana se maximice o desmaximice.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');
const barra = document.getElementById('barra');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;
ventana1.abrir();

ventana1.lienzo.style.backgroundColor = `#059b9add`;

ventana1.addEventListener('maximizar', seMaximizo=>{
// La función se ejecutará únicamente cuando la ventana se maximiza o desmaximiza.
    if(seMaximizo){
        barra.style.opacity = '0';
        barra.style.pointerEvents = 'none';
    }
    else{
        barra.style.opacity = '';
        barra.style.pointerEvents = '';
    }
});
boton.style.transition = 'transform .5s ease';
boton.addEventListener('click',ventana1.maximizar);
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXZjaHkwZjR1Zzlsbnd6OXUyMTdoZWN2bmd0ejJ3dmRxbWEyM29scyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NXWHpedVbGBXtOlw0h/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo del evento maximizar"></a></p>

#### cerrar:

El **botón** y la **función** cerrar, cierra la ventana:

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;
ventana1.abrir();

ventana1.lienzo.style.backgroundColor = `#059b9add`;

boton.addEventListener('click',ventana1.cerrar);// Cierra la ventana
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHlyMnBpNjRqdnVucWVrcWtoNHFqZm1hN2xpczl0NmVzeDVzOHoyMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g5jIQlVOgggNWqWvH8/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo de la función cerrar"></a></p>

#### Evento cerrar:

El evento cerrar ejecutará una función que asignes únicamente en el momento en que la ventana se cierre. No pasa ningún parámetro a la función otorgada.  

Este evento te brinda la oportunidad de ejecutar acciones específicas inmediatamente después de que una ventana se cierre. Puedes aprovecharlo para realizar tareas como ocultar elementos de la interfaz o realizar limpieza de recursos.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;
ventana1.abrir();

ventana1.lienzo.style.backgroundColor = `#059b9add`;

ventana1.addEventListener('cerrar', ()=>{
// La función se ejecutará únicamente cuando la ventana se cierre.
    boton.style.opacity = '0';
    boton.style.pointerEvents = 'none';
    });

boton.style.transition = 'transform .5s ease';
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXBuNzhkeXo4aW83NHRlOWR0d2dtemY4bHd1Z3AxejFwMHI2OXB6MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3UfdAxUthuZ7WIQDTo/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo del evento cerrar"></a></p>

#### eliminarAlCerrar:
La función `eliminarAlCerrar` te brinda el control sobre si deseas mantener las configuraciones y elementos guardados al cerrar la ventana o eliminarlos por completo  

Si se asigna `false`, se mantendrán las configuraciones y elementos al cerrar la ventana; de lo contrario, se eliminarán las configuraciones previamente establecidas en los elementos de la [ventana](#estructura).
> Por defecto todas las ventanas eliminan su contenido.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;
ventana1.abrir();

/* Las configuraciones y elementos se mantendrán al momento de cerrar; 
solo se oculta la ventana y no se elimina.*/
ventana1.eliminarAlCerrar(false); 

ventana1.lienzo.style.backgroundColor = `#059b9add`;

boton.addEventListener('click',ventana1.abrir);
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGM4MG1pYXRjcmNpdmdzMTA2c2M4MzN3YjNqZnpmMTRidDYxcXg4eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UrbpjxQdXxSPUL1b6N/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo de la función eliminarAlCerrar"></a></p>

#### ¿Por qué usar eliminarAlCerrar?
Al proporcionar esta funcionalidad, tienes el control sobre si deseas mantener los elementos de la ventana ocultos o eliminarlos por completo al cerrarla. Considera los pros y contras para decidir si esta función se adapta a tu proyecto.  

**Pros:**
+ Mantener los elementos ocultos aseguras la [persistencia](#persistencia) en las configuraciones y los elementos sin importar el método que uses para asignarlos a la [estructura](#estructura) de la ventana.
+ La posición y dimensión al momento de **cerrar** serán el punto de partida al momento de **abrir**. 
+ Las configuraciones o estados que el usuario haya hecho dentro del contenido de la ventana se mantendrán. 

**Contras:**
+ Si existen demasiados elementos con esta función activa, puede afectar el rendimiento, ya que cuanto más elementos haya, también habrá más eventos.
+ No se puede garantizar la animación de la apertura, ya que el estado donde `cerro` será el estado donde se `abrira`.
+ Si bien usted es el encargado de hacer que su proyecto sea o no responsivo, usar esta función puede hacer más complejo su trabajo.
+ Todas las configuraciones o estados que el usuario haya hecho se mantendrán, pero en elementos interactivos como videos o juegos quizás esto no sea tan buena idea, ya que estas estarán corriendo por detrás sin que el usuario tenga forma de detenerlos al momento de `cerrar` a menos que abra la ventana y lo detengan por los medios que usted haya proporcionado o sea usted mismo se encarge de configurar el [Evento cerrar](#evento-cerrar) para detener este tipo de contenido.

</br>

#### media:
La **función** `media` tiene la capacidad de ajustar la dimensión de la ventana de la siguiente manera:
+ Si la ventana está visible, la dimensiona al **50%** del tamaño del contenedor padre, posicionándose a la derecha o izquierda según lo definas.
+ Si la ventana ya fue modificada por esta función, la devuelve a su tamaño anterior.

`media(string)` : **'der'** a la derecha, **'izq'** a la izquierda.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const botonIzq = document.getElementById('btn-izq');
const botonDer = document.getElementById('btn-der');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;
ventana1.abrir();

ventana1.lienzo.style.backgroundColor = `#059b9add`;

botonDer.addEventListener('click',()=>{
/* modifica el tamaño de la ventana al 50% del contendor y lo posiciona a la derecha, 
si ya esta aplicado la devuelve a su tamaño anterior.*/
    ventana1.media('der'); 
});
botonIzq.addEventListener('click',()=>{
/* modifica el tamaño de la ventana al 50% del contendor y lo posiciona a la izquierda, 
si ya esta aplicado la devuelve a su tamaño anterior.*/
    ventana1.media('izq'); 
});
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjE3ZTcwcmJ0ZWpucGp3Yms5bmViaW12Z2dzOG1icjAwb3ZkM2h3bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/U2KxdxfKPJCZwYTZc0/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo de la función media"></a></p>

#### Evento media:
El evento media ejecutará una función que asignes únicamente cuando la ventana se posicione a un lado del contenedor con un tamaño del 50%. Pasa un objeto con los parámetros {lado, estado} a la función otorgada.  

`lado` : Retorna el lado donde se posiciona la ventana; `'izq'` = izquierda, `'der'` = derecha.  
`estado` : Retorna un booleano con el estado del evento; `true` = se ha aplicado media, `false` = regresa a su estado anterior.

Este evento te brinda la oportunidad de ejecutar acciones específicas inmediatamente cuando la ventana se posicione a un lado y se redimensione al 50%.

``` JavaScript
import Vanie from 'vanie';

const raiz = document.getElementById('raiz');
const botonIzq = document.getElementById('btn-izq');
const botonDer = document.getElementById('btn-der');

const ventana1 = new Vanie('windows-claro');

ventana1.padre = raiz;
ventana1.abrir();
const colorOriginal = `#059b9add`
ventana1.lienzo.style.backgroundColor = colorOriginal;

// Ejecutar la función cuando la ventana emita el evento media.
ventana1.addEventListener('media',data=>{
    if(data.estado){
        if(data.lado == 'izq')
        // Amarillo si está a la izquierda.
            ventana1.lienzo.style.backgroundColor = `#fdec6fdd`; 
        else
        // Naranja si está a la derecha.
            ventana1.lienzo.style.backgroundColor = `#ff6e49dd`; 
    }
    else
        // Restablecer el color de fondo original.
        ventana1.lienzo.style.backgroundColor = colorOriginal;
});

botonDer.addEventListener('click',()=>{
    ventana1.media('der');
});
botonIzq.addEventListener('click',()=>{
    ventana1.media('izq');
});
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDJiaHlod3BiOGFtM2Nxb2JtanllaXBsOXQ3Y3Q2ZGFzYW51aXJzaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FX5ODZIvUn9i7ehUcK/source.gif"alt="gif animado que muestra el resultado del codigo usado en el ejemplo evento media"></a></p>

#### removeEventListener:
Si deseas desvincular una función específica de un **evento** , puedes utilizar la función `removeEventListener`, a la cual le asignas el nombre del evento y la referencia de la función que deseas eliminar.

``` JavaScript
instanciaVanie.removeEventListener('abrir',funcion_Abrir);
instanciaVanie.removeEventListener('minimizar',funcion_Minimizar);
instanciaVanie.removeEventListener('maximizar',funcion_Maximizar);
instanciaVanie.removeEventListener('cerrar',funcion_Cerrar);
instanciaVanie.removeEventListener('media',funcion_Media);
```
---
</br>

### Gestos

Las ventanas creadas con **Vanie** vienen equipadas con gestos que simplifican el uso de las funciones `maximizar` y `media`:
 + `maximizar`: Si arrastras la ventana hacia la parte superior, se maximiza automáticamente.  
 También puedes hacer **doble clic** sobre la barra de título para lograr el mismo efecto.  

 + `media` : Arrastrar la ventana hacia la derecha o izquierda la redimensionará automáticamente para ocupar la mitad de la pantalla.
 + **Volver al tamaño original**: Si ya has maximizado o aplicado media a la ventana, y deseas regresar a su tamaño original, simplemente arrástrala hacia el centro del contenedor padre, y recuperará su tamaño anterior.

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemxlOTN5OXlvdDJmbGNyN2p1dGN3MXpucTduaXQ3YTBqMjF3b2lyZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zuuc9zjIBqkavROvQF/source.gif"alt="gif animado que muestra el resultado de los gestos"></a></p>

---
</br>



### Modificar estilos

**Vanie** ofrece seis estilos predefinidos que puedes utilizar especificando su nombre o seleccionándolos de la lista de la variable global [glovalVanie](#globalvenie)**.estilosPredeterminados**, Estos estilos son: `'windows-claro'` , `'windows-oscuro'` , `'linux-claro'` , `'linux-oscuro'` , `'mac-claro'` y `'mac-oscuro'`.  

Además, **Vanie** permite personalizar las ventanas creando un objeto con las siguientes propiedades: 

``` JavaScript
import Vanie from 'vanie';
// Creando un objeto con los estilos de las ventanas de Windows XP.
const windowsXp = {
    // data posee la información más básica del estilo.
    data : {
        /*Nombre con el que será llamado el estilo. 
        El nombre no puede repetirse, así que elija con cuidado.*/
        nombre: "xp",
        // La altura que tendrá la barra. Este parámetro es importante. No asignarlo, podría generar un error.
        alturaBarra: 25,
        //indica si tendrá bordes redondeados en la parte superior.
        radioSup: true,
        //indica si toda la ventana tendrá bordes redondeados.
        radio: false,
        // Indica si los botones estarán posicionados a la izquierda.
        posIzq: false
        },
    // elemento a modificar: vaya a la sección estructura para tener una idea más clara de lo que está modificando.
    ventana: {
        /*clase con la que se identificará el elemento en cuestión.
        Por recomendación, asigné el nombre seguido del elemento al que pertenece.*/
        class: "xp--ventana",
        // Si a css se le asigna un string con el estilo, se modifica el estilo del elemento en cuestión.
        css: "border: 3px solid #0831d9;"
      },
    // barra es el elemento que contiene la cabecera el icono y los botones
    barra: {
        class: "xp--barra",
        css: `
            background-color:#0831d9;
            background-image: linear-gradient(to bottom, #2c91ff 5%, #ffffff33 1%,#0831d9 30%,#0831d9 80%, #14387f);
            text-shadow: rgb(0, 0, 0) 1px 1px; 
            color: white; 
            font-size: 14px;
            font-weight: 600;
            font-family: "Helvetica";`
      },
    // El elemento que contendrá el icono si usted lo asigna.
    ico: {
        class: "xp--ico",
        css:`
            display:flex;
            justify-content:center;
            align-items:center;`
      },
    // elemento que contendrá el título o los elementos que usted desee.
    cabecera: {
        class: "xp--cabecera"
      },

    // Botón minimizar.
    minimizar: {
        class: "xp--minimizar",
        /*Cuando a css se le asigna un objeto, este debe contener al menos uno de 4 parámetros:
        
        Estilo: modifica el elemento en cuestión.

        hover: modifica el hover del elemento.

        active: modifica el estado active del elemento.

        directo: te da la libertad de modificar tanto elementos hijos como subclases del elemento,
        así que no se te olvide poner llaves.*/
        css:{
            estilo:'position:relative;',
            directo:`::before{
                content: "";
                position: absolute;
                left: 4px;
                top: 13px;
                height: 3px;
                width: 8px;
                background-color: white;}`
        }
      },
    //Botón maximizar
    maximizar: {
        class: "xp--maximizar",
        css:{
            estilo:'position:relative;',
            directo:`::before{
                content: "";
                position: absolute;
                display: block;
                left: 4px;
                top: 4px;
                box-shadow: white 0px 3px inset, white 0px 0px 0px 1px inset;
                height: 12px;
                width: 12px;}`
            }
        },
    //Botón cerrar
    cerrar: {
        class: "xp--cerrar",
        /*
        Esta propiedad es única de los botones.

        contenido: permite asignarle un contenido a los botones
        ya sea un innerHtml con la imagen del botón requerido, alguna letra o emoji
        o en este caso el svg del botón predeterminado usando [ -p ] 
        seguido del color que se desea [ #fff ] y por 
        ultimo el tamaño que puede escribir como [ 20 ] para indicar un cuadrado 
        o puede hacerlo como [ 20 20 ] que serían su ancho y alto.
        
        Todos los botones poseen svg predeterminados, pero
        solo maximizar posee 2 predeterminados a los cuales puede acceder usando [ -p ] 
        o [ --p ] para su segunda versión predeterminada*/
        contenido: "-p #fff 20",
        css: `
            background-color: rgb(218, 70, 0);
            box-shadow: rgb(218, 70, 0) 0px -1px 2px 1px inset;
            background-image: radial-gradient(circle at 90% 90%, rgb(204, 70, 0) 0%, rgb(220, 101, 39) 55%, rgb(205, 117, 70) 70%, rgb(255, 204, 178) 90%, white 100%);`
        },
    // lienzo
    lienzo: {
        // El lienzo no requiere estilos, por lo que no necesita declarar el parámetro css
        class: "xp--lienzo"
        },
    /* este elemento es el marco que aparece cuando realiza los gestos al arrastrar la ventana.
    trate de evitar poner el elemento css las propiedades {hover,active,directo}, ya que no son ocupadas */
    marco: {
        class: "xp--marco",
        css: `
            border-radius: 10px;
            background-color:#cad4ff77;
            background-color:#43a24277; 
            border:3px solid #3c81f3;`
        },
    //esta propiedad modifica todos los botones a la vez.
    botones: {
        class: "xp--botones",
        //información de los botones.
        data: {
            /*w Asigné aquí el ancho del botón con un número obligatoriamente,
            ya que si no lo hace generará un error.*/
            w: 22,
            /*h Asigne aquí la altura del botón con un número o el string con el porcentaje, 
            ya que si no lo hace, generará un error.*/
            h: 22,
            // El espacio entre botones, si no desea ningún espacio, asigne 0.
            espacio: 1,
            /* aquí define el orden que tendrán los botones, por favor evite repetir algún botón, 
            ya que podría generar un error.*/
            distribucion: ["minimizar","maximizar","cerrar"]
        },
        /* estilo de todos los botones
        no se preocupe por la alineación de los botones, ya que se hace de forma automática, 
        por lo que no necesita modificar la propiedad display.*/
        css: {
            estilo: `
                border: 1px solid white;
                border-radius: 4px;
                background-image: radial-gradient(circle at 0% 0%, #ffffffdd 0%, #ffffff33 40%, transparent);`,
            hover: `
                box-shadow: #ffffff33 0px 2px 2px 10px inset;`
        }
      }
    }

const raiz = document.getElementById('raiz');
// Asignando el nuevo estilo al constructor
const ventana1 = new Vanie(windowsXp);
ventana1.padre = raiz;

const logoXP = new Image(17,17);
logoXP.setAttribute('src','https://cdn.icon-icons.com/icons2/5/PNG/256/windows_284.png');
logoXP.style.marginInline = '5px';

ventana1.ico = logoXP;

ventana1.titulo = 'Mi ventana xp';

ventana1.abrir();
ventana1.lienzo.style.backgroundColor = `#ccc`;
```
<p align="center"><a href="#"><img src="https://i.ibb.co/pw1PJ6P/xp.jpg"alt="imagen que muestra el resultado de los estilos personalizados"></a></p>

#### asignando estilos:

Una regla importante en las instancias **Vanie** es que si no se ha asignado ningún estilo previamente a ninguna ventana, el primer estilo que se asigne al constructor Vanie se establecerá como el estilo por defecto. Las siguientes instancias no necesitarán especificar el estilo.

``` JavaScript
import Vanie from 'vanie';

const windowsXp = {/*codigo del estilo*/}

const raiz = document.getElementById('raiz');
// Asignando el nuevo estilo al constructor
const ventana1 = new Vanie(windowsXp);
ventana1.padre = raiz;

const logoXP = new Image(17,17);
logoXP.setAttribute('src','https://cdn.icon-icons.com/icons2/5/PNG/256/windows_284.png');
logoXP.style.marginInline = '5px';

ventana1.ico = logoXP;

ventana1.titulo = 'Mi ventana xp';

ventana1.abrir();
ventana1.lienzo.style.backgroundColor = `#ccc`;

// Generando 4 ventanas nuevas.
for(let i = 0; i < 4; i++){
    const nuevaVentana = new Vanie;
    nuevaVentana.padre = raiz;
    nuevaVentana.ico = logoXP.cloneNode();
    nuevaVentana.abrir();
    nuevaVentana.lienzo.style.backgroundColor = `#ccc`;}
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ21ncTkwN3ZveDdranNobmEyZjkyYjVidjF2eTN0eXE2dzJyd3Q1dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NQp1yrLZBEztyxo11X/source.gif"alt="gif animado que muestra el resultado de los estilos"></a></p>

#### estilos globales:

Antes de continuar con las siguientes funciones, es necesario entender las funciones [**establecerBase**](#establecerbase) y [**agregarEstilo**](#agregarestilo) de la instancia global [`globalVanie`](#globalvenie).  

¿Para que funcionan?   
Estas funciones permiten almacenar los estilos de forma global para que cualquier instancia **Vanie** pueda usarlas, sin importar dónde sean declaradas.  

[**establecerBase**](#establecerbase) : Establece un estilo base, es decir, un estilo predeterminado que todas las instancias **Vanie** tendrán al momento de ser creadas sin necesidad de declarar el estilo explícitamente.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const windowsXp = {/*codigo del estilo*/}

const raiz = document.getElementById('raiz');
// Se establece el estilo windowsXp como estilo predeterminado.
globalVanie.establecerBase(windowsXp);

const ventana1 = new Vanie;
ventana1.padre = raiz;

ventana1.abrir();
```
<p align="center"><a href="#"><img src="https://i.ibb.co/2FJqZmy/xp-mini.jpg"alt="imagen que muestra el resultado de globalVanie.establecerBase"></a></p>

[**agregarEstilo**](#agregarestilo) : Agrega un estilo a la lista de estilos para que pueda ser usado por las instancias que lo necesiten, llamándolo por el nombre del estilo.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const windowsXp = {
    data : {
        nombre: "xp"
        /*... el resto del codigo para el estilo windows xp*/},}

const raiz = document.getElementById('raiz');

// Se establece el estilo predeterminado
globalVanie.establecerBase('linux-oscuro');

// Se agrega el nuevo estilo de forma global
globalVanie.agregarEstilo(windowsXp);

// Ventana con el estilo predeterminado
const ventana1 = new Vanie;

// Ventana con el estilo windowsXp
const ventana2 = new Vanie('xp');  
ventana1.padre = ventana2.padre = raiz;

ventana2.abrir();
ventana1.abrir();
```

<p align="center"><a href="#"><img src="https://i.ibb.co/HgqfYkw/linuxp.jpg"alt="imagen que muestra el resultado de globalVanie.agregarEstilo"></a></p>

> Vaya a la seccion de [globalVanie](#globalvenie) para conocer mas sobre esta instancia y sus funciones.

Continuando con las funciones de Vanie: 

#### cambiarEstiloBase:
`cambiarEstiloBase` le permite cambiar el estilo predeterminado por otro, con la diferencia de que este estilo no podrá ser cambiado por la instancia global [globalVanie](#globalvenie).  

Por defecto, si asigna el estilo directamente en el constructor, se asumirá que este será el `Estilo Base`.
``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const windowsXp = {
    data : {
        nombre: "xp"
        /*... el resto del codigo para el estilo windows xp*/},}

const raiz = document.getElementById('raiz');
const btnCambiarEstilo = document.getElementById('btn');

// Se establece el estilo predeterminado
globalVanie.establecerBase('linux-oscuro');

// Se agrega el nuevo estilo de forma global
globalVanie.agregarEstilo(windowsXp);  

const ventana1 = new Vanie;
const ventana2 = new Vanie;
ventana2.padre = ventana1.padre = raiz;

// Al abrir la ventana, tendrá un botón que le permitirá cambiar su estilo.
ventana1.addEventListener('abrir',()=>{
    const boton = document.createElement('buttom');
    boton.style.padding = '10px';
    boton.style.fontSize = '20px';
    boton.style.backgroundColor= '#fd8'
    boton.innerText = 'cambiar al estilo xp'
    ventana1.lienzoAgrega(boton);
    ventana1.lienzo.style.backgroundColor = '#ccc';
    ventana1.lienzo.style.display = 'grid';
    ventana1.lienzo.style.placeContent = 'center';

    boton.addEventListener('click',()=>{
// Cambia el estilo predeterminado de la ventana, este estilo no puede ser modificado por globalVanie.
        ventana1.cambiarEstiloBase('xp'); 
    });
});

ventana2.abrir();
ventana1.abrir();

btnCambiarEstilo.addEventListener('click',()=>{
// Cambia el estilo predeterminado de las ventanas.
    globalVanie.establecerBase('mac-claro'); 
});
```

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGhqNDRtaTkxNXYweThqbHVzZ3ZhcXoyZWtpNWx4MjA4dnIzMGxubCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qCb3LQaJHPLem1CbGP/source.gif"alt="gif animado que muestra el resultado de cambiarEstilo"></a></p>

#### cambiarEstilo: 

`cambiarEstilo` le permite cambiar el estilo por otro con la diferencia de que este estilo puede ser cambiado por la instancia global [globalVanie](#globalvenie).

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const windowsXp = {
    data : {
        nombre: "xp"
        /*... el resto del codigo para el estilo windows xp*/},}

const raiz = document.getElementById('raiz');
const btnCambiarEstilo = document.getElementById('btn');

// Se establece el estilo predeterminado
globalVanie.establecerBase('linux-oscuro');

// Se agrega el nuevo estilo de forma global.
globalVanie.agregarEstilo(windowsXp);

const ventana1 = new Vanie;
const ventana2 = new Vanie;
ventana2.padre = ventana1.padre = raiz;

// Al abrir la ventana, tendrá un botón que le permitirá cambiar su estilo.
ventana1.addEventListener('abrir',()=>{
    const boton = document.createElement('buttom');
    boton.style.padding = '10px';
    boton.style.fontSize = '20px';
    boton.style.backgroundColor= '#fd8'
    boton.innerText = 'cambiar al estilo xp'
    ventana1.lienzoAgrega(boton);
    ventana1.lienzo.style.backgroundColor = '#ccc';
    ventana1.lienzo.style.display = 'grid';
    ventana1.lienzo.style.placeContent = 'center';

    boton.addEventListener('click',()=>{
        // Cambia el estilo de la ventana. Este estilo puede ser modificado por globalVanie.
        ventana1.cambiarEstilo('xp'); 
    });
});

ventana2.abrir();
ventana1.abrir();

btnCambiarEstilo.addEventListener('click',()=>{
    // Cambia el estilo predeterminado de las ventanas.
    globalVanie.establecerBase('mac-claro'); 
});
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWhyN2FiMG56aWRldDdrMno3aHJnazY2MHh6bGdkZnVtNjloMTI3YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cVleozVhjrGyLege7b/source.gif"alt="gif animado que muestra el resultado de cambiarEstilo"></a></p>

#### estilo: 
La propiedad estilo retorna el string con el nombre del estilo que posee la ventana actualmente.  

---
</br>

### Validadores

Los validadores son un conjunto de propiedades que te permiten conocer el estado actual de las ventanas creadas con **Vanie**. 

+ **`estaCostruido`**: Devuelve `true` si la ventana se ha construido con éxito, y `false` si ha surgido algún error durante el proceso.  

+ **`estaAbierto`**: Retorna `true` si la ventana se ha creado exitosamente y está operativa, independientemente de si es visible en pantalla o no. Retorna `false` si la ventana está cerrada o no se ha creado correctamente.  

+ **`esVisible`**: Devuelve `true` si la ventana está siendo mostrada en pantalla, y `false` si está oculta.  

+ **`estaCerrado`**: Retorna `true` si la ventana está cerrada, y `false` si está abierta.  

+ **`estaMinimizado`**: Retorna `true` si la ventana está minimizada, y `false` si no lo está.  

+ **`estaMaximizado`**: Retorna `true` si la ventana está maximizada, y `false` si no lo está..  

+ **`estaDividido`**: Retorna `true` si la ventana está posicionada en un lado de la pantalla ocupando el **50%** de su ancho, y `false` si no lo está.  

+ **`esSuperior`**: Indica si la ventana está por encima de todas las demás ventanas en pantalla. Retorna `true` si es así, y `false` si no lo es.  

+ **`btnAlaIzq`**:  Retorna `true` si los botones de control (minimizar, maximizar, cerrar) están ubicados en el lado izquierdo de la ventana, y `false` si están en el lado derecho.  

+ **`btnAlaDer`**:  Retorna `true` si los botones de control están ubicados en el lado derecho de la ventana, y `false` si están en el lado izquierdo.  

+ **`seMueve`**: Retorna `true` si la ventana está siendo arrastrada, y `false` si no lo está. Esta propiedad se actualiza en tiempo real y requiere monitoreo constante, por ejemplo, mediante el **evento `'mousemove'`**.  

+ **`seRedimensiona`**:  Retorna `true` si la ventana está siendo redimensionada con el puntero del mouse, y `false` si no lo está. Al igual que *seMueve*, esta propiedad se actualiza en tiempo real y requiere monitoreo constante, por ejemplo, mediante el **evento `'mousemove'`**.  
---
</br>


### Configuraciones
Los configuradores son una serie de propiedades y funciones que como el titulo indica su objetivo es hacer una configuracion mas detallada de las ventanas creadas con **Vanie**.

#### opacidad:
La propiedada opacidad permite modificar la opacidad de la ventana, asi mismo devuelve la opcidad de la ventana si se ha asignado. Esta propiedad solo funciona si la ventana en cuestion se ha construido exitosamente usando la funcion [`abrir`](#abrir).
``` JavaScript
import Vanie from 'vanie';

const ventana = new Vanie('windows-claro');
ventana.padre = document.body;
ventana.abrir();
ventana.opacidad = 0;
console.log(ventana.opacidad);
```

</br>

#### identificador:
esta propiedad le permite asignar y retornar un identificador a su ventana el cual puede ser bastante util al momento de distinguir una ventana de otra.  
los parametros validos son `strings` y `numeros`
``` JavaScript
import Vanie from 'vanie';

const ventana = new Vanie('linux-oscuro');
ventana.padre = document.body;
ventana.identificador = 'venatana-1';
console.log(ventana.identificador);
ventana.abrir();
```

</br>

#### desconectarseDelGestor:
Todas las ventanas creadas con **Vanie** son añadidas a un gestor global llamado [globalVanie](#globalvenie), que registra el comportamiento de cada una de ellas. Esto facilita la coordinación de acciones entre ventanas y su contenedor padre.  
Sin embargo, surge un problema cuando las ventanas tienen diferentes contenedores padres, lo que puede aumentar la complejidad y causar conflictos en el diseño. Aquí es donde entra en juego la función desconectarseDelGestor. 

#### ¿Pero como saber cuando usarla?
Si bien no es posible proveer el tipo de complicaciones que tendrá su diseño para usar esta función, aquí tiene un ejemplo de una ventana dentro de otra ventana, un caso un poco curioso, pero que demuestra un posible uso.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';
import { Dimension } from "nauty";//npm i nauty

const raiz = document.getElementById('raiz');
const contador = document.getElementById('contador');
const boton = document.getElementById('btn');

const linux_ventana = new Vanie('linux-oscuro');
const windows_ventana = new Vanie('windows-claro');
// Para saber más, vaya a la sección globalVanie
globalVanie.addEventListener('vista',ventana=>{
    // Informa sobre el número de ventanas mostradas en pantalla.
    contador.innerText = 'ventanas en pantalla: ' + ventana.visibles; 

    });

linux_ventana.padre = raiz;
const dimension = new Dimension;
dimension.bNuevo('80%', '80%');

linux_ventana.dApertura = dimension;

linux_ventana.addEventListener('abrir',()=>{
    linux_ventana.lienzo.style.backgroundColor = `#059b9add`;

// windows_ventana se alojara dentro de la ventana linux_ventana.
    windows_ventana.padre = linux_ventana.lienzo; 
    windows_ventana.dApertura = dimension;
    windows_ventana.abrir();
    windows_ventana.lienzo.style.backgroundColor = `#ff6e49dd`});

// al cerrar linux_ventana llamara la funcion cerrar de windows_ventana.
linux_ventana.addEventListener('cerrar',windows_ventana.cerrar);

linux_ventana.abrir();
boton.addEventListener('click', linux_ventana.abrir);
```
> Si quiere saber más sobre el objeto `Dimension`, revise la documentación de [nauty](https://www.npmjs.com/package/nauty).

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODFocTl3YXhrNWU2OGJ5aGN2cjI2Y25tMWdkYXI0d2c4Mmd4NGcxMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KS5xjggpOh9gsq6zbZ/source.gif"alt="gif animado que muestra el resultado del codigo de una ventana dentro de otra"></a></p>

Como se habrá percatado, existe un error, ya que al cerrar linux_ventana y al volverla abrir, windows_ventana no se abre hasta cerrar y abrir linux_ventana nuevamente.  

Esto ocurre por qué a la recta final de la llamada del [evento cerrar](#evento-cerrar) de linux_ventanta es llamada la función cerrar de windows_ventana que comienza a emitir la señal de cerrar, pero cuando el evento cerrar de linux_ventana ya ha finalizado interrumpe el evento cerrar de windows_ventana, y solo al momento de cerrar linux_ventana nuevamente se completa el proceso desde el punto donde se quedó el cerrado de windows_ventana.  

Para solucionar este primer problema, puede usar la función [eliminar](#eliminar).

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWNuOWxhMnhtd3ExZ2I4eG5lejR1cDQ5OTJzaWt5NWg2a3R6c3BweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8AFGhl3rhEmFQ87zr6/source.gif"alt="gif animado que muestra el resultado de la solucion del codigo de una ventana dentro de otra"></a></p>

``` JavaScript
// al cerrar linux_ventana eliminara directamente windows_ventana.
linux_ventana.addEventListener('cerrar',windows_ventana.eliminar);
```
Si bien esto soluciona el problema del cerrado de windows_ventana esto genera un nuevo problema y es que cuando [globalVanie](#globalvenie) emite la señal de ventanas visible no detecta que windows_ventana se ha eliminado y asume que se ha abierto una nueva ventana.  
Esto se debe a que la función [eliminar](#eliminar) cuando quiere emitir una señal a globalVanie de que la ventana se ha cerrado se encuentra que el contenedor padre ha sido eliminado, *`"recordar que las ventanas destruyen su contenido"`* por lo que asume que esa señal ha sido enviada.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');
const contador = document.getElementById('contador');
const boton = document.getElementById('btn');

const linux_ventana = new Vanie('linux-oscuro');
const windows_ventana = new Vanie('windows-claro');

// Se desconecta del gestor global por lo que su comportamiento sera ignorado por las demas ventanas y globalVanie.
windows_ventana.desconectarseDelGestor();

// Para saber mas vaya a la seccion globalVanie
globalVanie.addEventListener('vista',ventana=>{
    //informa sobre el numero de ventanas mostradas en pantalla.
    contador.innerText = 'ventanas en pantalla: ' + ventana.visibles;  
    });

linux_ventana.padre = raiz;

const dimension = {w:'80%',h:'80%'}
linux_ventana.dApertura = dimension;

linux_ventana.addEventListener('abrir',()=>{
    linux_ventana.lienzo.style.backgroundColor = `#059b9add`;

// windows_ventana se alojara dentro de la ventana linux_ventana.
    windows_ventana.padre = linux_ventana.lienzo; 
    windows_ventana.dApertura = dimension;
    windows_ventana.abrir();
    windows_ventana.lienzo.style.backgroundColor = `#ff6e49dd`});

// al cerrar linux_ventana eliminara directamente windows_ventana.
linux_ventana.addEventListener('cerrar',windows_ventana.eliminar);

linux_ventana.abrir();
boton.addEventListener('click', linux_ventana.abrir);
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM21hY3Z6Z200NmU4YWFvZXJkNnJ1YmttcnFoeGs5OTJycTdweTVsaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xnatQAlyYunbYfuS1k/source.gif"alt="gif animado que muestra el resultado de la solucion del ejemplo desconectarseDelGestor"></a></p>

Con esto `windows_ventana` se desconecta del gestor global y se excluye de las interacciones con otras ventanas. En este ejemplo resulta conveniente, ya que solo hay una ventana en pantalla, ya que windows_ventana que está dentro de linux_ventana.  

Esto es útil cuando hay ventanas con diferentes contenedores padres o si se desea evitar conflictos de comportamiento.  

</br>

#### eliminar:

Elimina el contenido interno de la ventana.

``` JavaScript
import Vanie from 'vanie';

const ventana = new Vanie('linux-oscuro');
ventana.padre = document.body;
ventana.abrir();
ventana.eliminar(); // elimina el contenido interno de la ventana.
```

</br>

#### subir:

La función `subir` permite que una ventana se posicione por encima de otras ventanas en pantalla.
``` JavaScript
import Vanie from 'vanie';
import { Dimension } from "nauty";//npm i nauty

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');

const ventana1 = new Vanie('linux-oscuro');
const ventana2 = new Vanie('windows-claro');
const ventana3 = new Vanie('mac-oscuro');
const ventana4 = new Vanie('linux-claro');

ventana1.padre = ventana2.padre = ventana3.padre = ventana4.padre = raiz;

const dimension = new Dimension(1280,720);

ventana1.dApertura = dimension;
ventana2.dApertura = dimension.divide(1.5);
ventana3.dApertura = dimension.divide(1.5);
ventana4.dApertura = dimension.divide(1.5);

ventana1.abrir();
ventana2.abrir();
ventana3.abrir();
ventana4.abrir();

ventana1.lienzo.style.backgroundColor = `#059b9add`;
ventana2.lienzo.style.backgroundColor = `#fdec6fdd`;
ventana3.lienzo.style.backgroundColor = `#ff6e49dd`;
ventana4.lienzo.style.backgroundColor = `#9ae07ddd`;

// Posiciona la ventana 1 por encima de las demás ventanas.
boton.addEventListener('click', ventana1.subir); 
```
> Si quiere saber más sobre el objeto `Dimension`, revise la documentación de [nauty](https://www.npmjs.com/package/nauty).

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDJzdXNuOW90MWh6ZzVvM3JncWtwZzdia3U0ZXJrdzlwaWlqNmQ1bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fSO5lp3LavdawK1QIT/source.gif"alt="gif animado que muestra el resultado de la solucion del ejemplo desconectarseDelGestor"></a></p>

</br>

#### classList:
La función `classList` te permite agregar o quitar clases de **CSS** a los [elementos de la ventana](#estructura) según tus necesidades de estilo. Esto asegura que los estilos específicos [persistan](#persistencia) correctamente.

 + [`'ventana'`](#ventana) : El div perteneciente a la ventana.
 + [`'barra'`](#estructura) :  Es el contenedor que incluye la cabecera, divBotones, ico.
 + [`'cabecera'`](#cabecera) : El div perteneciente a la cabecera.
 + [`'divBotones'`](#estructura) : Contenedor para los botones de _cerrar, minimizar y maximizar_.
 + [`'cerrar'`](#cerrar) : El div que funciona como el botón para cerrar.
 + [`'minimizar'`](#minimizar) : El div que funciona como botón para minimizar.
 + [`'maximizar'`](#maximizar) : El div que funciona como el botón para maximizar.
 + [`'lienzo'`](#lienzo) : El área principal de contenido de la ventana.
 + [`'ico'`](#ico) : El contenedor para el ícono representativo de la ventana.
  
``` JavaScript
import Vanie from 'vanie';

const ventana = new Vanie('linux-oscuro');
ventana.padre = document.body;
ventana.classList('lienzo','add','clase1 clase2'); // Agraga las clases a lienzo
ventana.classList('lienzo','remove','clase1'); // Remueve las clases a lienzo.
ventana.abrir();
```

</br>

#### id:
La función `id` te permite asignar o quitar un ID de **CSS** a los [elementos de la ventana](#estructura) según tus necesidades de estilo. Esto asegura que los estilos específicos se [mantengan](#persistencia) correctamente.

 + [`'ventana'`](#ventana) : El div perteneciente a la ventana.
 + [`'barra'`](#estructura) :  Es el contenedor que incluye la cabecera, divBotones, ico.
 + [`'cabecera'`](#cabecera) : El div perteneciente a la cabecera.
 + [`'divBotones'`](#estructura) : Contenedor para los botones de _cerrar, minimizar y maximizar_.
 + [`'cerrar'`](#cerrar) : El div que funciona como el botón para cerrar.
 + [`'minimizar'`](#minimizar) : El div que funciona como botón para minimizar.
 + [`'maximizar'`](#maximizar) : El div que funciona como el botón para maximizar.
 + [`'lienzo'`](#lienzo) : El área principal de contenido de la ventana.
 + [`'ico'`](#ico) : El contenedor para el ícono representativo de la ventana.

``` JavaScript
import Vanie from 'vanie';

const ventana = new Vanie('linux-oscuro');
ventana.padre = document.body;
ventana.id('lienzo','id-lienzo'); // Agraga el id a lienzo
ventana.id('lienzo',''); // Remueve el id de lienzo.
ventana.abrir();
```
---

</br>


### globalVenie
`globalVenie` es una instancia global de GestorVanie diseñada para registrar, gestionar y administrar la actividad realizada por las ventanas creadas con Vanie. Esta función facilita la coordinación de acciones entre ventanas.

Algunas de las funcionalidades proporcionadas por globalVanie incluyen:

+    **Registro y seguimiento**: Mantiene un registro de todas las ventanas creadas con Vanie.

+    **Gestión de eventos**: Facilita la coordinación de acciones entre las ventanas registradas mediante la emisión y escucha de eventos globales.

+    **Información de estado**: Proporciona información sobre el estado actual de las ventanas.

+    **Manipulación global**: Proporciona una forma más simples de modificar las características de las ventanas.

</br>

#### conectarseA:
El método `conectarseA` permite conectar un elemento del **DOM** para que sea utilizado como contenedor principal de forma global por todos los objetos **Vanie**. Esto garantiza que todas las ventanas creadas tengan el mismo padre, lo que puede ser útil para mantener una estructura coherente en la interfaz de usuario.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

// Todas las ventanas tendrán el mismo contenedor padre.
globalVanie.conectarseA(raiz);

// Crear nuevas ventanas con Vanie
const ventana1 = new Vanie('linux-oscuro');
const ventana2 = new Vanie('windows-claro');
const ventana3 = new Vanie('mac-oscuro');
const ventana4 = new Vanie('linux-claro');

// Abrir las ventanas
ventana1.abrir();
ventana2.abrir();
ventana3.abrir();
ventana4.abrir();
```

</br>

#### establecerBase

El método `establecerBase` te permite asignar un mismo **estilo** a todas las ventanas creadas con **Vanie**. Con esto, ya no es necesario especificar el [estilo](#modificar-estilos) al crear cada ventana, a menos que desees que alguna tenga un estilo diferente al resto.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

// Todas las ventanas tendrán el mismo contenedor padre.
globalVanie.conectarseA(raiz);

// Todas las ventanas tendrán el mismo estilo.
globalVanie.establecerBase('linux-oscuro'); 

// Crear nuevas ventanas con Vanie
const ventana1 = new Vanie;
const ventana2 = new Vanie;
const ventana3 = new Vanie;
const ventana4 = new Vanie;

// Abrir las ventanas
ventana1.abrir();
ventana2.abrir();
ventana3.abrir();
ventana4.abrir();
```
</br>

#### agregarEstilo:

Este método te permite agregar un estilo personalizado de forma global para que al crear una nueva ventana, puedas especificar este estilo simplemente proporcionando su nombre en el constructor.
> Nota: Para aprender cómo crear y personalizar tus propios estilos, consulta la sección [modificar estilos](#modificar-estilos).
``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

// Todas las ventanas tendrán el mismo contenedor padre.
globalVanie.conectarseA(raiz); 

// Todas las ventanas tendrán el mismo estilo base.
globalVanie.establecerBase('linux-oscuro'); 
//vaya a la seccion "modificar estilos" para aprender a crear y personalizar sus propios estilos.
const estiloPersonalizado = {
    data:{
        nombre:'miEstilo'
    }
    // Otros parámetros de personalización...
}
/* Agrega un nuevo estilo a la lista para ser usado únicamente cuando se especifique
el nombre del estilo en una ventana.*/
globalVanie.agregarEstilo(estiloPersonalizado);

// Crear nuevas ventanas con Vanie
const ventana1 = new Vanie;
const ventana2 = new Vanie;
const ventana3 = new Vanie;

// Ventana que utilizará el estilo personalizado.
const ventana4 = new Vanie('miEstilo');

// Abrir las ventanas
ventana1.abrir();
ventana2.abrir();
ventana3.abrir();
ventana4.abrir();
```
</br>

#### ventanasForEach

Este método ejecuta una función proporcionada una vez por cada ventana almacenada en el gestor global, en el orden en el que se registraron.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

// Todas las ventanas tendrán el mismo contenedor padre.
globalVanie.conectarseA(raiz); 

// Todas las ventanas tendrán el mismo estilo base.
globalVanie.establecerBase('linux-oscuro'); 

// Crear nuevas ventanas con Vanie
// Cada vez que se crea una instancia de Vanie, esta se registra en globalVanie.
const ventana1 = new Vanie;
const ventana2 = new Vanie;
const ventana3 = new Vanie;
const ventana4 = new Vanie;

// itera las ventanas registradas y las abre.
globalVanie.ventanasForEach(ventana=>{
    ventana.abrir();
});
```

</br>

#### renombrarIdGlobal:

Por defecto la clase global se llama `VANIE_GLOBAL` pero si esto interfiere con tu diseño, esta función te permite cambiar y reescribir el nombre de la clase global.  

> ⚠ Solo deberías cambiar el nombre de la clase global si está interfiriendo con el diseño de tu aplicación y debes hacerlo al principio de tu código. Cambiar el nombre de la clase global en medio de la ejecución podría causar problemas de compatibilidad.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

globalVanie.conectarseA(raiz);

// Solo deberías cambiar el nombre de la clase global si interfiere con tu diseño.
globalVenie.renombrarIdGlobal('nuevo_id_global') 
globalVanie.establecerBase('linux-oscuro');

const ventana1 = new Vanie;
const ventana2 = new Vanie;
const ventana3 = new Vanie;
const ventana4 = new Vanie;

globalVanie.ventanasForEach(ventana=>{
    ventana.abrir();
});
```

</br>

#### globalClass:
Esta función te permite utilizar un alias para referirte a la clase global, lo que facilita su reutilización en los elementos del DOM.  

Alias disponibles:  

+ **`titulo`** : Personalizable en CSS. Si no has cambiado la ID global, puedes usarla como **'VANIE_GLOBAL--titulo'**. De lo contrario, utiliza el nombre que usaste como **ID global** seguido de **'--titulo'**.

+ **`animacion`** :  Define una transición con `transition : all .3s ease`.  

+ **`none`** : Oculta el elemento con `display : none`.  

+ **`transparente`** : Hace el elemento transparente con `opacity : 0`.  

+ **`desaparecer`** : Oculta el elemento sin ocupar espacio en el diseño con `visibility : hidden`.  

+ **`bloqueado`** : Bloquea la interactividad del elemento con `user-select : none`, `-webkit-user-select : none`, `-moz-user-select : none` y `pointer-events : none`.  

+ **`full`** : Define el ancho y alto del elemento al 100% con `width : 100% !important`, `height : 100% !important`.  

+ **`media`** : Define el ancho del elemento como el 50% del contenedor y mantiene la altura al 100% con  `width : 50% !important` y `height : 100% !important`.  

+ **`radio`** : Aplica un radio de borde de 8px al elemento con `border-radius : 8px`.  

+ **`radioSup`** : Aplica un radio de borde de 8px solo en la esquina superior del elemento con `border-radius : 8px 8px 0 0`.  

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

globalVanie.conectarseA(raiz);
globalVanie.establecerBase('linux-oscuro');

const ventana1 = new Vanie;
const ventana2 = new Vanie;
const ventana3 = new Vanie;
const ventana4 = new Vanie;

globalVanie.ventanasForEach(ventana=>{
    ventana.abrir();
// Se asigna la clase que bloquea toda la interactividad a lienzo.
    ventana.lienzo.classList.add(globalVanie.globalClass('bloqueado'));
});
```

</br>

#### Parametros:
+ **`padre`** : Retorna el contenedor padre.  

+ **`idGlobal`** : Retorna un string con el nombre del ID global.  

+ **`estilosPredeterminados`** : Retorna una lista de strings con los nombres de los estilos predeterminados que tiene **Vanie** : [ *'windows-claro' , 'windows-oscuro' , 'linux-claro' , 'linux-oscuro' , 'mac-claro' , 'mac-oscuro'* ].  

+ **`estiloBase`** : Retorna un string con el nombre del estilo base que se aplica a todas las ventanas.  

+ **`hayEstiloBase`** : Retorna **true** si se ha definido un estilo base, y **false** si no es así.  

+ **`hayEstilos`** : Retorna **true** si existen estilos almacenados en el gestor global, y **false** si no es así.  

+ **`ventanasVisibles`** : Retorna el número de ventanas visibles en pantalla.  

+ **`registros`** : Retorna el número de registros de instancias que se han hecho.

+ **`limites`** : Retorna y modifica los [límites](#limites) que determinarán las colisiones de las ventanas en pantalla (ver [evento colision](#Evento-colision)).

+ **`hayArrastre`** : Retorna **true** si existe alguna ventana siendo arrastrada por la pantalla o **false** si no es así.

+ **`ventanaArrastrada`** : Retorna el objeto **Vanie** de la ventana que está siendo arrastrada por la pantalla o **undefined** si no es así.

</br>

#### Eventos:

Los eventos en el gestor global la permitiran tener un mayor control sobre algunas cuetiones monitorear el numero de ventanas visibles en pantalla, el registro de nuevas instancias  de **Vanie** ademas demas del monitoreo de las colisiones de las ventanas con los [limites](#limites) previamente definidos.

</br>

#### Evento registro: 

El evento `registro` te permite ejecutar una función cada vez que se genere una nueva instancia de **Vanie**. La función recibe como parámetro la instancia **Vanie** que se ha creado.  

Este evento es útil si deseas realizar configuraciones generales a las ventanas sin tener que hacerlo de forma manual.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

// Conectarse a la raíz y establecer un estilo base
globalVanie.conectarseA(raiz).establecerBase('linux-oscuro');

let numeroDeinstanciasVanie = 0;

/* Cada vez que se registra una instancia Vanie, se ejecuta la función signada, 
tomando como parámetro la instancia registrada.*/
globalVanie.addEventListener('registro', ventana => {

    // Personalizar el título y justificar la cabecera
    ventana.titulo = `ventana ${++numeroDeinstanciasVanie}`;
    ventana.justificarCabecera = 'center';

    // Cambiar la dimensión de apertura de la ventana
    const porcentaje = 100 - (numeroDeinstanciasVanie * 10);
    ventana.dApertura = { w: `${porcentaje}%`, h: `${porcentaje}%` };

    // Agregar un div al lienzo con un color aleatorio si el estilo no es 'windows-claro'
    if (ventana.estilo !== 'windows-claro') {
        const div = document.createElement('div');
        div.style.width = div.style.height = '100%';
        div.style.backgroundColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
        ventana.lienzoAgrega(div);
    } else {
        // Cargar un video de YouTube si el estilo es 'windows-claro'
        ventana.cargarURL('https://www.youtube.com/embed/GrG2-oX5z24?si=UPiNV_e5HOBdC7lE');
    }

// Cada vez que una ventana se registra, se llama automáticamente a su función abrir.
    ventana.abrir(); 
});

// Crear las instancias Vanie
new Vanie;
new Vanie;
new Vanie;
new Vanie;
new Vanie('windows-claro');
```

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHRneGl4Y2dyZTl5M2YzbGMwazQ4bTAwczlrMnpibXZpcHl1ZHhuaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13ooshRAgcSxiDm53U/source.gif"alt="gif animado que muestra el resultado del codigo de ejemplo de Evento registro"></a></p>

</br>

#### Evento vista: 

El evento `vista` permite ejecutar una función cuando una ventana desaparece o aparece en pantalla. La función recibe como argumento un objeto con los siguientes parámetros:  

+ `vanie` : Es la instancia que ha lanzado el evento.  

+ `visibles` : Retorna el número de ventanas visibles en pantalla.  

+ `seOculto` : Retorna **true** si la ventana ya no se encuentra en pantalla, de lo contrario, retorna **false**.  

+ `seMostro` : Retorna **true** si la ventana se ha mostrado en pantalla, de lo contrario, retorna **false**.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');
const contador = document.getElementById('contador');
const boton = document.getElementById('btn');
const emoji = document.getElementById('emoji');

globalVanie.conectarseA(raiz).establecerBase('linux-oscuro');
contador.innerText = 'Ventanas en pantalla: ' + globalVanie.ventanasVisibles;

// Reutilización de las clases globales animacion y bloqueado.
emoji.classList.add(...globalVanie.globalClass('animacion','bloqueado'));
emoji.style.opacity = 0;

emoji.addEventListener('transitionend', () => {
    emoji.style.opacity = 0;
});

// Configuración de cada ventana
let porcentaje = 100;
globalVanie.addEventListener('registro', ventana => {
    if (porcentaje <= 50) porcentaje = 100;
    porcentaje -= 15;
    // Modificación de la dimensión de apertura de la ventana.
    ventana.dApertura = { w: `${porcentaje}%`, h: `${porcentaje}%` };
    // Uso de la posición del botón para que al minimizar la ventana se redirija a ese punto.
    ventana.pRetorno = {
        x: boton.getBoundingClientRect().left + boton.offsetWidth / 2,
        y: boton.getBoundingClientRect().top
    }

    ventana.addEventListener('abrir', () => {
        // Agregar un color aleatorio al lienzo cada vez que se construya y abra.
        ventana.lienzo.style.backgroundColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
    });
    ventana.abrir();
});

// Cada vez que una ventana se muestra o se oculta en pantalla, se ejecuta la función asignada.
globalVanie.addEventListener('vista', v => {
    
    // Informa sobre el número de ventanas mostradas en pantalla
    contador.innerText = 'Ventanas en pantalla: ' + v.visibles; 

    emoji.style.opacity = 1;

    if (!v.visibles) {
        // Si ya no hay venatanas en pantalla
        emoji.innerText = '❌';
    } else if (v.seMostro) { 
        // Si se muestra una ventana en pantalla
        emoji.innerText = '🎉';
    } else { 
        // Si se oculta una ventana en pantalla
        emoji.innerText = '😰';
    }
});

boton.addEventListener('click', () => {
    /* Si el número de ventanas registradas no coincide con las ventanas visibles, 
    se iteran para reabrir las ventanas ocultas*/
    if (globalVanie.registros != globalVanie.ventanasVisibles) {
        globalVanie.ventanasForEach(ventana => ventana.abrir())
    } else {
        // Se genera una nueva ventana por cada click en el botón
        new Vanie; 
    }
});

```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDhucTU0YXVzcHlnYnlhcWE5dnYxb2lqemlmeWE4NDB2eDJjODg3dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F6Ev1Acyf7VzsUKV6s/source.gif"alt="gif animado que muestra el resultado del codigo de ejemplo de Evento vista"></a></p>

</br>

#### limites:

Los límites permiten definir los puntos de colisión en la pantalla que se utilizarán en el [evento colision](#evento-colision) para detectar cuando una ventana ha superado estos puntos.  

Los parámetros del objeto `limites` pueden tener valores numericos y cadenas de texto. Algunas cadenas de texto permitidas son las usadas para el posicionamiento en **CSS**:  

+ `der` : 'right' o 'end', que representa el punto final de la pantalla.
+ `izq` : 'left' o 'start', representa la coordenada 0 en x del lado izquierdo de la pantalla.
+ `sup` : 'top' o 'start', la coordenada 0 en y de la parte superior.
+ `inf` : 'bottom' o 'end', la altura final de la pantalla.

También se permiten cadenas de texto con porcentajes que representan la dimensión del contenedor padre, desde '0%' hasta '100%', además de cálculos simples como sumas y restas de números que representan píxeles a los porcentajes. Por ejemplo, '100%-1' o '100%+1'.  

> **`⚠ IMPORTANTE`** : Las cadenas de texto con los calculos no deben tener ningun espacio en blanco, ademas el orden siempre debe de ser _`porcentaje / operacion / numero de pixeles`_, de lo contrario se producira un **error**.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

globalVanie.conectarseA(raiz);
globalVanie.establecerBase('linux-oscuro');

// Configurando los límites del contenedor padre para ser utilizados en el evento colision.
globalVanie.limites = { 
    der: 'end', // El final de pantalla del lado derecho.
    izq: 0, // La coordenada 0 en x.
    inf: '100%', // El 100% de la altura.
    sup: '10%-5' // El 10% de la altura menos 5px.
}
```  

> **`⛔ ADVERTENCIA`** :  Si los limites opuesto se cruzan esto impedira que se emita el evento `colision`.

*Si solo deseas controlar un límite específico, solo necesitas declarar ese límite:*

``` JavaScript
// Definiendo un único límite del contenedor padre que activará el evento colision.
globalVanie.limites = {
    inf: '100%-5' // 5px desde el borde inferior.
};
```
*Para eliminar los límites, puedes hacerlo de las siguientes maneras:*

``` JavaScript
/*eliminado los limites.*/

/* Eliminando el límite asignado, un objeto vacío 
 o que no contenga ninguno de los parámetros antes mencionados.*/
globalVanie.limites = {};

// eliminado el limite asignando undefined
globalVanie.limites = undefined;

// eliminando el limite asignando el valor 0
globalVanie.limites = 0;

// eliminando el limite asignando un string vacio.
globalVanie.limites = '';
```

*Al eliminar los límites, el evento `colision` dejará de emitirse.*

</br>

#### Evento colision: 

El evento `colision` permite ejecutar una función cuando una ventana ha cruzado los [límites](#limites) definidos.  

La función recibe como argumento un objeto con los siguientes parámetros:  

+ `der` : **true**  si se ha cruzado el límite derecho, **false** en caso contrario.  

+ `izq` : **true** si se ha cruzado el límite izquierdo, **false** en caso contrario.  

+ `sup` : **true** si se ha cruzado el límite superior, **false** en caso contrario.  

+ `inf` : **true** si se ha cruzado el límite inferior, **false** en caso contrario.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

globalVanie.conectarseA(raiz).establecerBase('linux-oscuro');

// Definiendo los límites del contenedor padre.
globalVanie.limites = {
    der: '100%-50', // 50px desde el borde derecho
    izq: 50, // 50px desde el borde izquierdo
    sup: 50, // 50px desde el borde superior
    inf: '100%-50' // 50px desde el borde inferior
};

globalVanie.addEventListener('colision', limites =>{

    const border = '10px solid red';

    // Si se superan los límites, los bordes del contenedor padre se pintarán de rojo
    raiz.style.borderRight = limites.der ? border : '';
    raiz.style.borderLeft = limites.izq ? border : '';
    raiz.style.borderTop = limites.sup ? border : '';
    raiz.style.borderBottom = limites.inf ? border : '';
    
});

globalVanie.addEventListener('registro',ventana=>{
    ventana.abrir();
    ventana.lienzo.style.backgroundColor = '#059b9add';
});

for(let i = 0; i < 4; i++) 
    new Vanie; // Crear 4 ventanas
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTd5cXpva3pxaW1sa2xqdGRlYmkwNXA2cTgzY2VxcWQ3OXllOW8xbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dEZBuwfCcAmzZS6pMl/source.gif"alt="gif animado que muestra el resultado del codigo de ejemplo de Evento colision"></a></p>

</br>

#### Evento pulsar: 

El evento `pulsar` permite ejecutar una función cuando se ha generado una pulsación en una ventana.  

La función recibe como argumento la ventana que disparó el evento.  
> ⚠ Esta en fase beta. Puede tener complicaciones con sitios web cargados en el lienzo.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

globalVanie.conectarseA(raiz).establecerBase('linux-oscuro');

// Al momento de pulsar cualquier ventana, el evento es emitido.
globalVanie.addEventListener('pulsar',ventana=>{
    console.log(`se ha pulsado ${ventana.identificador}`);
});

globalVanie.addEventListener('registro',ventana=>{
    ventana.abrir();
    ventana.lienzo.style.backgroundColor = '#059b9add';
});
// generando una ventana nueva.
const nuevaVentana = new Vanie;
nuevaVentana.identificador = 'ventana--001';
```
---
</br>

#### Evento arrastre: 

El evento `arrastre` permite ejecutar una función cuando una ventana se está arrastrando por la pantalla. Este evento proporciona información útil sobre la ventana y la posición del puntero del mouse.  

La función recibe como argumento un objeto con las siguientes propiedades:  
+ `vanie` : La instancia de la ventana que disparó el evento.
+ `local` : Un objeto **Punto** con las coordenadas locales del puntero del mouse.
+ `global` : Un objeto **Punto** con las coordenadas globales del puntero del mouse.
+ `desplazo` : Un objeto **Desplazo** que contiene el desplazamiento **dx** y **dy** de la ventana con respecto a sus coordenadas iniciales.  

> Detalles Técnicos: Para obtener la posición actual de la ventana, se debe sumar la [posición inicial](#posicion) de la ventana con el desplazamiento `desplazo`. Esto es necesario porque las ventanas utilizan transformaciones `translate` durante el arrastre. Una vez finalizado el arrastre, estas transformaciones se aplican a las nuevas coordenadas.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');

globalVanie.conectarseA(raiz).establecerBase('linux-oscuro');

globalVanie.addEventListener('registro',ventana=>{
    ventana.abrir();
    ventana.lienzo.style.backgroundColor = '#059b9add';
});

// Al momento de arrastrar cualquier ventana, el evento es emitido.
globalVanie.addEventListener('arrastre',objeto=>{
    // Vanie: ventana que lanzo el evento.
    const ventana = objeto.vanie;
    console.log(`la ventana ${ventana.identificador} se esta arrastrando`);
    
    // Punto: coordenada local del mouse.
    const pLocal = objeto.local;
    console.log(`la coordenada local en x es ${pLocal.x} e y es ${pLocal.y}`);

    // Punto: coordenada global del mouse.
    const pGlobal = objeto.global;
    console.log(`la coordenada local en x es ${pGlobal.x} e y es ${pGlobal.y}`);

    // Desplazo: desplazamiento de la ventana.
    const desplazo = objeto.desplazo;
    console.log(`la ventana se desplazo en x:${desplazo.dx} , y:${desplazo.dy}`); 
});

// generando una ventana nueva.
const nuevaVentana = new Vanie;
nuevaVentana.identificador = 'ventana--001';
```

> Si quiere saber más sobre los objetos `Punto` y `Desplazo`, revise la documentación de [nauty](https://www.npmjs.com/package/nauty).

---
</br>

### Recomendaciones finales

A continuación, se presentan algunas recomendaciones útiles para optimizar el uso de la librería **Vanie** en su proyecto, especialmente cuando maneja múltiples ventanas.

#### Auto Desconectarse

Si en su proyecto ha decidido crear un generador de múltiples ventanas que al final no reutilizará, puede darles la capacidad de auto desconectarse. Esto asegurará que las ventanas no permanezcan registradas en el gestor global después de cerrarlas, liberando memoria y mejorando el rendimiento en operaciones que iteran sobre las ventanas registradas, como [ventanasForEach](#ventanasforeach) o [establecerBase](#establecerbase). 

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');
const boton = document.getElementById('btn');
const contador = document.getElementById('contador');

contador.innerText = 'elementos registrados: ' + globalVanie.registros;

globalVanie.conectarseA(raiz).establecerBase('linux-oscuro');

globalVanie.addEventListener('registro',()=>{
    contador.innerText = 'elementos registrados: ' + globalVanie.registros;
});

// Al darle click se generara una nueva ventana
boton.addEventListener('click',()=>{
    const ventana = new Vanie;
    ventana.abrir();
    ventana.lienzo.style.backgroundColor = '#059b9add';

    // Se desconectará al momento de cerrar.
    ventana.addEventListener('cerrar',()=>{
        ventana.desconectarseDelGestor();
        contador.innerText = 'elementos registrados: ' + globalVanie.registros;
    });
});
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTI4NTlmdjBpaGhkdXFkamR0ZDhoYjMwczNnMzU1eHQ3ZWE5eDBsYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZoKp41tHFpg9q3zN7B/source.gif"alt="gif animado que muestra el resultado del codigo de ejemplo de auto desconectarse"></a></p>

#### Importancia de Desconectar Ventanas No Reutilizadas

Es importante recordar que [globalVanie](#globalvenie) registra cada nueva instancia **Vanie**. Esto significa que cada instancia está referenciada en el gestor global, ocupando memoria y haciendo que operaciones de iteración como [ventanasForEach](#ventanasforeach) o [establecerBase](#establecerbase) sean más largas. Por lo tanto, desconectar ventanas que no reutilizará es una práctica recomendada para optimizar su diseño y mejorar el rendimiento de su aplicación.

</br>

#### Identificadores numericos

**Vanie** ofrece una forma sencilla de asignar identificadores a sus ventanas, ya sea directamente en el [constructor](#constructor) o usando la propiedad [identificador](#identificador). Los identificadores pueden ser tanto cadenas de texto como números.  

Utilizar identificadores numéricos en **Vanie** no solo simplifica la gestión y comparación de ventanas, sino que también abre posibilidades para técnicas avanzadas como el uso de **bitmask**.
``` JavaScript
import { globalVanie , Vanie } from 'vanie';

 const raiz = document.getElementById('raiz');
const btn_verde = document.getElementById('btn-verde');
const btn_rojo = document.getElementById('btn-rojo');

globalVanie.conectarseA(raiz).establecerBase('linux-oscuro');

globalVanie.addEventListener('registro',ventana=>{
    let color = '#000';
    if(ventana.identificador == 1) color = '#288d85';
    else if(ventana.identificador == 2) color = '#c02948';
    
    ventana.addEventListener('cerrar',()=>{
        ventana.desconectarseDelGestor();
    });
    
    ventana.abrir();
    ventana.lienzo.style.backgroundColor = color;});

btn_verde.addEventListener('click',()=>{
    const id = 1;
    /* asignar un identificador en el constructor le permitira al evento registrar 
    tener acceso a dicho identificador*/
    new Vanie(undefined,id);
    
});

btn_rojo.addEventListener('click',()=>{
    const id = 2;
    /* asignar un identificador en el constructor le permitira al evento registrar 
    tener acceso a dicho identificador*/
    new Vanie(undefined,id);
});
```
<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGpsNGQ1bTRjM2xjbjk1enUzMnl1aXhucTRjbWQ2NGlqbTRxN3NkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aagahJ3pJUESw1zdpV/source.gif"alt="gif animado que muestra el resultado del codigo de ejemplo de identificador numerico"></a></p>

#### globalVanie.globalClass('bloqueado')

[globalVanie.globalClass('bloqueado')](#globalclass)  devuelve el nombre de la clase CSS global "bloqueado". Esta clase es especialmente útil para diseñar elementos de la interfaz, sin afectar la interactividad de la ventana. Utilizar esta clase permite mantener la funcionalidad intacta mientras se personaliza la apariencia.  

Recomendación: si sus elementos son meramente estéticos y no requieren interacción, asegúrese de usar la clase CSS global "bloqueado" para que no interfiera con la interactividad de la ventana.

``` JavaScript
import { globalVanie , Vanie } from 'vanie';

const raiz = document.getElementById('raiz');
        
globalVanie.conectarseA(raiz).establecerBase('linux-oscuro');
const ventana = new Vanie;

const logo = new Image(20,20);
logo.setAttribute('src','https://cdn.icon-icons.com/icons2/70/PNG/512/ubuntu_14143.png');
const icono = document.createElement('div');

icono.appendChild(logo);
icono.style = 'height:100%;display:grid; place-content:center; padding-inline:10px;';

ventana.ico = icono;

/*Agregando la clase 'bloqueado' a ico para bloquearla a asi misma como a sus nodos hijos.
Para recordar cómo usar la función classList, vaya a la sección configuraciones.*/
ventana.classList('ico','add',globalVanie.globalClass('bloqueado'));

const contenedor = document.createElement('div');
contenedor.style = 'height:100%; display:flex; align-items: end;';
const pestanya = document.createElement('div');
const nuevaPestanya = document.createElement('div');
const css = `
    height:80%;
    display:grid;
    font-size: 14px;
    place-content:center;
    border: 1px solid #999;
    border-bottom: none;
    border-radius: 5px 5px 0 0;`
nuevaPestanya.style = `
    aspect-ratio:1;
    ${css}`
pestanya.style = `
    width: 100px;
    margin-right:2px;
    ${css}`;
nuevaPestanya.innerText = '+';
pestanya.innerText = 'pestaña';

contenedor.appendChild(pestanya);
contenedor.appendChild(nuevaPestanya);

ventana.cabecera = contenedor;
ventana.abrir();
```

<p align="center"><a href="#"><img src="https://i.ibb.co/QXmg82D/presonalizada.jpg"alt="gif animado que muestra el resultado del codigo de ejemplo de globalVanie.globalClass('bloqueado')"></a></p>

###### *Todos los personajes presentados en esta librería fueron diseñados y creados por mí ~ [Neko ★ Shooter.](https://github.com/NekoShooter)*