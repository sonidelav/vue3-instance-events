import { Plugin } from 'vue'

function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

export const VueInstanceEvents: Plugin = (app, options) => {

    app.config.globalProperties.on = function(event: string, listener: ()=>void) {
        const vnode = app._instance?.vnode || null
        if(vnode) {
            vnode.props = vnode.props || {}
            vnode.props[camelize(`on ${event}`)] = listener
        }
    }

    app.config.globalProperties.emit = function(event: string, ...args: any[]) {
        if(app._instance) {
            app._instance.emit(event, args)
        }
    }
}

export default VueInstanceEvents

declare module 'vue' {
    interface ComponentCustomProperties {
        on: (event:string, listener: () => void) => void,
        emit: (event:string, ...args: any[]) => void
    }
}