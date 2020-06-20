/*
 * spa.shell.js
 * Shell module for SPA
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */

/*
{ 
  ordered_meals : { 
    id_01 : { 
      amount : 1, 
      price  : 780
    }
  },  
  count_meals : 4,
  total_price : 1450
}
*/ 
spa.shell = (function () {
  "use strict";
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var 
    configMap = {  
      main_html : String()
        + '<div class="spa-shell-header">'
          + '<h1>МЕНЮ</h1>'
        + '</div>'
        + '<div class="spa-shell-main"></div>'
        + '<div class="spa-shell-footer">'
          + '<nav>'
            + '<ul>'
              + '<li>'
                + '<a href="#discounts">'
                  + '<div class="discounts">'
                    + '<h5>Акции</h5>'
                  + '</div>'
                + '</a>'
              + '</li>'
              + '<li>'
                + '<a href="#restaurant">'
                  + '<div class="restaurant">'
                    + '<h5>Ресторан</h5>'
                  + '</div>'
                + '</a>'
              + '</li>'
              + '<li>'
                + '<a href="#menu">'
                  + '<div class="menu">'
                    + '<h5>Меню</h5>'
                  + '</div>'
                + '</a>'
              + '</li>'
              + '<li>'
                + '<a href="#basket">'
                  + '<div class="basket">'
                    + '<h5>Корзина</h5>'
                  + '</div>'
                + '</a>'
              + '</li>'
              + '<li>'
                + '<a href="#cabinet">'
                  + '<div class="cabinet">'
                    + '<h5>Кабинет</h5>'
                  + '</div>'
                + '</a>'
              + '</li>'
            + '</ul>'
          + '</nav>'
        + '</div>',

      nav_link_names : {
        discounts  : 'АКЦИИ',
        restaurant : 'РЕСТОРАН',
        menu       : 'МЕНЮ',
        basket     : 'КОРЗИНА',
        cabinet    : 'КАБИНЕТ'
      },
      
      default_location_hash : '#menu',
      id_active_link        : 'active'
    }, 

    stateMap  = { 
      $container      : undefined,
      current_section : undefined
    },

    jqueryMap = {}, 

    // Объявляем переменные области видимости модуля
    // (некоторые переменные будут присвоены позже).
    setJqueryMap, onHashChangeLink, setLogAndActiveLink, initModule
  ;
  //----------------- END MODULE SCOPE VARIABLES ---------------




  //--------------------- BEGIN DOM METHODS --------------------
  // Секция представления shell.
  //
  // Находит необходимые элементы и кэширует их в коллекцию jQuery.
  // 
  setJqueryMap = function () {
    var $container = stateMap.$container; 
    jqueryMap = { 
      $container : $container, 
      $logotype  : $container.find( '.spa-shell-header h1' ),
      $main      : $container.find( '.spa-shell-main' ),
      $nav_links : $container.find( '.spa-shell-footer nav a' )
    }; 
  };

  // Обработчик события, меняющий значок раздела и его имя.
  //
  setLogAndActiveLink = function ( new_name_active_link ) {
    var 
      links = jqueryMap.$nav_links,
      title = jqueryMap.$logotype,
      i, current_link, page_name
    ;

    // Удаляем id старого раздела.
    links.removeAttr( "id", configMap.id_active_link );

    for ( i = 0; i < links.length; i++ ) {
      current_link = $( links[i] );
      page_name = current_link.attr( "href" ).substr( 1 );

      if ( page_name === new_name_active_link ) {
        // Устанавливаем id текущего раздела.
        current_link.attr( "id", configMap.id_active_link );
        // Устанавливаем имя для заголовка нового раздела.
        title.text( configMap.nav_link_names[page_name] );
      } 
    }
  };
  //--------------------- END DOM METHODS ----------------------



  //------------------- BEGIN EVENT HANDLERS -------------------
  // Секция контроллера shell.
  //
  // Метод, вызывающий обработчик события смены раздела.
  //
  onHashChangeLink = function () {
    var href_without_hash = location.hash.substr( 1 );
    setLogAndActiveLink( href_without_hash );
  };
  //-------------------- END EVENT HANDLERS --------------------



  //------------------- BEGIN PUBLIC METHODS -------------------
  // Секция публичных методов.
  // Открытый метод initModule инициализирует модуль
  // (с этого метода начинается выполнение модуля).
  //
  initModule = function ( $container ) { 
    var models;

    // Контейнер spa (id="spa" страницы, куда будет загружен интерфейс)
    stateMap.$container = $container;
    // Загружаем HTML.
    $container.html( configMap.main_html );
    // Кэшируем коллекцию jQuery.
    setJqueryMap();

    models = {
      meals_model  : spa.model.meals,
      basket_model : spa.model.basket
    };

    spa.meal.configModule( models );
    spa.meal.initModule( jqueryMap.$main );
		
		spa.basket.configModule( models );
    // spa.basket.initModule( jqueryMap.$main );

    // Проверка локации раздела и установка прослушивания её смены.
    // Если локальный хэш раздела отстутствует, то используем хэш, 
    // заданый в статических параметрах по умолчанию.
    //
    if ( !location.hash ) { 
      stateMap.current_section = configMap.default_location_hash;
      location.hash = stateMap.current_section; 
    }
    // Если есть, вызываем метод инициализатор смены раздела.
    else { onHashChangeLink(); }

    window.addEventListener( "hashchange", function () {
      if ( location.hash === "#basket" ) {
        spa.basket.initModule( jqueryMap.$main );
      }
      else if ( location.hash === "#menu" ) {
        spa.meal.initModule( jqueryMap.$main );
      }
    });

    // Прослушивание события смены раздела.
    window.addEventListener( "hashchange", onHashChangeLink );
  };

  // Экспортируем открытый метод, возвращая его в хэше.
  //
  return { initModule : initModule };
  //------------------- END PUBLIC METHODS ---------------------
}());
