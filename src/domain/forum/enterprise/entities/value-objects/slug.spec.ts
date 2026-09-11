import { Slug } from "./slug.js";

test("it should be able to create a new slug from text", () => {
  const slug = Slug.createFromText("Example a Question");

  expect(slug.value).toEqual("example-a-question");
});
