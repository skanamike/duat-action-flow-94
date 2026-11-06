import { test } from "node:test";
import assert from "node:assert/strict";
import { publicPath } from "../../src/lib/paths.ts";

test("publicPath maps build-time file paths to served URLs", () => {
  const cases: Array<[string, string]> = [
    ["/index.html", "/"],
    ["/", "/"],
    ["", "/"],
    ["/technology.html", "/technology"],
    ["/technology", "/technology"],
    ["/technology/", "/technology"],
    ["/company.html", "/company"],
    ["/company/index.html", "/company"],
    ["/company/team.html", "/company/team"],
    ["/404.html", "/404"],
  ];
  for (const [input, expected] of cases) assert.equal(publicPath(input), expected, input);
});
