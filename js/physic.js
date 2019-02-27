const CANNON = require('./libs/cannon');

export default class Physic {
    constructor(main) {
        this.main = main;
    }

    initCannon = () => {
        let world = new CANNON.World();
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;
        world.solver.iterations = 10;
        world.gravity.set(0, -10, 0);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.allowSleep = true;
        world.defaultContactMaterial.contactEquationStiffness = 1e7;
        world.defaultContactMaterial.contactEquationRelaxation = 5;

        //平板的碰撞模型
        let groundMaterial = new CANNON.Material();
        let groundShape = new CANNON.Plane();
        let groundBody = new CANNON.Body({
            mass: 0,
            material: groundMaterial,
        });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        groundBody.addShape(groundShape);
        world.add(groundBody);
        this.groundBody = groundBody;

        let bord_1 = new CANNON.Material();
        let bord_1_shape = new CANNON.Plane();
        let bord_1_body = new CANNON.Body({
            mass: 0,
            material: bord_1,
        });
        bord_1_body.position.set(0, 0.1, 12);
        bord_1_body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI);
        bord_1_body.addShape(bord_1_shape);
        world.add(bord_1_body);

        let bord_2 = new CANNON.Material();
        let bord_2_shape = new CANNON.Plane();
        let bord_2_body = new CANNON.Body({
            mass: 0,
            material: bord_2,
        });
        bord_2_body.position.set(0, 0.1, -12);
        bord_2_body.addShape(bord_2_shape);
        world.add(bord_2_body);

        let bord_3 = new CANNON.Material();
        let bord_3_shape = new CANNON.Plane();
        let bord_3_body = new CANNON.Body({
            mass: 0,
            material: bord_3,
            position: new CANNON.Vec3(12, 0.1, 0)
        });
        bord_3_body.addShape(bord_3_shape);
        bord_3_body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * 1.5);
        world.add(bord_3_body);

        let bord_4 = new CANNON.Material();
        let bord_4_shape = new CANNON.Plane();
        let bord_4_body = new CANNON.Body({
            mass: 0,
            material: bord_4,
            position: new CANNON.Vec3(-12, 0.1, 0)
        });
        bord_4_body.addShape(bord_4_shape);
        bord_4_body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
        world.add(bord_4_body);

        let basic_ball_body_param = {
            mass: 5,
            linearDamping: 0.1,
            angularDamping: 0.8,
            sleepSpeedLimit: 0.4,
            sleepTimeLimit: 0.1,
            allowSleep: true
        };

        //球体的碰撞模型
        let ballShape = new CANNON.Sphere(0.4);
        let ballMaterial = new CANNON.Material();
        let ballBody = new CANNON.Body({
            material: ballMaterial,
            ...basic_ball_body_param,
        });
        ballBody.position.set(8, 2.5, 0);
        ballBody.addShape(ballShape);
        world.add(ballBody);
        this.ballBody = ballBody;

        let ballShape_1 = new CANNON.Sphere(0.4);
        let ballMaterial_1 = new CANNON.Material();
        let ballBody_1 = new CANNON.Body({
            material: ballMaterial_1,
            ...basic_ball_body_param,
        });
        ballBody_1.position.set(0, 2.5, 8);
        ballBody_1.addShape(ballShape_1);
        world.add(ballBody_1);
        this.ballBody_1 = ballBody_1;

        let ball_ground = new CANNON.ContactMaterial(groundMaterial, ballMaterial, {
            friction: 0.4,
            restitution: 0.3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3,
            frictionEquationStiffness: 1e8,
            frictionEquationRegularizationTime: 3,
        });
        world.addContactMaterial(ball_ground);

        this.world = world;
        let normal_concat_config = {
            friction: 1,
            restitution: 0.7
        };
        this.add_normal_concat([bord_1, bord_2, bord_3, bord_4], ballMaterial, normal_concat_config);
        this.add_normal_concat([bord_1, bord_2, bord_3, bord_4], ballMaterial_1, normal_concat_config);
        this.add_normal_concat([ballMaterial], ballMaterial_1, {
            friction: 0.5,
            restitution: 0.8
        });
    }

    add_normal_concat = (con1, con2, config) => {
        for (let item of con1) {
            let concat_material = new CANNON.ContactMaterial(item, con2, config);
            this.world.addContactMaterial(concat_material);
        }
    }

    updatePhysic = () => {
        this.world.step(1 / 60);
        this.main.Objects.ball.position.copy(this.ballBody.position);
        this.main.Objects.ball.quaternion.copy(this.ballBody.quaternion);
        this.main.Objects.ball_1.position.copy(this.ballBody_1.position);
        this.main.Objects.ball_1.quaternion.copy(this.ballBody_1.quaternion);
    }
}