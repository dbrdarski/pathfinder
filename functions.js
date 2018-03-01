var timestamps  = []
timestamps.unshift(new Date());

var _ = (function(){

    function Nothing(){
        return Nothing;
    }
    Nothing.isNothing = true;
    Nothing.log = Nothing.p = Nothing.m = Nothing.f = Nothing;

    function Failure(message){
        return FailureFactory(arguments.callee, message);
    }
    function FailureFactory(me, data){
        function fail(){
            return arguments.callee;
        }
        fail.log = function(){
            console.log(data);
            return fail;
        };
        fail.m = fail.f = fail.p = fail;
        return fail;
    }
    
    function Container(data){
        return ContainerFactory(arguments.callee, data);
    }
    
    function ContainerFactory(me, data){
        function execute(action){
            if(arguments.length === 0){
                return data;
            }
            if(typeof action === 'function'){
                return execute.f.apply(null, arguments);
            }else if(typeof action === 'string'){
                return data[action] && typeof data[action] === 'function' ? execute.m.apply(null, arguments) : execute.p.apply(null, arguments);
            } else {
                return Nothing();
            }
        }
        execute.m = function(method){
            var args = Array.prototype.splice.call(arguments,1);
            var result = data[method].apply(data, args);
            return result === data ? execute : me(result);
        };
        execute.p = function(prop){
            return data[prop] ? me(data[prop]) : Nothing();
        };
        execute.f = function(fn){
            var result = fn(data, execute);
            return result === data ? execute : me(result);
            // return execute;
        };
        execute.check = function(){
            return CheckFactory(me, data)(()=>execute.apply(execute, arguments)());
        };
        execute.is = function(){
            return CheckFactory(me, data)(()=>execute.apply(execute, arguments)()).is();
        };
        execute.not = function(){
            return CheckFactory(me, data)(()=>execute.apply(execute, arguments)()).not();
        };
        execute.log = function(title){
            // title ? console.log(title) : null;
            // console.log(data);
            return execute;
        };
        return execute;
    }

    function Check(data){
        return CheckFactory(arguments.callee, data);
    }
    function CheckFactory(me, data){    
        var onSuccess = () => me(data),
            onFailure = () => Nothing(),
            conditionCheck,
            condition;

        function check(action){
            if(arguments.length === 0) {
                return check.resolve(1);
            } else {
                if(typeof action === 'function'){
                    conditionCheck = action;
                }
                return arguments.callee;
            }
        }

        check.onSuccess = function(fn){
            onSuccess = fn;
            return check;
        };
        check.onFailure = function(fn){
            onFailure = fn;
            return check;
        };
        check.is = function(){
            condition = (result)=>!!result;
            return check;
        };
        check.not = function(){
            condition = (result)=>!result;
            return check;
        };
        check.assert = function(n){
            condition = function(result){ return result===n; }
            return check;
        };
        check.resolve = function(){
            return condition(conditionCheck()) ? onSuccess() : onFailure();
        };
        return check;
    }

    return {
        Container    : Container,
        Nothing      : Nothing,
        Failure      : Failure
    }
})();

// var obj = {
// 	alpha : function(str){
// 		console.log(str || 'This is printed by an object method.');
// 		return this;
// 	},
// 	beta  : function(str){
// 		console.log(str || 'I love you.')
// 		return this;
// 	},
// 	one : {
// 		two : {
// 			three : {
// 				four : 'Four Roses'
// 			}
// 		}
// 	}
// };

// var o = _.Container(obj);

//    var a =o.m('alpha')
// 	.m('beta')
// 	.check(()=>('5'))
// 		.assert('5')
// 		.onFailure(()=>_.Failure("--- This is a faliure ---"))
// 		.onSuccess((x,y)=>console.log('+++ Great Success +++') || _.Container(obj))
// 		()
// 	.m('alpha', 'Do you really love me?')
// 	.m('beta', "I do.")
// 	.log()
// ;

// o.p('one')('two')('three')('four')
//  .log("===")
//  .f(function(val){
//  	console.log("=====++=====")
//  	console.log(val)
//  	console.log("=====++=====")
//  });


(function(_, $){
	"use strict";


	// /* IDEA: Use prototype inheritance for fields
	//           to differentiate between a fields:
	//           1) static/map properties (coordinates, field type etc)
	//           2) state/shared properties (units present, buildings etc)
	//           3) player specific propertis (visiblilty per player)

	//           so 3 would inherit from 2 which will inherit from 1
	// */

	// function fieldHash(x, y){
	// 	return (arguments.length === 1 && typeof x === 'object') ? x.x + "x" + x.y : x + "x" + y;
	// }

	// function deepFreeze(obj) {

	// 	// Retrieve the property names defined on obj
	// 	var propNames = Object.getOwnPropertyNames(obj);

	// 	// Freeze properties before freezing self
	// 	propNames.forEach(function(name) {
	// 		var prop = obj[name];

	// 		// Freeze prop if it is an object
	// 		if (typeof prop == 'object' && prop !== null)
	// 	    	deepFreeze(prop);

	// console.log(o);

	// 	});;   o
	// 	// Freeze self (no-op if already frozen)
	// 	return Object.freeze(obj);
	// }

	var fn = _.curry((fn, x)=>Array.apply(null, {length: x}).map(fn.call, fn));
	var range = fn(Number);
	var add = _.curry((x,y)=>x+y);
	var increment = add(1);
	var range1 = fn(_.compose(increment, Number));
	var oBJ = fn((x)=>({x:x}));
	var id = (id)=>id;

    var e = (x)=>x+1;
    var e40 = _.compose(e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e);
    var e400 = _.compose(e40, e40, e40, e40, e40, e40, e40, e40, e40, e40);

    var R = range(20000);
    var output = R
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    // .map(e)
    .map(e400)
    .map(id);

	// var Field = (function(){
	// 	// Field module

	// 	var FieldExample = {
	// 		hash : '0x0',
	// 		coordinates : {
	// 			x: null,
	// 			y: null
	// 		},
	// 		isAccessible: true
	// 	};
		
	// 	var protoField = {};	// field default methods

	// 	var createField = _.curry(function(x, y){
	// 		var properties = {
	// 			coordinates : { value : {x : x, y: y} },
	// 			hash : { value : x + "x" + y },
	// 			isAccessible : { writable: true, value : true }
	// 		}
	// 		return Object.create(protoField, properties);
	// 	});

	// 	return {
	// 		create: createField
	// 	}
	// })();

	// var Map = function(x,y){

	// 	var data = (function(x,y){
	// 		var hash = {};
	// 		var grid = [];
	// 		var data = function(hash, grid){
	// 			var f = Field.create(x,y);
	// 			grid.push(f);
	// 			hash[fieldHash(x,y)] = f;
	// 			// return f;
	// 		};
	// 		var map = fn( (x)=>fn( (y)=>( data ) )(y) )(x);
	// 		var map = function(x){
	// 			return function(y){
					
	// 			}
	// 		}
	// 		map.hash = hash;
	// 		map.grid = grid;
	// 		return map;
	// 	})(x,y);
		
	// 	var mapOverMap = function(fn, xs){
	// 		_.map(fn, (xs ? _.filter(data.grid, xs) : data.grid ) );
	// 	}

	// 	console.log(data);
	// 	console.log(range(10));
			
	// 	// var data = ;

	// 	var MapExample = {
	// 		hashmap : {},
	// 		grid : [],
	// 		// moves : { left: {}, up: {}, right: {}, down : ((coordinates) => {x: coordinates.x, y: coordinates.y - 1}) }
	// 	}
		
	// 	var moveXY = _.curry(function(XY, coordinates){
	// 		return {
	// 			x : coordinates.x + XY.x,
	// 			y : coordinates.y + XY.y
	// 		}
	// 	});

	// 	var moves = {
	// 		up    : moveXY({x: 0, y: 1}),
	// 		right : moveXY({x: 1, y: 0}),
	// 		down  : moveXY({x: 0, y:-1}),
	// 		left  : moveXY({x:-1, y: 0})
	// 	};
	
	// 	var findField = _.compose(function(hash){return gamemap.hashmap[hash]}, fieldHash);

	// 	var connectField = function(field){
	// 		field.neighbors = [];
	// 		field.move = _.mapObjIndexed( function(val, index){
	// 			return ( _.compose( findField, moves[index].bind(null, field.coordinates)) )();
	// 		}, gamemap.moves);

	// 		_.map(function(x){
	// 			if (x){ field.neighbors.push(x); }
	// 		} ,field.move);
			
	// 		// var up    = _.compose( gamemap.find, moves.up.bind(null, field.coordinates)),
	// 		// console.log(moves.right.bind(null, field.coordinates)());						
	// 	};		

	// 	return {
	// 		_ : mapOverMap,
	// 		init: ()=>_.map(connectField, data)
	// 	}
	// };

	// // window.gamemap = GameMap.generate({x:10, y:10});

	// var theGameMap = Map(10, 10)
	// ._(
	// 	function(i){this.isAccessible = false;},
	// 	[11,22,33,44,55,66,77,88]
	// )
	// ;
	

	// window.gamemap.init();
	// gamemap.path(gamemap.find({x:0,y:0}),gamemap.find({x:9,y:9}));
	// // var Path = (function(GameMap, Field){
	// // })(GameMap, Field);


	// // End of program //

// 	// console.log(window.gamemap);
	timestamps.unshift(new Date());
    console.log(output);
    console.log('==========');
	console.log('TIME SPENT');
    console.log('==========');

	console.log(
		timestamps
			.map(Number)
			.reduce( function(start,x){ return start === undefined ? x : start - x; })
		)
	;


})(R, jQuery);

