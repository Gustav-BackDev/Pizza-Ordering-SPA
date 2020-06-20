/*
 * spa.basket.js
 * Bsket feature module for SPA
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */

spa.basket = (function () {
  "use strict";
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
	var
    configMap = {
      main_html : String()
        + '<div class="spa-table">'
          + '<div class="spa-table-total">' 
            + '<div class="spa-table-total-counter">Сумма: '
              + '<span class="spa-table-total-counter-amount">2288</span>'
            + ' </div>'
            + '<a href="#"class="spa-table-total-text">Оформить заказ</a>' 
          + '</div>'
        + '</div>',

      meals_model  : null,
      basket_model : null,

      $container : undefined,

      settable_map : {
        meals_model  : true,
        basket_model : true
      }
    },

    stateMap  = {
      total_price  : undefined,
      total_amount : undefined
    },

    jqueryMap = {},

    onBasketChange,
    onSetTotal,
    onRemoveMeal,
	  setJqueryMap, configModule, initModule
	;
  //----------------- END MODULE SCOPE VARIABLES ---------------
 
  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------  END UTILITY METHODS  ------------------

  //--------------------- BEGIN DOM METHODS --------------------
  setJqueryMap = function () {
    var
      $main   = configMap.$container,
      $basket = $main.find( ".spa-shell-main-basket" ),
      $table  = $basket.find( ".spa-table" )
    ;

    jqueryMap = {
      $basket : $basket,
      $table  : $table,
      $amount : $table.find( ".spa-table-total-counter-amount" ),
      $text   : $table.find( ".spa-table-total-text" )
    };
  };
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------

  onSetTotal = function () {
    console.log("$");
  };

  onBasketChange = function ( event ) {
    var meal_db = configMap.meals_model.get_db();

    // clear list of meals
    //event.empty();

    meal_db().each( function ( meal, idx ){
      // if meal status is ordered than ...
      //   ... add to the list
      // if meal status is unordered than ...
      //   ... go to the next meal status
      console.log( meal.name );
    });
  };

  onRemoveMeal = function () {
    console("!");
  };
  //-------------------  END EVENT HANDLERS  -------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
	
  configModule = function ( input_map ) {
    spa.util.setConfigMap({
      input_map    : input_map,
      settable_map : configMap.settable_map,
      config_map   : configMap
    });

    return true;
  };

	initModule = function ( $spa_shell_menu ) {
    var $basket;

		//console.log("Basket is ready!");
    configMap.$container = $spa_shell_menu;

    $basket = $("<div/>")
      .addClass("spa-shell-main-basket")
      .append( configMap.main_html );

    configMap.$container.html( $basket );
    setJqueryMap();
    onBasketChange();
	};

  return { 
		configModule : configModule,
		initModule   : initModule 
	};
  //------------------  END PUBLIC METHODS  --------------------
}());
