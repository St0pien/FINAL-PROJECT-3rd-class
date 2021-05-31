import { Camera, Light } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import nodeFbx from "../../assets/models/node.fbx";

const loadings = [];

const models = {
    node: {
        path: nodeFbx,
        mesh: null
    }
}

export async function loadModels() {
    const loader = new FBXLoader();
    for (let key in models) {
        loadings.push(new Promise(resolve => {
            loader.load(models[key].path, fbx => {
                const toRemove = [];
                fbx.traverse(c => {
                    if (c instanceof Camera) {
                        toRemove.push(c);
                    }

                    if (c instanceof Light) {
                        toRemove.push(c);
                    }
                });

                toRemove.forEach(c => fbx.remove(c));

                models[key].mesh = fbx;
                resolve();
            });
        }));
    }

    await Promise.all(loadings);
}

export default function getModel(name) {
    return models[name].mesh;
}