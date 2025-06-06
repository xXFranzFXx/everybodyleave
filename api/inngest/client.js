const { Inngest } = require('inngest');
//example application to initially sync with Inngest dev server
const inngest = new Inngest({id: "Everybodyleave"});

// Your new function:
const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

// Add the function to the exported array:
 const functions = [
  helloWorld
];
module.exports = { inngest, functions }