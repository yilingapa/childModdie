export default class Win {
    constructor(main) {
        this.main = main;
    }

    initWinCircle = () => {
        let {scene} = this.main;
        let circleGeometry = new THREE.CircleBufferGeometry(5, 32, 0, Math.PI * 0.5);
        let material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        });
        let circle_mesh = new THREE.Mesh(circleGeometry, material);
        circle_mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI * 1.5);
        circle_mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -Math.PI * 0.5);
        circle_mesh.position.set(-12, 0.1, -12);
        scene.add(circle_mesh);
    }

    check_win = position => {
        let {x, y, z} = position;
        let distance = Math.sqrt(Math.pow(-12 - x, 2) + Math.pow(-12 - z, 2));
        return distance < 5
    }
}