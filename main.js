// ローディングしたら読み込んでほしい
// ロードしたら、init関数を読み込む
window.addEventListener("load", init);

// 地球の関数を
function init() {
  // 地球のサイズを指定
  const width = 960;
  const height = 540;
  // 回転の値。
  let rot = 0;

  // scene
  const scene = new THREE.Scene();
  // camera, 後ろから一歩引いたように撮影する
  const camera = new THREE.PerspectiveCamera(45, width / height);

  // renderer, canvasのタグの中にレンダリングする
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 球体を生成
  const geometry = new THREE.SphereGeometry(300, 30, 30);
  // material
  //
  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("earth.jpg"),
    // side: THREE.DoubleSide,
  });
  // メッシュ作成
  const earth = new THREE.Mesh(geometry, material);
    // 3D空間にメッシュを追加
  scene.add(earth);
  // 平行光源
  // DirectionalLight(色、強度);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
  // どこに置くのか？
  directionalLight.position.set(1, 1, 1);
  // シーンに入れる
  scene.add(directionalLight);

  // ポイント光源
  // PointLight(0xffffff, 2, 距離)
  const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
  scene.add(pointLight);
  // pointlightを視覚化するための引数
  // PointLightHelper(pointLight, shphe size);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  // 星屑の生成
  createStarField();

  // 星屑生成の関数
  function createStarField(){
    // x, y , z座標の値がランダムに入った配列を500個生成
    const vertices=[];
    for(let i = 0; i < 500; i++){
      const x = 3000 * (Math.random()- 0.5);
      const y = 3000 * (Math.random()- 0.5);
      const z = 3000 * (Math.random()- 0.5);
      vertices.push(x, y, z);
    }

    // 星屑の形を作成
    // 
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      // vertices で作った500このデータを3Dないに配置する
      "position", 
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    // 材質を決める
    // PointsMaterial デフォルトのマテリアルを指定できる
    const material = new THREE.PointsMaterial({
      size:8,
      color: 0xffffff
    });

    // PointsMaterialを使用した時は、メッシュではなく、Points
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
  }

  // 実際にアニメーションしてみていく
  // フレームごとに呼び出される関数
  function tick()  {
    // 角度を0.5ずつ足してく　絶対値、ラジアン
    rot += 0.5;
    // ラジアン変換
    const radian = (rot * Math.PI) / 180;
    // 角度に応じてカメラの位置を変更する
    // 正弦波の動きでカメラ位置を変更していく
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 2000 * Math.cos(radian);

    // カメラのみる位置を固定する
    // camera.lookAt(new THREE.Vector3(x, y ,z)); この座標位置でカメラを固定できる
    camera.lookAt(new THREE.Vector3(0,0,-400));


    // ライトを周回させる
    // ライトのポジションをランダムに変更していく
    pointLight.position.set(
      500 * Math.sin(Date.now() / 500),
      500 * Math.sin(Date.now() / 1000),
      500 * Math.cos(Date.now() / 500)
    );
    // レンダリングする
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
    // 自分自身の関数を呼び出す
  }
  tick();
  window.addEventListener("resize", onWindowResize);

  // ウィンドウ変更時にサイズを維持する処理
  function onWindowResize(){
    camera.aspect = window.innerWidth /window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
