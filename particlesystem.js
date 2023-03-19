export class particleSystem {
    constructor(flowFieldX, flowFieldY, flowFieldZ, gridStep) {
        this.maxX = flowFieldX;
        this.maxY = flowFieldY;
        this.maxZ = flowFieldZ;
        this.gridwidth = gridStep

    }

    createFlowField() {
        let vertices = new Float32Array(
            ((this.maxX / this.gridwidth) * (this.maxY / this.gridwidth) * (this.maxZ / this.gridwidth)) * 3);
        
        // let counter = 0;
        loop1:
        for (let x = 0; x < this.maxX / this.gridwidth; x++) {
        loop2:    
            for (let y = 0; y < this.maxY / this.gridwidth; y++) {
        loop3:       
                for (let z = 0; z < this.maxZ / this.gridwidth; z++) {
        
                    let index = x + this.maxX / this.gridwidth * (y + this.maxY / this.gridwidth * z);
                    // let index = x + (y * this.maxX) + (z * this.maxX * this.maxY)
                    
                    index *= 3;
                    vertices[index + 0] = x * this.gridwidth + this.gridwidth / 2;
                    vertices[index + 1] = y * this.gridwidth + this.gridwidth / 2;
                    vertices[index + 2] = z * this.gridwidth + this.gridwidth / 2;
                    // if (true) {
                    //     break loop1;
                    // }
                    // counter++;
                }
            }
        }
        return vertices
    }
}