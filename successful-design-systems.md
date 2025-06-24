---
layout: default
title: Successful design systems
---

# Successful design systems

<p class="subtitle">Or how to build a library of reusable components</p>

## Introduction

In this article I'll share some of the learnings and techniques I've learned to build successful design systems that can scale. By "design system" I just mean a library of reusable components, and a collection of utilities to make them work as part of an overarching layout.

Having said this, from this point on I'll refrain from using the terms "design system" in favour of "reusable component library". Mainly because that's what they are, but also because the terms "design system", in my opinion, could refer to more abstract ways of thinking, or breader philosohical aspects of design in general. And one aspect of designing efficient reusable component libraries is embracing domain driven design, and ensure the terminology we use is accurate and non-ambiguous. I will also focus on the code implementation aspect and not so much in the design principles themselves, as I want this article to be a handy reference for developers tasked to implement existing designs.

Every large organization building user interfaces for their digital products have faced the challenge of implementing reusable component libraries, and in doing so, many times they have shoot themselves in the foot. The problem I'm refering to is the need of providing a consistent user experience across a whole family of applications, while reducing development costs by promoting reusability.

### Leverage emergent design

Emergent design is a design technique by which a successful design pattern is identified from multiple occurrences, as it "emerges" over time. With this approach, instead of waterfalling technical decisions about how a component should be implemented, we observe a few occurrences where it has already been implemented to identify common use cases, and possibly some early reusability challenges. This is a proactive approach that requires us to think not just in the individual component in isolation, but also in the possible different layouts where it will be used, and active research of what is being used currently on the wild.

A common objection to this approach is that it defeats the purpose, since going back and replacing components already in use goes against the very principle of reusability. However, in my experience, system don't arise out of nowehere, and most likely there are already existing use cases that could be used as a source for input. So rather than waiting for a component to show up a number of times, we can create basic prototypes or look for examples where such component is already in use, or we expect it to be in use.

The benefit of this apprach is that each use case becomes a stress test, highlighting basic requirements and constraints the component will have to satisfy to scale up successfully.

### Start with a flat structure and avoid arbitrary or premature categorizations

When first building a component library, it's tempting to create a folder structure that categorizes components based on anticipated usage or perceived similarities (e.g., "buttons", "forms", "navigation", "modals"). However, this can lead to problems down the line:

- **Rigidity:** Early categorizations are often based on incomplete information. As the library evolves and new components are added, or existing ones are refactored, these initial categories might become inaccurate or cumbersome. Changing a deeply nested folder structure can be a significant undertaking.
- **Discovery Challenges:** If a component could logically fit into multiple categories, or if developers have different mental models of where to find things, a rigid structure can make components harder to discover.
- **Premature Abstraction:** Forcing components into categories too early can lead to premature abstractions or an overly complex hierarchy that doesn't truly reflect how the components are used.

A flatter structure, perhaps initially grouping components by a very high-level concept (e.g. a single "components" directory), offers more flexibility. You can always introduce more specific organization as clear patterns and groupings emerge naturally from the actual components being built and used. This approach allows the structure to adapt to the system's organic growth rather than imposing an artificial order upfront. It also makes it easier to rename, move, or refactor components without major structural refactors.

### Prefer a flat hierarchy over deeply nested component hierarchies

Just as a flat folder structure is beneficial, so is a flat component hierarchy. Deeply nesting components (i.e., components composed of many layers of other custom components) can lead to several issues:

- **Props Drilling:** Passing props down through multiple layers of components becomes cumbersome and error-prone. It makes refactoring harder, as changes to a deeply nested child component might require updating all its ancestors.
- **Reduced Reusability:** Highly specialized, deeply nested components are often less reusable in different contexts. A component designed to work only within a specific nested structure might not be easily adaptable elsewhere.
- **Increased Complexity:** Understanding the behavior and styling of a deeply nested component can be difficult. Developers might need to trace props and styles through many layers, increasing cognitive load.
- **Performance Overheads:** While often negligible, in some frameworks or complex scenarios, excessive nesting can introduce slight performance overheads due_to the rendering and reconciliation process of many component instances.
- **Awkward Import Paths:** Deeply nested file structures, which often accompany deeply nested component hierarchies, can lead to very long and cumbersome relative import paths. This makes code harder to read and refactor. For example:

  ```javascript
  // BAD: Deeply nested import
  import MyButton from "../../../core/components/general/forms/buttons/MyButton";

  // BETTER: Flatter structure import
  import MyButton from "components/MyButton"; // Or using path aliases
  ```

Instead, favor composition with flatter structures. Aim for components that are self-contained and manage their own complexity, rather than relying on a deep tree of child components to achieve their functionality. When a component becomes too complex, consider breaking it down into siblings or using techniques like slotting (providing placeholders for content to be injected) rather than deep nesting. This often leads to more modular, understandable, and reusable components.

### Use utility classes for layout adjustments

### Don't assume you can predict the external layout

### Use color agnostic token names

### Extend native interfaces

Let's say we want to implement a button. We take a native component and we define an interface like this:

```typescript
// BAD
interface BackButtonProps {
  backgroundColor: "primary" | "secondary";
  onPress: () => void;
  disabled?: boolean;
}

const BackButton = ({
  onPress,
  disabled,
  backgroundColor,
}: BackButtonProps) => {
  return (
    <Pressable
      style={[styles[backgroundColor]]}
      onPress={onPress}
      disabled={disabled}
    >
      Back
    </Pressable>
  );
};
```

Looks simple enough and is probably good enough for some basic use case. Now, what happens if I need to define another Pressable property, like _onHoverIn_? Since this was not added to the interface, I'm now screwed and I cannot use this component, unless I update the interface.

A better way is to extend the native interface and pass all the props along:

```typescript
// GOOD
interface BackButtonProps extends PressableProps {
  backgroundColor: "primary" | "secondary";
}

const BackButton = ({ backgroundColor, ...props }: BackButtonProps) => {
  return (
    // All the props are passed to the native component
    <Pressable style={[styles[backgroundColor]]} {...props}>
      Back
    </Pressable>
  );
};
```

### Avoid interface encapsulation

We have already discussed interface encapsulation in the <a href="#extend-native-interfaces">extend native interfaces</a> section. By inerface encapsulation I refer to hiding a native component interface and preventing consumers from defning native prop values supported by the native element.

This can happen when we have components which are actually composed of multiple nested components, or require a wrapper element to handle some aspect of layout.

### Allow style overrides

We can never assume that a component will always look the same. There will be edge cases and situations where the base styling will have to be modified for some unexpected reason.

Consider this component:

```typescript
// BAD
const BackButton = ({ onPress, disabled }: BackButtonProps) => {
  return (
    <Pressable style={styles.backButton} onPress={onPress} disabled={disabled}>
      Back
    </Pressable>
  );
};
```

What happens if the styles here are not good enough for a certain use case? By allowing style overrides we provide the consumer the possibility to pass their own styling if needed:

```typescript
// GOOD
const BackButton = ({ onPress, disabled, styles }: BackButtonProps) => {
  return (
    <Pressable
      // Style override applied here
      style={[styles.backButton, styles]}
      onPress={onPress}
      disabled={disabled}
    >
      Back
    </Pressable>
  );
};
```

### Embrace automated semantic versioning or semantic release

Semanic Versioning can go a long way in helping teams consuming the same package maintain their codebases stable and their dependencies predictable. It is no suprise it has becomed an industry standard for open source and distributed packages. If your team is reponsible for maintaining a reusable package that is consumed by other teams, familiarity with semantic versioning should be a basic requirement.

Using automated semantic versioning is half the solution, as automation alone will not protect you from human mistakes that could cause trouble down the line. **One such mistake is releasing breaking changes as bugfixes or minor improvements**. The team should be aware that even though their own testing suite may be green, external consumers of the package may face challenges if they update to a new version containing breaking changes.
