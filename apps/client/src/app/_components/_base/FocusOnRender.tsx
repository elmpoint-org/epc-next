import { useEffect } from 'react';

/**
 * when this component is rendered, the passed DOM element is focused.
 * @param input the HTMLElement ref to focus
 * @param select for input elements, focus and select contents
 * @returns
 */
export default function FocusOnRender(props: {
  el: React.MutableRefObject<HTMLElement | null>;
  select?: boolean;
}) {
  const { el, select } = props;

  useEffect(() => {
    el.current?.focus();
    if (select && el.current instanceof HTMLInputElement) el.current?.select();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
