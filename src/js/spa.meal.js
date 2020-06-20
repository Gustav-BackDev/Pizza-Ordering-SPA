/*
 * spa.meal.js
 * Meal feature module for SPA
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */


// Здесь содержится пространство имен функционального модуля meal.
// Функциональность:
// - отрисовка и управление функциональными контейнерами позиций;
// - управление состоянием позиции ( заказанно / в состоянии выбора );
// - регулеровка счётчика количества заказанных позиций.
//
spa.meal = (function () {
  "use strict";
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // Секция области видимости модуля.
  //
  var 
    // Статические конфигурационные параметры.
    configMap = {
      settable_map : {
        list_meals : true,

        meals_model  : true,
        basket_model : true,

        condition_ordered   : true,
        condition_unordered : true,
        
        default_val : true,
        empty_val   : true,

        button_increase : true,
        button_decrease : true,

        display_block : true,
        display_none  : true
      }, 

      $container   : undefined,
      list_meals   : undefined,

      meals_model  : null,
      basket_model : null,

      condition_ordered   : true,
      condition_unordered : false,
      
      default_val : 1,
      empty_val   : 0,

      button_increase : "increase-value",
      button_decrease : "decrease-value",

      display_block : "block",
      display_none  : "none" 
    },

    // Кэшируемая коллекция jQuery.
    jqueryMap = {},

    // Объявляем переменные области видимости модуля
    // (некоторые переменные будут присвоены позже).
    onClickButtonOrder,    changeValueCounter, setJqueryMap,
    setValueCounter,       toggleButtonOrder,  listOfMeals,
    onClickButtonsCounter, setOrderingStatus,  setDataAmount,
    configModule, initModule
    
  ;
  //----------------- END MODULE SCOPE VARIABLES ---------------
 
  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------  END UTILITY METHODS  ------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Секция представления функионального модуля meal.
  //
  // Находит необходимые элементы и кэширует их в коллекцию jQuery.
  setJqueryMap = function () {
    var 
      $main = configMap.$container,
      $menu = $main.find( ".spa-shell-main-menu" ),
      $meal = $menu.find( ".spa-meal" )
    ;

    jqueryMap = { 
      $menu            : $menu,
      $meal            : $meal,
      $button_order    : $meal.find( ".button-order" ),
      $button_increase : $meal.find( ".decrease-value" ),
      $button_decrease : $meal.find( ".increase-value" )
    };
  };


  changeValueCounter = function ( clicked_button ) {
    var 
      attr_clicked_button = clicked_button.attr('class'),
      meal = clicked_button.closest(".spa-meal"),
      increase = configMap.button_increase,
      decrease = configMap.button_decrease,

      converted_extracted_value,
      extracted_counter_value,
      calculated_new_value,
      counter_panel,
      order_button,
      counter, x
    ;

    if ( attr_clicked_button === decrease ) {
      counter                   = clicked_button.next();
      extracted_counter_value   = counter.text();
      converted_extracted_value = Number( extracted_counter_value );
      calculated_new_value      = converted_extracted_value - 1;

      if ( calculated_new_value > 0 ) {
        setValueCounter( calculated_new_value, counter );
        setDataAmount(  calculated_new_value, meal );
      } 
      else {
        counter_panel = clicked_button.parent();
        order_button  = counter_panel.prev();
        
        toggleButtonOrder( order_button );
        setDataAmount(  calculated_new_value, meal );
      }

 x = meal.attr( "data-id" );
      spa.model.basket.remove_order( x );
    } 
    else if ( attr_clicked_button === increase  || attr_clicked_button === order_button) {
      counter                   = clicked_button.prev();
      extracted_counter_value   = counter.text();
      converted_extracted_value = Number( extracted_counter_value );
      calculated_new_value      = converted_extracted_value + 1;

      setValueCounter( calculated_new_value, counter );
      setDataAmount(  calculated_new_value, meal );

//console.log( meal.attr( "data-id" ) );
//console.log( calculated_new_value);

 x = meal.attr( "data-id" );
// z = calculated_new_value;

      spa.model.basket.add_order( {id : x, amount: 1 } );
    }  
  };

  setDataAmount = function (  val, meal ) {
    var 
      data_condition   = meal.attr("data-condition"),
      empty_val     = configMap.empty_val,
      converted_val = String( empty_val )
    ;

    if ( data_condition === "false" ) {
      meal.attr( "data-amount", converted_val );
    } 
    else {
      meal.attr( "data-amount", val );
    }
    
  };

   // Установка значения в счётчик количества заказанных позиций.
  setValueCounter = function ( set_value, counter ) {
    counter.text( set_value );
  };

  // Установка статуса позиции заказа ( заказано / ожидание заказа ).
  setOrderingStatus = function ( meal ) {
    var 
      extr_str  = meal.attr( 'data-condition' ),
      converted_condition = JSON.parse( extr_str ),
      ordered   = configMap.condition_ordered,
      unordered = configMap.condition_unordered,
      default_val = configMap.default_val
    ;

    if ( converted_condition ) {
      meal.attr( 'data-condition', unordered );
    }  
    else if ( !converted_condition ) {
      meal.attr( 'data-condition', ordered );
      setDataAmount(  default_val, meal );
    }
  };

  // Переключаем счётчик на кнопку активации заказа (или наоборот) и статус.
  toggleButtonOrder = function ( button_order ) {  
    var
      counter_panel = button_order.next(),
      div_meal = button_order.closest(".spa-meal")
    ;

    setOrderingStatus( div_meal );
    button_order.toggle();
    counter_panel.toggle();
  };
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Секция контроллеров функионального модуля meal.
  //
  // Метод, вызывающий обработчик события клика по кнопке 
  // активирующей счётчик заказа позиции.
  onClickButtonOrder = function () {
    var clicked_button = $( this );
    toggleButtonOrder( clicked_button );
  };
  // Метод, вызывающий обработчик события клика по кнопкам 
  // счётчика количства заказанных позиций.
  onClickButtonsCounter = function () {
    var clicked_button = $( this );
    changeValueCounter( clicked_button );
  };
  //-------------------  END EVENT HANDLERS  -------------------


  listOfMeals = function () {

    console.log( configMap.meals_model );
    var 
      list_html       = String(), 
      meal_db         = configMap.meals_model.get_db(),

      unordered       = configMap.condition_unordered,
      ordered         = configMap.condition_ordered,

      display_block   = configMap.display_block,
      display_none    = configMap.display_none, 

      def_counter_val = configMap.default_val,
      empty_data      = configMap.empty_val,

      counter_val,
      condition_val,

      first_val, 
      second_val
    ;

    meal_db().each( function ( meal ) {
      if ( meal.amount === empty_data ) {
        counter_val = def_counter_val;
      }
      else {
        counter_val = meal.amount;
      }

      if ( meal.condition ) {
        condition_val = ordered;
        first_val  = display_none;
        second_val = display_block;
      } 
      else  {
        condition_val = unordered;
        first_val  = display_block;
        second_val = display_none;
      }

      list_html
      += '<div class="spa-meal" '
         + 'data-id="'     + meal.id + '" '
         + 'data-amount="' + meal.amount + '" '
         + 'data-condition="' + condition_val + '">'

         + '<div class="spa-meal-left-side">'
           + '<div class="spa-meal-left-side-image">'
             + '<img src="' + meal.css_map.src 
             +    '" alt="' + meal.css_map.alt + '">'
           + '</div>'
           + '<div class="spa-meal-left-side-name">'
             + '<div>'
               + '<h3>' + meal.name + '</h3>'
               + '<h4>' + meal.nutrition + '</h4>'
             + '</div>'
           + '</div>'
         + '</div>'
         + '<div class="spa-meal-right-side">'
           + '<div class="spa-meal-right-side-counter">'
             + '<h2>' 
               + '<span class="price-value">' 
                 +  meal.price 
               + '</span> Р'
             + '</h2>'
             + '<button class="button-order" '
             + 'style="display: ' + first_val + ';">'
               + 'Заказать'
             + '</button>'
             + '<div class="spa-meal-right-side-counter-panel"' 
               + 'style="display: ' + second_val + ';">'
               + '<button class="decrease-value">-</button>'
               + '<div class="counter-value">' + counter_val + '</div>'
               + '<button class="increase-value">+</button>'
             + '</div>'
           + '</div>'
         + '</div>'
       + '</div>';
    });
    
    configMap.list_meals = list_html;
  };

  //------------------- BEGIN PUBLIC METHODS -------------------
  
  configModule = function ( input_map ) {
    spa.util.setConfigMap({
      input_map    : input_map,
      settable_map : configMap.settable_map,
      config_map   : configMap
    });

    return true;
  };

  // С этого метода начинается выполнение модуля.
  initModule = function ( $spa_shell_main ) {
    var $menu; 

    configMap.$container = $spa_shell_main;
    listOfMeals();

    $menu = $("<div/>")
      .addClass("spa-shell-main-menu")
      .append(configMap.list_meals);

    configMap.$container.html( $menu );
    setJqueryMap();

    jqueryMap.$button_order.click( onClickButtonOrder );
    jqueryMap.$button_increase.click( onClickButtonsCounter );
    jqueryMap.$button_decrease.click( onClickButtonsCounter );

    return true;
  };

  return {
    configModule : configModule,
    initModule   : initModule
  };
  //------------------  END PUBLIC METHODS  --------------------
}());
