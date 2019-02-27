export default class Gui {
    constructor(main) {
        this.main = main;

        this.add_Title('Child Moonie', 1.7, 0.7);
    }

    add_Title = (text, x_m = 1, z_m = 1, color = 0x62a2de) => {
        let {camera, scene} = this.main;
        let {position} = camera;
        let {x, y, z} = position;
        let create_ball_geometry = new THREE.TextBufferGeometry(
            text,
            {
                font: new THREE.Font(fontCache),
                size: 0.15,
                height: 0.02
            });
        let font_material = new THREE.MeshBasicMaterial({
            color,
            transparent: false,
            side: THREE.DoubleSide,
        });
        let ball_title_mesh = new THREE.Mesh(create_ball_geometry, font_material);
        ball_title_mesh.lookAt(position);
        ball_title_mesh.visible = true;
        let mod_x = x < 0 ? x + x_m : x - x_m;
        let mod_y = z < 0 ? z + z_m : z - z_m;
        ball_title_mesh.position.set(mod_x, y, mod_y);

        scene.add(ball_title_mesh);
        this.ball_title_mesh = ball_title_mesh;
    }
}