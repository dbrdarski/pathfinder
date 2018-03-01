(function(_, $){
	"use strict";

	// const Coordinates = (...coordinates) => {
	// 	ret
	// }

	// let Enum = (...enums) => {
	// 	let obj = {};
	// 	enums.forEach((v, i, arr) => {
	// 		obj[obj[v] = i] = v;
	// 	});
	// 	return obj;
	// };

	class Enum extends Array {
		constructor (...enums) {
			super();
			enums.forEach((value, key, arr) => {
				this[this[value] = key] = value;
			});
			Object.freeze(this);
		}
	}

	function Definition (...terms) {

		class Definition extends Array {
			constructor (params) {
				super();
				if( this.constructor === params.constructor ){
					return params;
				}
				terms.forEach((value, key, arr) => {
					let i = params[key] != null ? params[key] : params[value]
					if(i != null ){
						this[value] = i;
						this[key] = i;
					}
				});
			}
		}

		let definition = class extends Definition {
			constructor (params) {
				super(params)
			}
		};

		terms.forEach((value, key, arr) => {
			definition[definition[value] = key] = value;
		});
		return Object.freeze(definition);
	}

	class Coordinates extends Definition('x', 'y') {
		constructor (params) {
			super(params);
		}
	}

	class Directions extends Definition('up', 'right', 'down', 'left') {
		constructor(params){
			super(params);
		}
	}

	const Moves = new Directions({
		up: new Coordinates([0, 1]),
		right: new Coordinates([1, 0]),
		down: new Coordinates([0, -1]),
		left: new Coordinates([-1, 0])
	})

	class Field {
		constructor (gamemap, {x, y}) {
			this.hash = `${x}x${y}`;
			this.coordinates = new Coordinates({x, y});
			this.isAccessible = true;
			this.cost = 4;
			Object.defineProperty(this, 'neighbors', {
				get: _.once(() => {
					return new Directions(
						Moves.map((v, i, moves) => {
							let x = this.coordinates.x + v.x;
							let y = this.coordinates.y + v.y;
							return gamemap.find({x,y})
						}).filter((x) => x)
					);
				})
			});
		}
	}

	const Grid = (gamemap, {x, y}) => {
		return Array.from(
			new Array(x), (val, x) => {
				// console.log({val, x})
				return Array.from(
					new Array(y), (val, y) => {
						// console.log({val, x, y})
						return new Field(gamemap, {x, y})
					}
			)}
		)
	};

	class Map {
		constructor(size) {
			size = this.size = new Coordinates(size);
			const grid = Grid(this, this.size);
			this.find = (coordinates) => {
				let {x, y} = new Coordinates(coordinates);
				x = grid[x];
				return x && x[y];
			}
			this.block = (...fields) => {
				fields.forEach( coordinates => {
					// console.log(this.find(coordinates))
					this.find(coordinates).isAccessible = false;
				})
			}
			this.shortestPath = (start, target) => shortestPath(this.find(start), this.find(target))
			this.grid = grid;
		}
	}
	class SingleLinkedList {
		constructor (head, tail) {
			this.head = head;
			if (tail) {
				if (tail.constructor !== this.constructor) throw new Error("Tail parameter must be an instance of SingleLinkedList or its subclass.");
				this.tail = tail;
			}
			this.length = 1 + (this.tail ? this.tail.length : 0);
			Object.freeze(this);
		}
		add (member) {
			return new (this.constructor)(member, this);
		}
		has (member) {
			return this.head === member || (this.tail ? this.tail.has(member) : false);
		}
		forEach (fn) {
			fn(this.head);
			this.tail && this.tail.forEach(fn);
		}
		reduce (fn, initial) {
			let acc = fn(initial, this.head);
			return this.tail ? this.tail.reduce(fn, acc) : acc;
		}
	}

	class Path extends SingleLinkedList {
		constructor(...args) {
			super(...args);
		}
		get cost() {
			return this.reduce(( acc, field ) => {
				return acc + field.cost;
			}, 0);
		}
	}

	const traverse = function (acc, paths, target) {
		let next = [];
		paths.forEach((path) => {
			path.head.neighbors.forEach( x => {
				let newPath = path.add(x);
				if ( x === target ) {
					if (!acc.match || newPath.cost < acc.match.cost) {
						acc.match = newPath;
						return;
					}
				}

				let visited = acc.visited.get(x);
				if ( (!acc.match || acc.match.cost > newPath.cost) && (!visited || newPath.cost < visited.cost) ) {
					 acc.visited.set(x, newPath);
					 next.push(newPath);
					 return;
				}
			})
		})
		return next.length ? traverse(acc, next, target) : acc;
		// console.log(acc)
	};

	const shortestPath = function (current, target) {
		if( current === target ) {
			return true;
		} else {
			let path = new Path(current);
			let acc = {
				visited: new WeakMap,
				match: false
			}
			acc.visited.set(current, path);
			return traverse(acc, [path], target);
		}
	}


	let gamemap = window.gamemap = new Map([500, 200]);

	let start = gamemap.find([0, 0]);
	let target = gamemap.find([14, 19]);
	let search = window.search = shortestPath(start, target);
	window.shortestPath = shortestPath;
	gamemap.block(
		[1,1],
		[1,2],
		[1,3],
		[1,4],
		[1,5],
		[2,5],
		[3,5],
		[4,5],
		[5,5],
		[6,5],
		[7,5],
		[8,5],
		[9,5],
		[10,5],
		[11,5],
		[12,5],
		[13,5],
		[14,5],
		[0,18],
		[1,18],
		[2,18],
		[3,18],
		[4,18],
		[5,18],
		[6,18],
		[7,18],
		[8,18],
		[9,18],
	)

	window.SingleLinkedList = SingleLinkedList;
	window.Path = Path;
	window.Coordinates = Coordinates;
	window.Directions = Directions;
	window.Moves = Moves;

	let coordinates1 = window.coordinates1 = new Coordinates([1, 2]);
	let coordinates2 = window.coordinates2 = new Coordinates({x: 3, y: 4});

	// class Path {
	// 	constructor (head, tail) {
	// 		this.head = head;
	// 		this.tail = tail;
	// 		Object.defineProperties(this, {
	// 			length: {
	// 				get: () => 1 + this.tail ? this.tail.length : 0
	// 			},
	// 			cost : {
	// 				get: () => this.head.cost + this.tail ? this.tail.cost : 0
	// 			}
	// 		})
	// 		Object.freeze(this);
	// 	}
	//
	// 	add (member) {
	// 		return new Path(member, this);
	// 	}
	// 	forEach (fn) {
	// 		fn(this.head);
	// 		this.tail && this.tail.forEach(fn);
	// 	}
	// 	reduce (fn, initial) {
	// 		let acc = fn(initial, this.head);
	// 		return this.tail ? this.tail.reduce(fn, acc) : acc;
	// 	}
	// }

	// class Coordinates extends Array {
	// 	// static definition = new Enum('x', 'y');
	// 	constructor(params){
	// 		super();
	// 		Coordinates.definition.of(params, this);
	// 	}
	// }
	//
	// const directions = Enum('up', 'right', 'down', 'left');
	//
	//
	// Coordinates.definition = new Enum('x', 'y')
	//
	// let coordinates1 = window.coordinates1 = new Coordinates([1, 2]);
	// let coordinates2 = window.coordinates2 = new Coordinates({x: 3, y: 4});


	// const Moves = (...moves) => {
	// 	ret
	// }
	// const moves = {
	// 	up: [0, 1],
	// 	right: [1, 0],
	// 	down: [0, -1],
	// 	left: [-1, 0]
	// }

	// let Field = (gmap, x, y) => ({
	// 		hash: `${x}x${y}`,
	// 		coordinates: [x, y],
	// 		neighbors: _.once(() => {
	// 			let arr = []
	// 			forEach((value, key) => {
	// 				const neighbor = gmap()
	// 			}, moves)
	// 		})
	// 	})
	//
	// var Field = (function(){
	// 	// Field module
	//
	// 	var FieldExample = {
	// 		i : 0,
	// 		hash : '0x0',
	// 		coordinates : {
	// 			x: null,
	// 			y: null
	// 		},
	// 		isAccessible: true
	// 	};
	//
	// 	var protoField = {};	// field default methods
	//
	// 	function createField(coordinates, i, isAccessible){
	// 		var properties = {
	// 			coordinates : { value : coordinates },
	// 			i : { value : i },
	// 			hash : { value : coordinates.x + "x" + coordinates.y },
	// 			isAccessible : { writable: true, value : isAccessible === undefined ? true : isAccessible }
	// 		}
	// 		return Object.create(protoField, properties);
	// 	}
	//
	// 	return {
	// 		create: createField
	// 	}
	// })();
	//
	// var GameMap = (function(Field){
	//
	// 	var MapExample = {
	// 		hashmap : {},
	// 		grid : [],
	// 		// moves : { left: {}, up: {}, right: {}, down : ((coordinates) => {x: coordinates.x, y: coordinates.y - 1}) }
	// 	}
	//
	// 	var moveXY = _.curry(function(XY, coordinates){
	// 		return {
	// 			x : coordinates.x + XY.x,
	// 			y : coordinates.y + XY.y
	// 		}
	// 	});
	//
	// 	var moves = {
	// 		up    : moveXY({x: 0, y: 1}),
	// 		right : moveXY({x: 1, y: 0}),
	// 		down  : moveXY({x: 0, y:-1}),
	// 		left  : moveXY({x:-1, y: 0})
	// 	};
	//
	// 	function findPath(start, end){
	// 		var pathExample = {
	// 			track: [1, 3, 6],
	// 			cost: 3,
	// 			current : 7,
	// 			target : 20
	// 		}
	//
	// 		var buffer = {}, 		// buffer is hash based !!!
	// 		    positives = [],
	// 			cost = 1,
	// 			shortestPath = null,
	// 			count = 0;
	//
	// 		function isAccessible(acc, a){
	// 			if( a && a.isAccessible ){
	// 				acc.push(a);
	// 				// console.log(a.hash);
	// 			}
	// 			return  acc;
	// 		}
	// 		function getCost(x){
	// 			return ++x;
	// 		}
	// 		function scout(paths){
	// 			var returnList = _.reduce(function(returnList, path){
	// 				var valid = _.reduce(isAccessible, [], path.current.neighbors) || [];
	// 				console.log(valid);
	// 				_.map(function(field){
	// 					var cost = getCost(path.cost),
	// 					    hash = path.current.hash;
	// 				    if(buffer[hash] === undefined || buffer[hash].cost > cost){
	// 						var branch = {
	// 							track : path.track.slice().push(field),
	// 							cost : cost,
	// 							current : field,
	// 							target : target
	// 						};
	// 						buffer[field.hash] = branch.cost;
	// 						returnList.pust(path);
	//
	// 						return returnList;
	// 				    }
	//
	// 				}, valid);
	// 				console.log(returnList);
	// 			}, [], paths) || [];
	// 			if(++count < 10 ){
	// 				scout(returnList);
	// 			}
	// 		}
	//
	// 		buffer[start.hash] = 0;
	//
	// 		scout([{
	// 			track    : [],
	// 			cost    : 0,
	// 			current : start,
	// 			target  : end
	// 		}]);
	//
	//
	// 		function tryPath(path){
	// 			if (path.current === undefined){
	// 				return false;
	// 			} else if( path.current === end ){
	// 				positives.push(path);
	// 				if(shortestPath === null ){
	// 					shortestPath = path;
	// 				} else if( shortestPath.cost > path.cost ){
	// 					shortestPath = path;
	// 				}
	// 				console.log(["Match!!!!!!!",count++, path.current.hash]);
	// 			} else if (
	// 				path.current.isAccessible &&
	// 				path.cost < ( shortestPath !== null ? shortestPath.cost : Infinity ) &&
	// 				(!buffer[path.current.hash] || path.cost < buffer[path.current.hash].cost)
	// 			){
	// 				buffer[path.current.hash] = path;
	// 				var branch =  {};
	// 				branch.track  = path.track.slice();
	// 				branch.cost = path.cost + cost;
	// 				branch.track.push(path.current);
	// 				// console.log([count++, path.current.hash]);
	//
	// 				// if( true){
	// 				_.mapObjIndexed(
	// 					_.compose(tryPath, function(move){
	// 						branch.current = move;
	// 						return branch;
	// 					})
	// 				, path.current.move);
	// 					//.gamemap(tryPath, function(){  });
	// 				// }
	// 			}
	// 		}
	//
	// 		// tryPath({
	// 		// 	track    : [],
	// 		// 	cost    : 0,
	// 		// 	current : start,
	// 		// 	target  : end
	// 		// });
	//
	// 		// console.log([shortestPath, positives]);
	// 		return positives;
	// 	}
	//
	// 	function GenerateMap(size){
	// 		var gamemap = {
	// 			grid: [],
	// 			hashmap : {},
	// 			moves : moves,
	// 			find : _.compose(function(hash){return gamemap.hashmap[hash]}, fieldHash),
	// 			init : function(){
	// 				gamemap.grid.map(function(field){
	// 					field.neighbors = [];
	// 					field.move = _.mapObjIndexed( function(val, index){
	// 						return ( _.compose( gamemap.find, moves[index].bind(null, field.coordinates)) )();
	// 					}, gamemap.moves);
	//
	// 					_.map(function(x){
	// 						if (x){ field.neighbors.push(x); }
	// 					} ,field.move);
	//
	// 					// var up    = _.compose( gamemap.find, moves.up.bind(null, field.coordinates)),
	// 					// console.log(moves.right.bind(null, field.coordinates)());
	// 				});
	// 			}
	// 		},
	// 		i = 0;
	//
	// 		for ( var x = 0; x < size.x; x++ ){
	// 			for ( var y = 0; y < size.y; y++ ){
	// 				var field = Field.create({x,y}, i);
	// 				gamemap.grid.push(field);
	// 				gamemap.hashmap[field.hash] = field;
	// 				i++;
	// 			}
	// 		}
	//
	// 		gamemap.path = findPath;
	// 		return gamemap;
	// 	}
	//
	// 	return {
	// 		generate : GenerateMap
	// 	}
	// })(Field);
	//
	// window.gamemap = GameMap.generate({x:10, y:10});
	//
	// [11,22,33,44,55,66,77,88].map(function(i){
	// 	window.gamemap.grid[i].isAccessible = false;
	// });
	//
	// window.gamemap.init();
	// gamemap.path(gamemap.find({x:0,y:0}),gamemap.find({x:9,y:9}));
	// // var Path = (function(GameMap, Field){
	// // })(GameMap, Field);
	//
	//
	// // End of program //
	//
	// console.log(window.gamemap);

})(R);
