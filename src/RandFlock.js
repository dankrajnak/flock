class RandFlock{
  constructor(birds, numNeighborhoods=10){
    this._neighborhoods = [];
    for(let i=0; i<numNeighborhoods; i++){
      this._neighborhoods.push(new Set());
    }
    if(birds){
      birds.forEach((bird)=>{
        this._neighborhoods[Math.floor(Math.random()*numNeighborhoods)].add(bird);
      })
    }
    //Reset neighborhoods every 45 seconds.
    this.resetInterval = setInterval(()=>{
      let allBirds = [];
      this._neighborhoods.forEach(neighborhood => {
        neighborhood.forEach(bird=>allBirds.push(bird));
        neighborhood.clear();
      });
      allBirds.forEach(bird=>this._neighborhoods[Math.floor(Math.random()*this._neighborhoods.length)].add(bird));
    }, 45*1000);

    //Extra behioviors for each bird
    this.behaviors = [];
    let avoidOtherNeighborHoods = (bird)=> {
      //Find all the birds in other neighborhoods
      let otherNeighborhoodBirds = [];
      for(let neighborhood of this._neighborhoods){
        if(!neighborhood.has(bird)){
          otherNeighborhoodBirds.concat(Array.from(neighborhood));
        }
      }

      //Look through all these to find birds within distance
      let maxDistance = 5;
      let meanVelocity = new THREE.Vector3();
      let count = 0;
      otherNeighborhoodBirds.forEach((otherBird)=>{
        let distance = otherBird.position.distanceTo(bird.position);
        if(distance<maxDistance){
          meanVelocity.add((new THREE.Vector3()).subVectors(otherBird.position, bird.position).normalize().divideScalar(distance));
          count++;
        }
      });
      if(count>1)
        meanVelocity.divideScalar(count);
      return meanVelocity;
    }

    this.behaviors.push(avoidOtherNeighborHoods)
  }

  addBird(bird){
    this._neighborhoods[Math.floor(Math.random()*this._neighborhoods.length)].add(bird);
  }

  getNeighbors(bird){
    for(let neighborhood of this._neighborhoods){
      if(neighborhood.has(bird)){
        return Array.from(neighborhood);
      }
    }
  }


}
