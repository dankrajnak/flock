"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bird = function () {
  /**
   * Creates a new bird.
   * @param {Vector3} position [description]
   * @param {Flock} flock    [description]
   */
  function Bird(position, velocity, flock) {
    _classCallCheck(this, Bird);

    this.position = position;
    this.velocity = velocity;
    this.flock = flock;

    this.separationWeight = .1;
    this.alignmentWeight = .5;
    this.cohesionWeight = 1;
    this.maxSpeed = .2;
    this.maxSteerForce = 0.02;
    this.minSeparation = 2;
    this.boundDistance = 80;
  }

  _createClass(Bird, [{
    key: "step",
    value: function step() {
      this.velocity.add(this.calcAccleration());
      this.velocity.clampLength(0, this.maxSpeed);
      this.position.add(this.velocity);
      this.bound();
    }
  }, {
    key: "calcAccleration",
    value: function calcAccleration() {
      var _this = this;

      var neighbors = flock.getNeighbors(this);
      this.separation = this.separate(neighbors).multiplyScalar(this.separationWeight);
      this.alignment = this.getAlignment(neighbors).multiplyScalar(this.alignmentWeight);
      this.cohesion = this.cohere(neighbors).multiplyScalar(this.cohesionWeight);
      this.flockSpecificBehaviors = new THREE.Vector3();
      flock.behaviors.forEach(function (behavior) {
        _this.flockSpecificBehaviors.add(behavior(_this));
      });

      return this.separation.add(this.alignment).add(this.cohesion).add(this.flockSpecificBehaviors);
    }
  }, {
    key: "cohere",
    value: function cohere(neighbors) {
      if (neighbors.length == 0) {
        //Return zero vector
        return new THREE.Vector3();
      }

      //Get centroid of neighbors
      var center = new THREE.Vector3();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = neighbors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var neighbor = _step.value;

          center.add(neighbor.position);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      center.divideScalar(neighbors.length);
      return this.steerTo(center);
    }
  }, {
    key: "getAlignment",
    value: function getAlignment(neighbors) {
      if (neighbors.length == 0) return new THREE.Vector3();

      var meanVelocity = new THREE.Vector3();

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = neighbors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var neighbor = _step2.value;

          meanVelocity.add(neighbor.velocity);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      meanVelocity.divideScalar(neighbors.length);
      return meanVelocity;
    }
  }, {
    key: "separate",
    value: function separate(neighbors) {
      if (neighbors.length == 0) return new THREE.Vector3();
      var meanVelocity = new THREE.Vector3();
      var count = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = neighbors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var neighbor = _step3.value;

          var distance = neighbor.position.distanceTo(this.position);
          if (distance == 0) return new THREE.Vector3();
          if (distance < this.minSeparation) {

            meanVelocity.add(new THREE.Vector3().subVectors(this.position, neighbor.position).normalize().divideScalar(distance));
            count++;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (count > 1) meanVelocity.divideScalar(count);
      return meanVelocity;
    }
  }, {
    key: "steerTo",
    value: function steerTo(target) {
      var desired = target.sub(this.position);
      var magnitude = desired.length();
      if (magnitude == 0) {
        return new THREE.Vector3();
      } else {
        desired.normalize();
        desired.multiplyScalar(Math.min(1, magnitude / this.maxSpeed) * this.maxSpeed);
      }

      var steer = desired.sub(this.velocity);
      steer.clampLength(0, this.maxSteerForce);

      return steer;
    }
  }, {
    key: "bound",
    value: function bound() {
      if (this.position.x > this.boundDistance) {
        this.position.x -= 2 * this.boundDistance;
      } else if (this.position.x < -this.boundDistance) {
        this.position.x += 2 * this.boundDistance;
      }

      if (this.position.y > this.boundDistance) {
        this.position.y -= 2 * this.boundDistance;
      } else if (this.position.y < -this.boundDistance) {
        this.position.y += 2 * this.boundDistance;
      }

      if (this.position.z > this.boundDistance) {
        this.position.z -= 2 * this.boundDistance;
      } else if (this.position.z < -this.boundDistance) {
        this.position.z += 2 * this.boundDistance;
      }
    }
  }]);

  return Bird;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Flock = function () {
  function Flock(birds) {
    _classCallCheck(this, Flock);

    if (birds) {
      this._list = new Set(birds);
    } else {
      this._list = new Set();
    }
    this.squaredDistance = 40;
  }

  _createClass(Flock, [{
    key: "addBird",
    value: function addBird(bird) {
      this._list.add(bird);
    }
  }, {
    key: "getNeighbors",
    value: function getNeighbors(bird) {
      var neighbors = [];
      var newSet = new Set(this._list);
      newSet.delete(bird);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = newSet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var otherBird = _step.value;

          if (bird.position.distanceToSquared(otherBird.position) < this.squaredDistance) {
            neighbors.push(otherBird);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return neighbors;
    }
  }]);

  return Flock;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RandFlock = function () {
  function RandFlock(birds) {
    var _this = this;

    var numNeighborhoods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    _classCallCheck(this, RandFlock);

    this._neighborhoods = [];
    for (var i = 0; i < numNeighborhoods; i++) {
      this._neighborhoods.push(new Set());
    }
    if (birds) {
      birds.forEach(function (bird) {
        _this._neighborhoods[Math.floor(Math.random() * numNeighborhoods)].add(bird);
      });
    }
    //Reset neighborhoods every 45 seconds.
    this.resetInterval = setInterval(function () {
      var allBirds = [];
      _this._neighborhoods.forEach(function (neighborhood) {
        neighborhood.forEach(function (bird) {
          return allBirds.push(bird);
        });
        neighborhood.clear();
      });
      allBirds.forEach(function (bird) {
        return _this._neighborhoods[Math.floor(Math.random() * _this._neighborhoods.length)].add(bird);
      });
    }, 45 * 1000);

    //Extra behioviors for each bird
    this.behaviors = [];
    var avoidOtherNeighborHoods = function avoidOtherNeighborHoods(bird) {
      //Find all the birds in other neighborhoods
      var otherNeighborhoodBirds = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this._neighborhoods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var neighborhood = _step.value;

          if (!neighborhood.has(bird)) {
            otherNeighborhoodBirds.concat(Array.from(neighborhood));
          }
        }

        //Look through all these to find birds within distance
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var maxDistance = 5;
      var meanVelocity = new THREE.Vector3();
      var count = 0;
      otherNeighborhoodBirds.forEach(function (otherBird) {
        var distance = otherBird.position.distanceTo(bird.position);
        if (distance < maxDistance) {
          meanVelocity.add(new THREE.Vector3().subVectors(otherBird.position, bird.position).normalize().divideScalar(distance));
          count++;
        }
      });
      if (count > 1) meanVelocity.divideScalar(count);
      return meanVelocity;
    };

    this.behaviors.push(avoidOtherNeighborHoods);
  }

  _createClass(RandFlock, [{
    key: "addBird",
    value: function addBird(bird) {
      this._neighborhoods[Math.floor(Math.random() * this._neighborhoods.length)].add(bird);
    }
  }, {
    key: "getNeighbors",
    value: function getNeighbors(bird) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this._neighborhoods[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var neighborhood = _step2.value;

          if (neighborhood.has(bird)) {
            return Array.from(neighborhood);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);

  return RandFlock;
}();
'use strict';

var size = { width: window.innerWidth, height: window.innerHeight };
var scene = new THREE.Scene();
scene.background = new THREE.Color('#F6E9D5');

var fog = new THREE.Fog();
fog.far = 100;
fog.color = new THREE.Color('#F6E9D5');
scene.fog = fog;

//args: FOV, apsect ration, near and far clipping planes
var camera = new THREE.PerspectiveCamera(70, size.width / size.height, 0.1, 200);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(size.width, size.height);

//Add canvas to HTML body
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereBufferGeometry(.5, 12, 12);

// This color below isn't actually #222, it's actually #000222.  I originally intended
// to make it #222, but the slight blue is actually super nice.
var material = new THREE.MeshBasicMaterial({ color: 0x222 });
var cube = new THREE.Mesh(geometry, material);
var otherCube = new THREE.Mesh(geometry, material);

var flock = new RandFlock();
var flockArray = [];
var shapeArray = [];
var numBirds = 300;
for (var i = 0; i < numBirds; i++) {
  var newBird = new Bird(new THREE.Vector3(80 * (Math.random() - .5), 80 * (Math.random() - .5), 80 * (Math.random() - .5)), new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5), flock);
  newBird.maxSpeed = newBird.maxSpeed * (1 + Math.random());
  flock.addBird(newBird);
  flockArray.push(newBird);
  var newShape = new THREE.Mesh(geometry, material);
  scene.add(newShape);
  shapeArray.push(newShape);
}

var controls = new THREE.TrackballControls(camera);
camera.position.z = 50;
controls.noZoom = true;
controls.noPan = true;
controls.rotateSpeed = 2.0;

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize(); // for TrackballControls
}

var animate = function animate() {
  requestAnimationFrame(animate);
  for (var _i = 0; _i < flockArray.length; _i++) {
    flockArray[_i].step();
    shapeArray[_i].position.copy(flockArray[_i].position);
  }
  controls.update();
  renderer.render(scene, camera);
};
animate();

setTimeout(function () {
  var index = 0;

  var _loop = function _loop(p) {

    setTimeout(function () {
      p.style.opacity = 0;
    }, index++ * 750);
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = document.getElementsByTagName('p')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var p = _step.value;

      _loop(p);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  ;
}, 20 * 1000);
