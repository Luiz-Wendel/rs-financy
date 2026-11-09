/** Sets the browser tab title (React 19 hoists <title> to the document head). */
export function PageTitle({ children }: { children: string }) {
  return <title>{`${children} | Financy`}</title>
}
