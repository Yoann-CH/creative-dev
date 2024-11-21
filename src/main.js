import SceneGravityCubes from "./js/scenarios/GravityCubes/SceneGravityCubes"
import SceneBouncingBubbles from "./js/scenarios/SceneBouncingBubbles"
import GlobalContext from "./js/template/GlobalContext"
import { askMotionAccess } from "./js/Utils/DeviceAccess"

/** TODO */
/** TODO */
/*
    - SceneGravityCubes
        - Mur gauche (responsive)
        - Murs intermédiaires (responsive)
        - Fonction AddCube()
    - SceneBouncingBubbles
        - Fonction RemoveBubble()
        - Debug : paramètre speed (-1 <-> 1)
    - Main
        - Finir les correspondances
            scène 2 -> 3 (faite en cours)
            3 -> 2
            3 -> 1
            1 -> 3
            1 -> 2
            2 -> 1
*/
/** TODO */
/** TODO */

/** motion sensors authorization */
const btn = document.getElementById("btn-access")
btn.addEventListener("click", function () {
    askMotionAccess()
}, false)

/** scenes */
const scene1 = new SceneBouncingBubbles("canvas-scene-1")
const scene2 = new SceneGravityCubes("canvas-scene-2")
const scene3 = new SceneBouncingBubbles("canvas-scene-3")

/** main */
const globalContext = new GlobalContext()
const params = {
    test: 0
}
if (!!globalContext.debug.ui) {
    globalContext.debug.ui.add(params, "test", 0, 10)
}
const time = globalContext.time
const update = () => {
    // Scène 1 -> 2
    const outScene1_down = scene1.bubbles.filter(b => b.y > scene1.height);
    outScene1_down.forEach(bubbleToMove => {
        scene1.removeBubble(bubbleToMove);
        const newCube_ = scene2.addCube(50, 'red');
        if (newCube_) {
            newCube_.setPosition(bubbleToMove.x - scene2.width / 2, scene2.height / 2);
        }
    });

    // Scène 2 -> 3
    const outScene2_down = scene2.cubes.filter(c => c.position.y < -scene2.height / 2);
    outScene2_down.forEach(cubeToRemove => {
        scene2.removeCube(cubeToRemove);
    });

    outScene2_down.forEach(cubeToMove => {
        const newBubble_ = scene3.addBubble(cubeToMove.position.x + scene3.width / 2, 0);
        newBubble_.vy = Math.abs(newBubble_.vy);
    });

    // Scène 3 -> 1
    const outScene3_down = scene3.bubbles.filter(b => b.y > scene3.height);
    outScene3_down.forEach(bubbleToMove => {
        scene3.removeBubble(bubbleToMove);
        const newBubble_ = scene1.addBubble(bubbleToMove.x, 0);
        newBubble_.vy = Math.abs(bubbleToMove.vy);
        newBubble_.vx = bubbleToMove.vx;
    });

    // Scène 3 -> 2
    const outScene3_up = scene3.bubbles.filter(b => b.y < 0);
    outScene3_up.forEach(bubbleToMove => {
        scene3.removeBubble(bubbleToMove);
        const newCube_ = scene2.addCube(50, 'blue');
        if (newCube_) {
            newCube_.setPosition(bubbleToMove.x - scene2.width / 2, -scene2.height / 2);
        }
    });

    // Scène 2 -> 1
    const outScene2_up = scene2.cubes.filter(c => c.position.y > scene2.height / 2);
    outScene2_up.forEach(cubeToRemove => {
        scene2.removeCube(cubeToRemove);
    });

    outScene2_up.forEach(cubeToMove => {
        const newBubble_ = scene1.addBubble(cubeToMove.position.x + scene1.width / 2, scene1.height);
        newBubble_.vy = -Math.abs(newBubble_.vy);
    });

    // Scène 1 -> 3
    const outScene1_up = scene1.bubbles.filter(b => b.y < 0);
    outScene1_up.forEach(bubbleToMove => {
        scene1.removeBubble(bubbleToMove);
        const newBubble_ = scene3.addBubble(bubbleToMove.x, scene3.height);
        newBubble_.vy = -Math.abs(bubbleToMove.vy);
        newBubble_.vx = bubbleToMove.vx;
    });
}
time.on("update", update)





/*
Hello, j'ai trouver comment utiliser le motion capteur en mode dev sans deploy sur vercel :

npm i -D @vitejs/plugin-basic-ssl

Puis modifier le vite.config.mjs :

import basicSsl from '@vitejs/plugin-basic-ssl'
export default {
    root: 'src',
    build: {
        outDir: '../dist'
    },
    plugins: [
        basicSsl()
    ]
}
*/