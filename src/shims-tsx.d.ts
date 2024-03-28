// shims-tsx.d.ts

declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
}
