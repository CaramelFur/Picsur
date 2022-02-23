export interface ImageLinks {
  source: string;
  markdown: string;
  html: string;
  rst: string;
  bbcode: string;
}

export function CreateImageLinks(imageURL: string) {
  return {
    source: imageURL,
    markdown: `![image](${imageURL})`,
    html: `<img src="${imageURL}" alt="image">`,
    rst: `.. image:: ${imageURL}`,
    bbcode: `[img]${imageURL}[/img]`,
  };
}

export function Debounce(fn: Function, ms: number) {
  let timer: number | undefined;

  return () => {
    clearTimeout(timer);

    timer = setTimeout((_) => {
      timer = undefined;

      fn();
    }, ms);
  };
}
