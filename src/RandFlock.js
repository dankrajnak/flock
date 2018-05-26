class RandFlock{
  constructor(birds){
    let numNeighborhoods = 10;
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
