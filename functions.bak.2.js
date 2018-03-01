(function(_, $){
	"use strict";

	var Container = function(x) {
  		this.__value = x;
	}

	Container.of = function(x) { return new Container(x); };
	// (a -> b) -> Container a -> Container b
	Container.prototype.map = function(f) {
		return Container.of(f(this.__value));
	}

	var Maybe = function(x) {
		this.__value = x;
	};

	Maybe.of = function(x) {
	 	return new Maybe(x);
	};

	Maybe.prototype.isNothing = function() {
		return (this.__value === null || this.__value === undefined);
	};

	Maybe.prototype.map = function(f) {
		return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
	};

	var map = _.curry(function(f, any_functor_at_all) {
  		return any_functor_at_all.map(f);
	});

	function fieldHash(x, y){		
		return (arguments.length === 1 && typeof x === 'object') ? x.x + "x" + x.y : x + "x" + y;
	}

	function deepFreeze(obj) {

		// Retrieve the property names defined on obj
		var propNames = Object.getOwnPropertyNames(obj);

		// Freeze properties before freezing self
		propNames.forEach(function(name) {
			var prop = obj[name];

			// Freeze prop if it is an object
			if (typeof prop == 'object' && prop !== null)
		    	deepFreeze(prop);
		});

		// Freeze self (no-op if already frozen)
		return Object.freeze(obj);
	}

	var Field = (function(){
		// Field module

		var FieldExample = {
			i : 0,
			hash : '0x0',
			coordinates : {
				x: null,
				y: null
			},
			isAccessible: true
		};
		
		var protoField = {};	// field default methods

		function createField(coordinates, i, isAccessible){
			var properties = {
				coordinates : { value : coordinates },
				i : { value : i },
				hash : { value : coordinates.x + "x" + coordinates.y },
				isAccessible : { writable: true, value : isAccessible === undefined ? true : isAccessible }
			}
			return Object.create(protoField, properties);
		}

		return {
			create: createField
		}
	})();

	var GameMap = (function(Field){

		var MapExample = {
			hashmap : {},
			grid : [],
			// moves : { left: {}, up: {}, right: {}, down : ((coordinates) => {x: coordinates.x, y: coordinates.y - 1}) }
		}
		
		var moveXY = _.curry(function(XY, coordinates){
			return {
				x : coordinates.x + XY.x,
				y : coordinates.y + XY.y
			}
		});

		var moves = {
			up    : moveXY({x: 0, y: 1}),
			right : moveXY({x: 1, y: 0}),
			down  : moveXY({x: 0, y:-1}),
			left  : moveXY({x:-1, y: 0})
		};

		function findPath(start, end){
			var pathExample = {
				track: [1, 3, 6],
				cost: 3,
				current : 7,
				target : 20
			}

			var buffer = {}, 		// buffer is hash based !!!
			    positives = [],
				cost = 1,
				shortestPath = null,				
				count = 0;

			function isAccessible(acc, a){
				if( a && a.isAccessible ){
					acc.push(a);
					// console.log(a.hash);				
				}
				return  acc;
			}
			function getCost(x){
				return ++x;
			}
			function scout(paths){
				var returnList = _.reduce(function(returnList, path){
					var valid = _.reduce(isAccessible, [], path.current.neighbors) || [];
					console.log(valid);
					_.map(function(field){
						var cost = getCost(path.cost),
						    hash = path.current.hash;
					    if(buffer[hash] === undefined || buffer[hash].cost > cost){
							var branch = {
								track : path.track.slice().push(field),
								cost : cost,
								current : field,
								target : target
							};
							buffer[field.hash] = branch.cost;
							returnList.pust(path);

							return returnList;
					    }

					}, valid);
					console.log(returnList);
				}, [], paths) || [];
				if(++count < 10 ){
					scout(returnList);
				}
			}

			buffer[start.hash] = 0;
			
			scout([{
				track    : [],
				cost    : 0,
				current : start,
				target  : end
			}]);


			function tryPath(path){
				if (path.current === undefined){
					return false;
				} else if( path.current === end ){
					positives.push(path);
					if(shortestPath === null ){
						shortestPath = path;
					} else if( shortestPath.cost > path.cost ){
						shortestPath = path;
					}					
					console.log(["Match!!!!!!!",count++, path.current.hash]);
				} else if ( 	
					path.current.isAccessible && 
					path.cost < ( shortestPath !== null ? shortestPath.cost : Infinity ) && 
					(!buffer[path.current.hash] || path.cost < buffer[path.current.hash].cost) 
				){
					buffer[path.current.hash] = path;
					var branch =  {};
					branch.track  = path.track.slice();
					branch.cost = path.cost + cost;
					branch.track.push(path.current);
					// console.log([count++, path.current.hash]);

					// if( true){
					_.mapObjIndexed(
						_.compose(tryPath, function(move){
							branch.current = move;
							return branch;
						})
					, path.current.move);
						//.gamemap(tryPath, function(){  });
					// }
				}
			}

			// tryPath({
			// 	track    : [],
			// 	cost    : 0,
			// 	current : start,
			// 	target  : end
			// });

			// console.log([shortestPath, positives]);
			return positives;
		}

		function GenerateMap(size){
			var gamemap = {
				grid: [],
				hashmap : {},
				moves : moves,				
				find : _.compose(function(hash){return gamemap.hashmap[hash]}, fieldHash),				
				init : function(){
					gamemap.grid.map(function(field){
						field.neighbors = [];
						field.move = _.mapObjIndexed( function(val, index){
							return ( _.compose( gamemap.find, moves[index].bind(null, field.coordinates)) )();
						}, gamemap.moves);

						_.map(function(x){
							if (x){ field.neighbors.push(x); }
						} ,field.move);
						
						// var up    = _.compose( gamemap.find, moves.up.bind(null, field.coordinates)),
						// console.log(moves.right.bind(null, field.coordinates)());						
					});					
				}
			},
			i = 0;

			for ( var x = 0; x < size.x; x++ ){
				for ( var y = 0; y < size.y; y++ ){
					var field = Field.create({x,y}, i);
					gamemap.grid.push(field);
					gamemap.hashmap[field.hash] = field;
					i++;
				}
			}

			gamemap.path = findPath;
			return gamemap;
		}

		return {
			generate : GenerateMap
		}
	})(Field);

	window.gamemap = GameMap.generate({x:10, y:10});

	[11,22,33,44,55,66,77,88].map(function(i){
		window.gamemap.grid[i].isAccessible = false;
	});

	window.gamemap.init();
	gamemap.path(gamemap.find({x:0,y:0}),gamemap.find({x:9,y:9}));
	// var Path = (function(GameMap, Field){
	// })(GameMap, Field);


	// End of program //

	console.log(window.gamemap);

})(R, jQuery);