import { Documentalist, MarkdownPlugin, TypescriptPlugin } from "@documentalist/compiler";
import { writeFileSync } from 'fs';

new Documentalist()
  .use(/\.tsx?$/, new TypescriptPlugin({ }))
  .documentGlobs("src/**/*") // ← async operation, returns a Promise
  .then(docs => JSON.stringify(docs, null, 2))
  .then(json => writeFileSync("docs.json", json))