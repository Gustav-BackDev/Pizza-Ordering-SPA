/*
 * spa.model.js
 * Model module
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global TAFFY, $, spa */

spa.model = ( function () { 
  "use strict";

  var 
		configMap = {
			basket_map : { 
				orders : null,
				total  : undefined, 
				amount : undefined
			},
			condition : {
				ordered   : true,
				unordered : false
			},
		}, 
    stateMap = { 
      meal_cid_map : {},
      meal_db      :TAFFY(),
      basket       : null 
   },

    isFakeData = true,
   
    makeMeal, mealProto,  
    meals, basket,
    initModule
  ;

  mealProto = {
    get_is_ordered : function () {
      return this.condition === configMap.condition.ordered;
    },
		get_is_unordered : function () {
			return this.condition === configMap.condition.unordered;
		}
  };

  makeMeal = function ( meal_map ) {
    var 
      meal,
      cid       = meal_map.cid,
      id        = meal_map.id,
      name      = meal_map.name,
      price     = meal_map.price,
      nutrition = meal_map.nutrition,
      amount    = meal_map.amount,
      condition = meal_map.condition,
      css_map   = meal_map.css_map
    ;

    meal           = Object.create( mealProto );
    meal.cid       = cid;
    meal.name      = name;
    meal.price     = price;
    meal.nutrition = nutrition;
    meal.amount    = amount;
    meal.condition = condition;
    meal.css_map   = css_map;

    if ( id ) { meal.id = id; }

    stateMap.meal_cid_map[ cid ] = meal;
    stateMap.meal_db.insert( meal );
  };

  meals = (function (){
    var 
      get_db,
      loadMeals
    ;

  	get_db = function () { return stateMap.meal_db; };

    loadMeals = function ( meal_list ) {
      var i, meal_map, make_meal_map;

      MEALS:
        for ( i = 0; i < meal_list.length; i++ ) {
          meal_map = meal_list[ i ];

          if ( ! meal_map.name ) { continue MEALS; }

          make_meal_map = {
            cid       : meal_map._id,
            id        : meal_map._id,
            name      : meal_map.name,
            price     : meal_map.price,
            nutrition : meal_map.nutrition,
            amount    : meal_map.amount,
            condition : meal_map.condition,
            css_map   : meal_map.css_map
          };
          makeMeal( make_meal_map );
        }
    }; 

    return {
      get_db    : get_db,
      loadMeals : loadMeals
    };
  }()); 

  basket = (function () {
		var get_by_cid, get_basket, add_order, remove_order;
    
		// Созданный экземпляр из клиенстского хранилища
		get_by_cid = function ( cid ) {
      return stateMap.meal_cid_map[ cid ];
		};

		get_basket = function () {
			return stateMap.basket;
		}; 

		add_order = function ( order ) {
			var 
			  id       = order.id,
		    instance = basket.get_by_cid( id ),
        price    = instance.price,
        amount   = order.amount,
        total    = amount * price,
			  orders   = stateMap.basket.orders
			;

			stateMap.basket.amount = amount + stateMap.basket.amount;
			stateMap.basket.total  = total  + stateMap.basket.total;

			if ( orders[ id ] ) {
				orders[ id ].amount = orders[ id ].amount + amount;
			} 
			else {
  		  orders[ id ] = order;
			}

			console.log( stateMap.basket );
		};

		remove_order = function ( id ) {
			if ( stateMap.basket.orders[ id ] ) {
		 	  var 
					instance = basket.get_by_cid( id ),
				  price    = instance.price,
			    orders   = stateMap.basket.orders
				;

			  stateMap.basket.amount = stateMap.basket.amount - 1;
  			stateMap.basket.total  = stateMap.basket.total - price;

				if ( orders[ id ].amount === 1  ) {
          delete orders[ id ];
				}
			 	else {
          orders[ id ].amount = orders[ id ].amount - 1;
				}

				console.log( stateMap.basket );
			} 
			else {
        console.log(stateMap.basket);
				return false;
			}
		};

		return {
      get_by_cid   : get_by_cid,
			get_basket   : get_basket,
			add_order    : add_order,
			remove_order : remove_order
		}; 
  }()); 

  initModule = function () {
    var meal_list;

    if ( isFakeData ) {
      meal_list = spa.fake.getMealList(); 
      meals.loadMeals( meal_list );
    }

		configMap.basket_map.orders = {}; 
		configMap.basket_map.amount = 0;
		configMap.basket_map.total  = 0;
    stateMap.basket = configMap.basket_map;
  };

  return {
  	initModule : initModule,
  	meals      : meals,
    basket     : basket
  }; 
}());

/* 
  Работа с моделью в браузерной консоли

  Получить базу данных блюд. 
  var mealDb = spa.model.meals.get_db();
  
  Коллекция экземпляров {1}, {2}, {3}, ...
  var mealsList = mealDb().get();

  Пройтись по всем экземплярам и показать каждое имя. 
  mealDb().each(function( meal, idx ){ console.log(meal.name); });

  Показать имя, выбранного экземпляра.
  var meal = mealDb( {cid:'id_03'} ).first();
  meal.name

  Работа с корзиной заказа: добавить, вынуть и посмотерть.
	var addOrder = spa.model.basket.add_order({id:"id_02",amount:2});
  var removeOrder = spa.model.basket.remove_order( "id_02"  );
*/
