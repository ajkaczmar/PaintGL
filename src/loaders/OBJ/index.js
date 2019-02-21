import Mesh from "./mesh";
import { Material, MaterialLibrary } from "./material";
import { Layout } from "./layout";
import { downloadModels, downloadMeshes, initMeshBuffers, deleteMeshBuffers } from "./utils";

const version = "1.0.4";

/**
 * @namespace
 */
export {
    Mesh,
    Material,
    MaterialLibrary,
    Layout,
    downloadModels,
    downloadMeshes,
    initMeshBuffers,
    deleteMeshBuffers,
    version
};
