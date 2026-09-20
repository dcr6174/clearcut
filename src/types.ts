export type Progress={status:'loading'|'processing'|'done'|'error';progress?:number;message?:string};
export interface BackgroundRemovalProvider{removeBackground(file:File,onProgress:(p:Progress)=>void,signal?:AbortSignal):Promise<Blob>}
export type Bg={type:'transparent'|'color'|'gradient'|'image';value:string};
export type Transform={x:number;y:number;scale:number;rotation:number;flipX:boolean;flipY:boolean};
export type Edge={feather:number;smooth:number;threshold:number;opacity:number};
