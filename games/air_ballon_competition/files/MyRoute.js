import * as THREE from 'three';

export class MyRoute {
    constructor() {

        //Points in the catmull
        this.route1 = [   
            { x: -20, y: -20, z: 109 },
            { x: 37, y: -10, z: 99 },
            { x: 45, y: 0, z: 95 },
            { x: 105, y: 10, z: 89 },
            { x: 137, y: 10, z: 58 },
            { x: 125, y: 10, z: 47 },
            { x: 30, y: 10, z: 2 },
            { x: 42, y: 0, z: -25 },
            { x: 79, y: -10, z: -43 },
            { x: 123, y: -20, z: -70 },
            { x: 130, y: -20, z: -90 },
            { x: 89, y: -20, z: -112 },
            { x: 25, y: -10, z: -115 },
            { x: -60, y: 0, z: -116 },
            { x: -104, y: 0, z: -100 },
            { x: -118, y: 0, z: -89 },
            { x: -120, y: 10, z: -10 },
            { x: -120, y: 0, z: 41 },
            { x: -98, y: 0, z: 89 },
            { x: -95, y: -10, z: 107 },
            { x: -65, y: -20, z: 112 },
            { x: -20, y: -20, z: 109 }
        ];
        
        
    }

    getPointsRoute1() {
    
        return this.route1.map(point => ({ ...point }));
    }
}