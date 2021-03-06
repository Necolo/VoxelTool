import { 
    RequestId, 
    VoxelSpec, 
    SocketInterface,
    MessageHandler,
} from '../spec';

import { Voxel } from './voxel';
import { Texture } from './texture';

export class ClientProtocol {
    public socket:SocketInterface;
    public project:string = 'default';

    constructor (socket:SocketInterface) {
        const self = this;
        this.socket = socket;
    }

    public get_category_list (cb:MessageHandler<string[]>) {
        const id = RequestId.category_list;
        const req = {
            project: this.project,
        };

        this.socket.sub(id, cb);
        this.socket.send(id, req);
    }

    public add_category(category:string, cb:MessageHandler<boolean>) {
        const id = RequestId.add_category;
        const req = { project: this.project, category };
        this.socket.sub(id, cb);
        this.socket.send(id, req);
    }

    public add_voxel(voxel:Voxel, cb:MessageHandler<boolean>) {
        const id = RequestId.add_voxel;

        const req = {
            project: this.project,
            name: voxel.name,
            spec: voxel.spec,
            tex: {},
        }

        for (let i = 0; i < voxel.texList.length; i ++) {
            const tex = voxel.texList[i];
            if (!tex.link) {
                req.tex[tex.name] = tex.getSource();
            }
        }

        this.socket.sub(id, cb);
        this.socket.send(id, req);
    }

    public new_project(project:string, cb:MessageHandler<boolean>) {
        const id = RequestId.new_project;
        const req = {
            project,
        };
        this.socket.sub(id, cb);
        this.socket.send(id, req);
    }

    public get_projects(cb:MessageHandler<string[]>) {
        const id = RequestId.get_projects;
        this.socket.sub(id, cb);
        this.socket.send(id, '');
    }

    public get_voxel(name:string, cb:MessageHandler<VoxelSpec|false>) {
        const id = RequestId.get_voxel;
        this.socket.sub(id, cb);

        const req = {
            project: this.project,
            name,
        };

        this.socket.send(id, req);
    }

    public download_project(cb:MessageHandler<string>) {
        const id = RequestId.download_project;
        this.socket.sub(id, cb);

        const req = {
            project: this.project,
        }

        this.socket.send(id, req);
    }
}