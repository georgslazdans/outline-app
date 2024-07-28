import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-center p-2 mt-2 mb-6">{children}</h1>
    ),
    h2: ({ children }) => <h2 className="mt-8 mb-2 ml-4"> {children}</h2>,
    h3: ({ children }) => <h3 className="mt-2 mb-1"> {children}</h3>,
    h4: ({ children }) => <h4 className="mb-1"> {children}</h4>,
    p: ({ children }) => <p className="mb-1"> {children}</p>,
    a: ({ children, href }) => (
      <a style={{ color: "revert", textDecoration: "revert" }} href={href}>
        {children}
      </a>
    ),
    ul: ({ children }) => <ul style={{listStyle: ""}} className="list-inside list-disc my-1">{children}</ul>,
    ...components,
  };
}
