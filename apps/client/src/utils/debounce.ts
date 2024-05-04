let timer: number | undefined;

export function debounce(func: Function, wait: number) {
  return (...args: any) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func(...args);
      timer = undefined;
    }, wait) as any;
  };
}
