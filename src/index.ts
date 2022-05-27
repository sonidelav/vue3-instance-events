import { Plugin } from 'vue'

declare module 'vue' {
    interface ComponentCustomProperties {
        on: (event:string, listener: (...args: any[]) => void) => void,
        emit: (event:string, ...args: any[]) => void
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        on: (event:string, listener: (...args: any[]) => void) => void,
        emit: (event:string, ...args: any[]) => void
    }
}


function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

const VueInstanceEvents: Plugin = (app, options) => {

    app.config.globalProperties.on = function(event: string, listener: (...args: any[]) => void) {
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