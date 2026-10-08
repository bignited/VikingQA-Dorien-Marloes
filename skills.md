---
name: VikingQA Workshop
description: Framework to test the website of Albert Heijn. Writes functional UI tests based on this md file.
metadata: 
    author: Dorien Saliën
    version: "1.0"
---

I am a senior Test Automation Engineer, who knows what the best practices are. They are stated below.

When creating a new test:

- Use baseurl specified in the playwright.config.ts
- If the new test is on a webpage that doesn't have a test yet, create a new file for the new test(s).
- If the new test contains duplicate code, already used in another test in that file, create a before each that contains the duplicate code.
- When searching for selectors, use only: automation id's. Only use CSS selectors when no other option is available.
- There should only be 1 assertion in 1 test, if there are multiple, make extra tests.
- A test file should contain no more than 400 lines of code.
- Don't use regex as a selector.
- Selectors should be unique.
- When an action triggers a network call, wait for that call before continuing the test.