window.THREE = require('./libs/three');
require('./libs/OrbitControls');
import Objects from './objects';
import Win from './win';
import Physic from './physic';
import Control from './control';
import Gui from './gui';

window.devControl = false;

export default class Main {
    constructor() {
        let renderer = new THREE.WebGLRenderer({
            canvas
        });
        renderer.physicallyCorrectLights = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        this.renderer = renderer;

        let scene = new THREE.Scene();
        let axisHelper = new THREE.AxisHelper(5);
        scene.background = new THREE.Color(0xf0f8ff);
        scene.add(axisHelper);
        this.scene = scene;

        let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(12, 2, 12);
        camera.lookAt(scene.position);
        this.camera = camera;

        this.Objects = new Objects(this);
        this.Objects.initScene();

        this.Gui = new Gui(this);

        this.Physic = new Physic(this);
        this.Physic.initCannon();

        this.Win = new Win(this);
        this.Win.initWinCircle();

        this.Control = new Control(this);
        this.Control.initPointer();

        this.devControl();
        this.animationFrame();
    }

    devControl = () => {
        if (devControl) {
            let dev_control = new THREE.OrbitControls(this.camera, document);
            dev_control.update();
            this.dev_control = dev_control;
            let camera_helper = new THREE.CameraHelper(this.camera);
            this.camera_helper = camera_helper;
            this.scene.add(camera_helper);
        }
    }

    animationFrame = () => {
        this.animationId = window.requestAnimationFrame(
            this.animationFrame,
            canvas
        )
        if (devControl) {
            this.dev_control.update();
            this.camera_helper.update();
        }
        this.Control.control_update();
        this.Physic.updatePhysic();
        this.renderer.render(this.scene, this.camera);
    }
}