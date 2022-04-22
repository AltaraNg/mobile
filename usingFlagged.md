# Using Flagged included in the project

> I only created one flag which is <b>admin</b> and it defaults to false.
**If user.attributes.staff_id === 1, then it becomes true**

## 1. Hiding entire component

    `import * as React from "react";`
    `import { withFeature } from "flagged";`

    `function Heading() {return <h1>My App v2</h1>}`
    `export default withFeature("admin")(Heading);

## 2. Hiding a feature in component

    `import * as React from "react";`
    `import { Feature } from "flagged";`

    `function Header()
     {
         return (
    <header>
      <Feature name="admin">
        <h1>Only seen by admin</h1>
      </Feature>
    </header>
  );
        }`

[You can view more usage tips here](https://github.com/sergiodxa/flagged)
