window.fontCache = require('./libs/droid_sans_bold.typeface.js');

export default class Control {
    constructor(mian) {
        this.main = mian;

        this.ang_x = 0.04;
        this.ang_y = 0.1;
        this.any_y_scale = 1.01;
        this.camera_control_open = true;

        this.ball_control_add = false;

        this.ball_y_scale = 1;
        this.ball_y_scale_speed = 0.02;
        this.ball_y__max_scale = 10;
        this.ball_y__min_scale = 0.5;
        this.speed_scale = 40;
        this.ball_control_toggle = true;

        this.active_font_now = 1;
        this.active_font_min = 0.8;
        this.active_font_max = 1.2;
        this.active_font_speed = 0.0029;
        this.active_font_toggle = true;

        this.ball_on_control = null;
        this.if_first_ball_in_control = true;

        this.has_been_start_game = false;
    }

    initPointer = () => {
        let point_shape = new THREE.Shape();
        point_shape.moveTo(0, 0);
        point_shape.lineTo(-0.1, 0);
        point_shape.lineTo(-0.1, 0.5);
        point_shape.lineTo(-0.15, 0.5);
        point_shape.lineTo(-0.01, 0.7);
        point_shape.lineTo(-0.01, 20);
        point_shape.lineTo(0.01, 20);
        point_shape.lineTo(0.01, 0.7);
        point_shape.lineTo(0.15, 0.5);
        point_shape.lineTo(0.1, 0.5);
        point_shape.lineTo(0.1, 0);
        point_shape.lineTo(0, 0);
        let shapeGeometry = new THREE.ShapeBufferGeometry(point_shape);
        let material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
        });
        let shapeMesh = new THREE.Mesh(shapeGeometry, material);
        shapeMesh.position.set(0, 0.4, 0);
        this.shapeMesh = shapeMesh;
        this.listen_ball_sleep_wake();
    }

    get_ball_point = (insert = [], body, body_1) => {
        let {camera} = this.main;
        if (insert.length) {
            if (!this.ball_control_add) {
                this.main.scene.add(this.shapeMesh);
                let {x: b_x, y: b_y, z: b_z} = body.position;
                let {x: b_1_x, y: b_1_y, z: b_1_z} = body_1.position;
                this.shapeMesh.position.set(b_x, 0.4, b_z);
                let normal_euler = new THREE.Euler(Math.PI / 2, 0, -Math.PI, 'XYZ');
                this.shapeMesh.setRotationFromEuler(normal_euler);
                let y_axis = new THREE.Vector3(0, 1, 0);
                this.shapeMesh.rotateOnWorldAxis(y_axis, Math.PI * 1.5 - Math.atan2(b_1_z - b_z, b_1_x - b_x));
                this.ball_control_add = true;
                this.camera_control_open = false;
                this.ball_text.visible = false;
                this.ball_1_text.visible = false;
            }
        }
    }

    set_raycaster = () => {
        let per = new THREE.Vector2(0, 0);
        let touchstart_listener = e => {
            let {clientX, clientY} = e.touches[0];
            let touch_3D = new THREE.Vector3();
            let {ballBody, ballBody_1} = this.main.Physic;
            touch_3D.x = (clientX / window.innerWidth) * 2 - 1;
            touch_3D.y = -(clientY / window.innerHeight) * 2 + 1;
            touch_3D.z = 0.2;
            if (ballBody.velocity.isZero() && ballBody_1.velocity.isZero()) {
                let ball_raycaster = new THREE.Raycaster();
                let {camera} = this.main;
                ball_raycaster.setFromCamera(touch_3D, camera);
                if (!this.if_first_ball_in_control) {
                    this.intersect_ball = ball_raycaster.intersectObject(this.main.Objects.ball);
                    this.get_ball_point(this.intersect_ball, ballBody, ballBody_1);
                } else {
                    this.intersect_ball_1 = ball_raycaster.intersectObject(this.main.Objects.ball_1);
                    this.get_ball_point(this.intersect_ball_1, ballBody_1, ballBody);
                }
            }
        }
        let touchend_listender = e => {
            let {ballBody, ballBody_1} = this.main.Physic;
            if (ballBody.velocity.isZero() && ballBody_1.velocity.isZero()) {
                if (!this.if_first_ball_in_control) {
                    this.add_velocity(this.intersect_ball, this.main.Physic.ballBody);
                } else {
                    this.add_velocity(this.intersect_ball_1, this.main.Physic.ballBody_1);
                }
            }
        }
        let touchmove_listener = e => {
            let {clientX, clientY} = e.touches[0];
            let {ballBody, ballBody_1} = this.main.Physic;
            if (this.camera_control_open && !devControl) {
                this.camera_control(clientX - per.x, clientY - per.y);
                if (this.ball_text && this.ball_1_text) {
                    this.set_font_ang(this.ball_text);
                    this.set_font_ang(this.ball_1_text);
                }
            } else if (ballBody.velocity.isZero() && ballBody_1.velocity.isZero()) {
                let y_axis = new THREE.Vector3(0, 1, 0);
                if (Math.abs(clientY - per.y) > Math.abs(clientX - per.x)) {
                    this.shapeMesh.rotateOnWorldAxis(y_axis, Math.atan2(per.y - clientY, clientX - per.x) / (Math.PI * 100));
                } else {
                    this.shapeMesh.rotateOnWorldAxis(y_axis, Math.atan2(per.x - clientX, clientY - per.y) / (Math.PI * 100));
                }
            }
            per.x = clientX;
            per.y = clientY;
        };
        document.addEventListener('touchmove', touchmove_listener);
        document.addEventListener('touchstart', touchstart_listener);
        document.addEventListener('touchend', touchend_listender);
        this.has_been_start_game = true;

        this.touchmove_listener = touchmove_listener;
        this.touchstart_listener = touchstart_listener;
        this.touchend_listender = touchend_listender;

        let {Gui, scene} = this.main;
        scene.remove(Gui.ball_title_mesh);
    }

    detect_listen = () => {
        document.removeEventListener('touchmove', this.touchmove_listener);
        document.removeEventListener('touchstart', this.touchstart_listener);
        document.removeEventListener('touchend', this.touchend_listender);
    }

    add_velocity = (insert = [], body, which_sleep) => {
        if (insert.length) {
            if (this.ball_control_add) {
                this.main.scene.remove(this.shapeMesh);
                this.ball_control_add = false;
                this.ball_y_scale = 1;
                this.camera_control_open = true;
                let {x, z} = this.shapeMesh.rotation;
                let v_x = Math.cos(Math.PI * 1.5 - z);
                let v_z = Math.sin(Math.PI / 2 - z);
                body.wakeUp();
                body.velocity.set(v_x * this.speed_scale, 0, v_z * this.speed_scale);
            }
        }
    }

    camera_control = (checkX, checkY) => {
        let {camera, scene} = this.main;
        let ang_x = checkX > 0 ? this.ang_x : -this.ang_x;
        let ang_y = checkY > 0 ? this.ang_y : -this.ang_y;
        let {x, y, z} = camera.position;
        if (Math.abs(checkX) > Math.abs(checkY)) {
            camera.position.x = x * Math.cos(ang_x) + z * Math.sin(ang_x);
            camera.position.z = z * Math.cos(ang_x) - x * Math.sin(ang_x);
        } else {
            camera.position.y += ang_y;
            if (checkY > 0) {
                camera.position.x = x * this.any_y_scale;
                camera.position.z = z * this.any_y_scale;
            } else {
                camera.position.x = x / this.any_y_scale;
                camera.position.z = z / this.any_y_scale;
            }
        }
        let {ballBody, ballBody_1} = this.main.Physic;
        let ball_on_choose = this.if_first_ball_in_control ? ballBody : ballBody_1;
        let {x: b_x, z: b_z} = ball_on_choose.position;
        camera.lookAt(b_x, 1, b_z);
    }

    set_camera_position = (ball_position, ball_1_position) => {
        let {camera, scene} = this.main;
        let {x: m_x, y: m_y, z: m_z} = ball_position;
        let {x: n_x, y: n_y, z: n_z} = ball_1_position;
        let ang = Math.atan2(n_z - m_z, n_x - m_x);
        camera.position.set(m_x - Math.cos(ang) * 7, 2, m_z - Math.sin(ang) * 7);
        camera.lookAt(n_x, 1, n_z);
    }

    listen_ball_sleep_wake = () => {
        let {ballBody, ballBody_1} = this.main.Physic;

        const toggle_control_ball = () => {
            this.ball_on_control = this.if_first_ball_in_control ? this.ball_text : this.ball_1_text;
            this.if_first_ball_in_control = !this.if_first_ball_in_control
        }

        const normal_sleep_control = () => {
            if (!this.has_been_start_game) {
                this.set_raycaster();
            }

            if (ballBody.velocity.isZero() && ballBody_1.velocity.isZero()) {
                let win = false;
                if (!this.if_first_ball_in_control) {
                    win = this.main.Win.check_win(ballBody_1.position);
                } else {
                    win = this.main.Win.check_win(ballBody.position);
                }

                console.log(win);

                if (this.if_first_ball_in_control) {
                    this.set_camera_position(ballBody.position, ballBody_1.position);
                } else {
                    this.set_camera_position(ballBody_1.position, ballBody.position);
                }
                if (win) {
                    this.detect_listen();
                    let win_text = '', ball_text = '',
                        win_one_text_mesh = null, win_one_position = new THREE.Vector3(),
                        win_text_color = 0xffffff, which_toggle = false;
                    if (!this.if_first_ball_in_control) {
                        win_text = 'Ball 1 win';
                        ball_text = 'Ball 1';
                        win_one_text_mesh = this.ball_text;
                        win_one_position = ballBody.position;
                        win_text_color = 0xfb3c00;
                        which_toggle = this.if_first_ball_in_control;
                    } else {
                        win_text = 'Ball 2 win';
                        ball_text = 'Ball 2';
                        win_one_text_mesh = this.ball_1_text;
                        win_one_position = ballBody_1.position;
                        win_text_color = 0x2196f3;
                        which_toggle = !this.if_first_ball_in_control;
                    }
                    this.main.Gui.add_Title(win_text, 1, 0.5, win_text_color);
                    this.add_font_on_ball(ball_text, which_toggle);
                    this.set_font_position(win_one_text_mesh, win_one_position);
                    let timer = setTimeout(() => {
                        clearTimeout(timer);
                        this.restart_game();
                    }, 1999);
                } else {
                    if (!this.ball_text) {
                        this.ball_text = this.add_font_on_ball('Ball 1', this.if_first_ball_in_control);
                    }
                    if (!this.ball_1_text) {
                        this.ball_1_text = this.add_font_on_ball('Ball 2', !this.if_first_ball_in_control);
                    }
                    this.set_font_position(this.ball_text, ballBody.position);
                    this.set_font_position(this.ball_1_text, ballBody_1.position);
                    toggle_control_ball();
                }
            }
        }

        ballBody.addEventListener("sleep", function (event) {
            normal_sleep_control();
        })

        ballBody_1.addEventListener("sleep", function (event) {
            normal_sleep_control();
        })

    }

    restart_game = () => {
        this.has_been_start_game = false;
        this.if_first_ball_in_control = true;
        let {ballBody, ballBody_1} = this.main.Physic;
        let {camera, scene} = this.main;
        this.set_raycaster();
        ballBody.position.set(8, 2.5, 0);
        ballBody_1.position.set(0, 2.5, 8);
        ballBody.wakeUp();
        ballBody_1.wakeUp();
        this.ball_text.visible = false;
        this.ball_1_text.visible = false;
        camera.position.set(12, 2, 12);
        camera.lookAt(scene.position);
    }

    add_font_on_ball = (text, check) => {
        let {scene} = this.main;
        let create_ball_geometry = new THREE.TextBufferGeometry(
            text,
            {
                font: new THREE.Font(fontCache),
                size: 0.4,
                height: 0.01
            });
        let font_material = new THREE.MeshBasicMaterial({
            color: 0xfb3c00,
        });
        let font_material_active = new THREE.MeshBasicMaterial({
            color: 0x2196f3,
        });
        let ball_text_mesh = new THREE.Mesh(create_ball_geometry, check ? font_material : font_material_active);
        ball_text_mesh.visible = false;
        scene.add(ball_text_mesh);
        return ball_text_mesh;
    }

    set_font_position = (mesh, position) => {
        mesh.position.copy(position);
        mesh.position.y = 1;
        mesh.visible = true;
        mesh.translateOnAxis(position.x > 0 ? new THREE.Vector3(-1, 0, 0) : new THREE.Vector3(1, 0, 0), 0.7);
        this.set_font_ang(mesh);
    }

    set_font_ang = mesh => {
        let {camera} = this.main;
        let {x, y, z} = camera.position;
        let font_ang = new THREE.Vector3(x, 0, z);
        mesh.lookAt(font_ang);
    }

    active_font = mesh => {
        let {
            active_font_now,
            active_font_min,
            active_font_max,
            active_font_speed,
        } = this;
        if (active_font_now >= active_font_max || active_font_now < active_font_min) {
            this.active_font_toggle = !this.active_font_toggle;
        }
        if (this.active_font_toggle) {
            this.active_font_now += active_font_speed;
        } else {
            this.active_font_now -= active_font_speed;
        }
        mesh.position.y = this.active_font_now;
    }

    control_update = () => {
        if (this.ball_control_add) {
            if (this.ball_y_scale >= this.ball_y__max_scale || this.ball_y_scale <= this.ball_y__min_scale) {
                this.ball_control_toggle = !this.ball_control_toggle;
            }
            if (this.ball_control_toggle) {
                this.ball_y_scale += this.ball_y_scale_speed;
            } else {
                this.ball_y_scale -= this.ball_y_scale_speed;
            }
            this.shapeMesh.scale.set(1, this.ball_y_scale, 1);
        }
        if (this.ball_on_control) {
            this.active_font(this.ball_on_control);
        }
    }
}
