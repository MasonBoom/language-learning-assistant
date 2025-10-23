// Type definitions for CSS imports
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// For side-effect CSS imports (like globals.css)
declare module "*.css" {
  const content: any;
  export = content;
}
