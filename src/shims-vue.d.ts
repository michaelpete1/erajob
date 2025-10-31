declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, any, any>
  export default component
}

declare module 'vue-toastification' {
  import { Plugin } from 'vue'
  import { ToastOptions, TYPE } from 'vue-toastification'

  export const useToast: () => {
    (content: any, options?: ToastOptions): ToastID
    clear(): void
    updateDefaults(update: PluginOptions): void
    dismiss(id: ToastID): void
    success(content: any, options?: ToastOptions & { type?: TYPE.SUCCESS }): ToastID
    info(content: any, options?: ToastOptions & { type?: TYPE.INFO }): ToastID
    warning(content: any, options?: ToastOptions & { type?: TYPE.WARNING }): ToastID
    error(content: any, options?: ToastOptions & { type?: TYPE.ERROR }): ToastID
    update(id: ToastID, { content, options }: { content?: any; options?: ToastOptions }, create?: false): void
    update(id: ToastID, { content, options }: { content: any; options?: ToastOptions }, create?: true): void
  }

  export interface ToastID {
    // Toast ID type
  }

  export interface PluginOptions {
    // Plugin options type
  }

  export { TYPE, ToastOptions }
}
