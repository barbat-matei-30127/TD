%
Exemplu de afisarea unui arbore de compresie .
 A0 este radacina arborelui .
 Fiecare nivel introduce un bit la finalul codului .
 Fiecare nod va avea maximum 2 copii (L - stanga ( introduce
un "0") si R - dreapta ( introduce un "1") )
 Numele nodului contine numele nodului vizitat anterior .

 ex .: A0LR - nivel 2, cod : 01
 %
 var treeData = {
 " name ": "A0",
 " children ": [
 {
 " name ": " Level 1: _",
 " children ": [
 { " name ": " Level 2: _",
 " children ": [
 { " name ": " Level 3: _",
 " children ": [
 { " name ": " Level 4: _ - space ( frequency " } ,
 { " name ": " Level 4: _ - 3 ( frequency )" }
 ]
 },
 { " name ": " Level 3: _ - q ( frequency )" }
 ]
 },
 { " name ": " Level 2: _ - M ( frequency )" }
 ]
 },

 { " name ": " Level 1: _",
 " children ": [
 { " name ": " Level 2: _ - A ( frequency )" } ,
 { " name ": " Level 2: _ - * ( frequency )" }
 ]
 }
 ]
 };

 // %
 Definirea dimensiunii de afisare a arborelui
 var margin = { top : 20 , right : 90 , bottom : 30 , left : 90} ,
 width = 1960 - margin . left - margin . right ,
 height = 800 - margin . top - margin . bottom ;

 // append the svg object to the body of the page
 // appends a 'group ' element to 'svg '
 // moves the 'group ' element to the top left margin

 var svg = d3 . select (" body "). append (" svg ")
 . attr (" width ", width + margin . right + margin . left )
 . attr (" height ", height + margin . top + margin . bottom )
 . append ("g")
 . attr (" transform ", " translate ("
 + margin . left + "," + margin . top + ")");

 var i = 0 ,
 duration = 750 ,
 root ;

 //
 defineste layout pentru arbore si ii asigneaza dimensiuni

 var treemap = d3 . tree () . size ([ height , width ]) ;

 //
 Asigneaza parinte , copil , inaltime , adancime

 root = d3 . hierarchy ( treeData , function ( d) { return d.
children ; }) ;
 root . x0 = height / 2;
 root . y0 = 0;

 //
 Inchide dupa al doilea nivel
 root . children . forEach ( collapse );

 update ( root );

 //
 Inchide nodul si toti copiii lui

 function collapse ( d) {
 if(d. children ) {
 d. _children = d. children
 d. _children . forEach ( collapse )
 d. children = null
 }
 }

 function update ( source ) {
 //
 Asigneaza pozitiile x si y pentru noduri

 var treeData = treemap ( root );

 //
Calculeaza noul layout .

 var nodes = treeData . descendants () ,
 links = treeData . descendants () . slice (1) ;

 //
 Normalizeaza pentru adancime fixa .

 nodes . forEach ( function ( d) { d. y = d. depth * 180}) ;

 // ****************** Nodes section
***************************
 //
 Update noduri ...

 var node = svg . selectAll ( 'g. node ')
 . data ( nodes , function ( d) { return d . id || (d . id = ++ i )
; }) ;
var nodeEnter = node . enter () . append ( 'g')
 . attr ('class ', 'node ')
 . attr (" transform ", function ( d) {
 return " translate (" + source . y0 + "," + source . x0 +
")";
 })
 . on ('click ', click ) ;

 //
 Adauga cerc pentru fiecare nod .

 nodeEnter . append ( 'circle ')
 . attr ('class ', 'node ')
 . attr ('r', 1e -6)
 . style (" fill ", function (d ) {
 return d. _children ? " lightsteelblue " : "# fff ";
 }) ;

 //
 Adauga eticheta pentru fiecare nod .

 nodeEnter . append ( 'text ')
 . attr ("dy", " .35 em")
 . attr ("x", function ( d) {
 return d. children || d. _children ? -13 : 13;
 })
 . attr ("text - anchor ", function ( d) {
 return d. children || d. _children ? " end " : " start
";
 })
 . text ( function (d) { return d. data . name ; }) ;

 // UPDATE
 var nodeUpdate = nodeEnter . merge ( node );

 // Transition to the proper position for the node
 nodeUpdate . transition ()
 . duration ( duration )
 . attr (" transform ", function (d) {
 return " translate (" + d. y + "," + d.x + ")";
 }) ;
Update atributele si stilul nodurilor .

 nodeUpdate . select ( 'circle . node ')
 . attr ('r', 10)
 . style (" fill ", function (d ) {
 return d. _children ? " lightsteelblue " : "# fff ";
 })
 . attr ('cursor ', 'pointer ');

 //
 Sterge orice nod care iese .

 var nodeExit = node . exit () . transition ()
 . duration ( duration )
 . attr (" transform ", function (d) {
 return " translate (" + source . y + "," + source .x +
")";
 })
 . remove () ;

 //
 La iesire se reduce dimensiunea cercului la 0.

 nodeExit . select ( 'circle ')
 . attr ('r', 1e -6) ;

 // On exit reduce the opacity of text labels
 nodeExit . select ( 'text ')
 . style ('fill - opacity ', 1e -6) ;

 //
 ****************** sectiune pentru linkuri
***********************
 // Update the links ... '
 var link = svg . selectAll ( 'path . link ')
 . data ( links , function ( d) { return d . id ; }) ;

 // Enter any new links at the parent 's previous position .
 var linkEnter = link . enter () . insert ( 'path ', "g")
 . attr (" class ", " link ")
 . attr ('d', function ( d) {
 var o = {x: source . x0 , y: source . y0 }
 return diagonal (o , o )
 }) ;

 // UPDATE
var linkUpdate = linkEnter . merge ( link );

 // Transition back to the parent element position
 linkUpdate . transition ()
 . duration ( duration )
 . attr ('d', function ( d) { return diagonal (d , d . parent )
}) ;

 // Remove any exiting links
 var linkExit = link . exit () . transition ()
 . duration ( duration )
 . attr ('d', function ( d) {
 var o = { x: source .x , y : source .y }
 return diagonal (o , o)
 })
 . remove () ;

 // Store the old positions for transition .
 nodes . forEach ( function ( d) {
 d. x0 = d .x;
 d. y0 = d .y;
 }) ;

 // Creates a curved ( diagonal ) path from parent to the
child nodes
 function diagonal (s , d) {
 path = `M $ {s .y} ${ s. x}
 C $ {( s. y + d.y ) / 2} ${s .x },
 $ {( s .y + d. y) / 2} $ {d. x} ,
 ${ d. y} ${d .x }`
 return path
 }

 // Toggle children on click .
function click ( d) {
 if (d. children ) {
 d. _children = d. children ;
 d. children = null ;
 } else {
 d. children = d. _children ;
 d. _children = null ;
 }
 update (d) ;
 }
 }