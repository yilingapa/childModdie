export default class {
    constructor(main) {
        this.main = main
    }

    initScene = () => {
        let _this = this.main;
        let bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
        let bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
        bulbLight.power = 2000;
        let bulbMat = new THREE.MeshStandardMaterial({
            emissive: 0xffffee,
            emissiveIntensity: 1,
            color: 0x000000
        });
        bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
        bulbLight.position.set(-4, 5, -4);
        bulbLight.castShadow = true;
        _this.scene.add(bulbLight);
        let hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
        _this.scene.add(hemiLight);

        let floorMat = new THREE.MeshStandardMaterial({
            roughness: 0.8,
            metalness: 0.2,
        });
        let ballMat = new THREE.MeshStandardMaterial({
            roughness: 0.2,
            metalness: 1.0,
            color: 0xfb3c00
        });
        let ballMat_1 = new THREE.MeshStandardMaterial({
            roughness: 0.2,
            metalness: 1.0,
            color: 0x2196f3
        });
        let textureLoader = new THREE.TextureLoader();
        textureLoader.load("images/hardwood2_diffuse.jpg", function (map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 2;
            map.repeat.set(2, 2);
            floorMat.map = map;
            floorMat.needsUpdate = true;
        });
        let geometry = new THREE.SphereBufferGeometry(0.4, 16, 16);
        let ball = new THREE.Mesh(geometry, ballMat);
        ball.castShadow = true;
        ball.position.set(0, 0, 0.4);
        _this.scene.add(ball);
        this.ball = ball;

        let ball_1 = new THREE.Mesh(geometry, ballMat_1);
        ball_1.castShadow = true;
        ball_1.position.set(0, 0, 0.4);
        _this.scene.add(ball_1);
        this.ball_1 = ball_1;


        let floorGeometry = new THREE.PlaneBufferGeometry(95, 95);
        let floorMesh = new THREE.Mesh(floorGeometry, floorMat);
        floorMesh.receiveShadow = true;
        floorMesh.position.set(0, 0, 0);
        floorMesh.rotateX(-Math.PI * 0.5);
        _this.scene.add(floorMesh);
        this.floor = floorMesh;

        let coordinate_material_param = {
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
        };

        let coordinate_geometry = new THREE.PlaneBufferGeometry(24, 0.8);
        let coordinate_material = new THREE.MeshLambertMaterial(coordinate_material_param);
        let coordinate = new THREE.Mesh(coordinate_geometry, coordinate_material);
        coordinate.position.set(0, 0.1, 12);
        _this.scene.add(coordinate);

        let coordinate_geometry_1 = new THREE.PlaneBufferGeometry(24, 0.8);
        let coordinate_material_1 = new THREE.MeshLambertMaterial(coordinate_material_param);
        let coordinate_1 = new THREE.Mesh(coordinate_geometry_1, coordinate_material_1);
        coordinate_1.position.set(0, 0.1, -12);
        _this.scene.add(coordinate_1);

        let coordinate_geometry_2 = new THREE.PlaneBufferGeometry(24, 0.8);
        let coordinate_material_2 = new THREE.MeshLambertMaterial(coordinate_material_param);
        let coordinate_2 = new THREE.Mesh(coordinate_geometry_2, coordinate_material_2);
        coordinate_2.position.set(12, 0.1, 0);
        coordinate_2.rotateY(Math.PI / 2);
        _this.scene.add(coordinate_2);

        let coordinate_geometry_4 = new THREE.PlaneBufferGeometry(24, 0.8);
        let coordinate_material_4 = new THREE.MeshLambertMaterial(coordinate_material_param);
        let coordinate_4 = new THREE.Mesh(coordinate_geometry_4, coordinate_material_4);
        coordinate_4.position.set(-12, 0.1, 0);
        coordinate_4.rotateY(Math.PI / 2);
        _this.scene.add(coordinate_4);
    }
}