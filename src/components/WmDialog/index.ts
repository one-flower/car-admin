import { Ref } from 'vue';

interface Options {
  title?: string;
}
interface Return {
  title: Ref<string>;
  visible: Ref<boolean>;
}
export default (ops?: Options): Return => {
  const visible = ref(false);
  const title = ref(ops.title || '');

  return {
    title,
    visible
  };
};
