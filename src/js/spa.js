/*
 * spa.js
 * Root namespace module
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/*global $, spa */


// Здесь содержится корневое пространство имён spa.
//
// Функциональность:
// - минимально необходимое пространство var spa = {}; 
// - метод для инициализации приложения;
// - код проходит проверку JSLint.
//
// Используется паттерн модуля.
var spa = (function () {
  "use strict";

  // Метод инициализирующий всё приложение.
  var initModule = function ( $container ) {
    // spa.data.initModule();
    spa.model.initModule();
    spa.shell.initModule( $container );
  };

  return { initModule: initModule };
}());
