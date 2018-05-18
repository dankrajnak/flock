class Flock{
  constructor(birds){
    if(birds){
      this._list = new Set(birds);
    }
    else {
      this._list = new Set();
    }
    this.squaredDistance = 40;
  }

  addBird(bird){
    this._list.add(bird);
  }

  getNeighbors(bird){
    let neighbors = [];
    let newSet = new Set(this._list)
    newSet.delete(bird);
    for(let otherBird of newSet){
      if(bird.position.distanceToSquared(otherBird.position) < this.squaredDistance) {
        neighbors.push(otherBird);
      }
    }

    return neighbors;
  }
}
