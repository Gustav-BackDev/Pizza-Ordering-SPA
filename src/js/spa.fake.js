/*
 * spa.fake.js
 * Fake module
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */

spa.fake = (function () {
  "use strict";
  var getMealList;
	
  // Метод возвращающий список подставных данных.
  getMealList = function () {
    return [
      { 
        _id       : "id_01",
        name      : "Маргарита", 
        nutrition : "250 г / 191 кКал",
        price     : 798,
        amount    : 0,
        condition : false,
        css_map   : { 
          src : "src/images/photos/margherita.png", 
          alt : "Фото пиццы Маргарита"
        }
      },
      { 
        _id       : "id_02",
        name      : "Пепперони", 
        nutrition : "250 г / 157 кКал",
        price     : 299,
        amount    : 0,
        condition : false,
        css_map   : { 
          src : "src/images/photos/pepperoni.png", 
          alt : "Фото пиццы Пепперони"
        }
      },
      { 
        _id       : "id_03",
        name      : "Аппетито", 
        nutrition : "250 г / 184 кКал",
        price     : 500,
        amount    : 0,
        condition : false,
        css_map   : { 
          src : "src/images/photos/appetito.png", 
          alt : "Фото пиццы Аппетито"
        }
      },
      { 
        _id       : "id_04",
        name      : "Мексиканская", 
        nutrition : "250 г / 170 кКал",
        price     : 425,
        amount    : 0,
        condition : false,
        css_map   : { 
          src : "src/images/photos/mexicano.png", 
          alt : "Фото пиццы Мексиканская"
        }
      },
      { 
        _id       : "id_05",
        name      : "Баварская", 
        nutrition : "250 г / 144 кКал",
        price     : 475,
        amount    : 0,
        condition : false,
        css_map   : { 
          src : "src/images/photos/bawarska.png", 
          alt : "Фото пиццы Баварская"
        }
      },
      { 
        _id       : "id_06",
        name      : "Цезарь с<br>курицей", 
        nutrition : "200 г",
        price     : 500,
        amount    : 0,
        condition : false,
        css_map   : { 
          src : "src/images/photos/caesar.png", 
          alt : "Фото салата Цезарь с курицей"
        }
      },
      { 
        _id       : "id_07",
        name      : "Чизкейк<br>New-Yourk", 
        nutrition : "120 г",
        price     : 350,
        amount    : 0,
        condition : false,
        css_map   : { 
          src : "src/images/photos/cheesecake.png", 
          alt : "Фото чизкейка New-Yourk"
        }
      },
      { 
        _id       : "id_08",
        name      : "Coca-Cola", 
        nutrition : "1 л",
        price     : 360,
        amount    : 0,
        condition : false,
        css_map   : { 
          src : "src/images/photos/cocacola.png", 
          alt : "Фото напитка Coca-Cola"
        }
      }
    ];  
  };

  return { getMealList : getMealList };
}());
