export default function Debounce(fn: Function, ms: number) {
  let timer: number | undefined;

  return () => {
    clearTimeout(timer);

    timer = setTimeout((_) => {
      timer = undefined;

      fn();
    }, ms);
  };
}
