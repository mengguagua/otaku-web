import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: 'article',
        label: '文章',
        path: "content/article",
        fields: [
          {
            type: "string",
            name: "title",
            label: "标题",
            isTitle: true,
            required: true,
          }, {
            type: "string",
            name: "resume",
            label: "简介",
            required: true,
          }, {
            type: "datetime",
            name: "time",
            label: "时间",
            required: true,
          }, {
            type: "string",
            name: "url",
            label: "外链",
          }, {
            type: "rich-text",
            name: "body",
            label: "文章",
            isBody: true,
          },
        ],
      }, {
        name: "post",
        label: "Posts",
        path: "content/posts",
        // ui: {
        //   router: ({ document }) => {
        //     // navigate to the home page
        //     if (document._sys.filename === 'hello-world') {
        //       return `/content/post/hello-world`
        //     }
        //     return undefined
        //   },
        // },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
