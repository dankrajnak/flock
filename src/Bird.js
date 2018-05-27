class Bird{
  /**
   * Creates a new bird.
   * @param {Vector3} position [description]
   * @param {Flock} flock    [description]
   */
  constructor(position, velocity, flock){
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

  step(){
    this.velocity.add(this.calcAccleration());
    this.velocity.clampLength(0, this.maxSpeed);
    this.position.add(this.velocity);
    this.bound();
  }


  calcAccleration(){
    let neighbors = flock.getNeighbors(this);
    this.separation = this.separate(neighbors).multiplyScalar(this.separationWeight);
    this.alignment = this.getAlignment(neighbors).multiplyScalar(this.alignmentWeight);
    this.cohesion = this.cohere(neighbors).multiplyScalar(this.cohesionWeight);
    this.flockSpecificBehaviors = new THREE.Vector3();
    flock.behaviors.forEach((behavior)=>{
      this.flockSpecificBehaviors.add(behavior(this));
    });


    return this.separation.add(this.alignment).add(this.cohesion).add(this.flockSpecificBehaviors);
  }

  cohere(neighbors){
    if(neighbors.length == 0){
      //Return zero vector
      return new THREE.Vector3();
    }

    //Get centroid of neighbors
    let center = new THREE.Vector3();
    for(let neighbor of neighbors){
      center.add(neighbor.position)
    }

    center.divideScalar(neighbors.length);
    return this.steerTo(center);
  }

  getAlignment(neighbors){
    if(neighbors.length == 0) return new THREE.Vector3();

    let meanVelocity = new THREE.Vector3();

    for(let neighbor of neighbors){
      meanVelocity.add(neighbor.velocity);
    }
    meanVelocity.divideScalar(neighbors.length);
    return meanVelocity;
  }

  separate(neighbors){
    if(neighbors.length == 0) return new THREE.Vector3();
    let meanVelocity = new THREE.Vector3();
    let count = 0;
    for(let neighbor of neighbors){
      let distance = neighbor.position.distanceTo(this.position)
      if(distance == 0) return new THREE.Vector3();
      if(distance<this.minSeparation){

        meanVelocity.add((new THREE.Vector3()).subVectors(this.position, neighbor.position).normalize().divideScalar(distance));
        count++;
      }
    }
    if(count>1)
      meanVelocity.divideScalar(count);
    return meanVelocity;
  }

  steerTo(target){
    let desired = target.sub(this.position);
    let magnitude = desired.length();
    if(magnitude==0){
      return new THREE.Vector3();
    } else{
      desired.normalize();
      desired.multiplyScalar(Math.min(1, magnitude/this.maxSpeed)*this.maxSpeed);
    }

    let steer = desired.sub(this.velocity);
    steer.clampLength(0, this.maxSteerForce);

    return steer;
  }

  bound(){
    if(this.position.x>this.boundDistance){
      this.position.x -= 2*this.boundDistance;
    } else if(this.position.x < -this.boundDistance){
      this.position.x += 2*this.boundDistance;
    }

    if(this.position.y > this.boundDistance){
      this.position.y -= 2*this.boundDistance;
    } else if(this.position.y < -this.boundDistance){
      this.position.y += 2*this.boundDistance;
    }

    if(this.position.z > this.boundDistance){
      this.position.z -= 2*this.boundDistance;
    } else if(this.position.z < -this.boundDistance){
      this.position.z += 2*this.boundDistance;
    }
  }

}
