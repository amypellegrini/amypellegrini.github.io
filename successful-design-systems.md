---
layout: default
title: Successful Design Systems &middot; Amy Pellegrini
---

<header class="article-header">
  <div class="container">
    <div class="article-header__glow" aria-hidden="true"></div>
    <a href="/#writing" class="article-header__back">
      <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      Back to articles
    </a>
    <div class="article-header__meta">
      <span class="tag">Software Engineering</span>
      <span class="tag tag--green">Design Systems</span>
    </div>
    <h1 class="article-header__title">
      <span>Successful Design Systems</span>
    </h1>
    <p class="article-header__subtitle">
      Or how to build a library of reusable components
    </p>
  </div>
</header>

<article class="article-body">
  <div class="container">

<h2>Introduction</h2>

In this article I'll share some of the learnings and techniques I've learned to build successful design systems that can scale. By "design system" I just mean a library of reusable components, and a collection of utilities to make them work as part of an overarching layout.

<div class="note">
From this point on I'll refrain from using the terms "design system" in favour of "reusable component library". Mainly because that's what they are, but also because the terms "design system", in my opinion, could refer to more abstract ways of thinking, or breader philosohical aspects of design in general.
</div>

Every large organization building user interfaces for their digital products have faced the challenge of implementing reusable component libraries, and in doing so, many times they have shoot themselves in the foot. The problem I'm refering to is the need of providing a consistent user experience across a whole family of applications, while reducing development costs by promoting reusability.

<h3>Leverage emergent design</h3>

Emergent design is a technique by which a successful design pattern is identified from multiple occurrences, as it "emerges" over time. With this approach, instead of waterfalling technical decisions about how a component layout, we observe a few occurrences where it has already been implemented to identify common use cases, and possibly some early reusability challenges. This approach requires us to think not just about the individual component in isolation, but also the different layouts where it will be embedded, involving active research of what is being used currently on the wild.

A common objection to this approach is that it defeats the purpose, since going back and replacing components already in use goes against the very principle of reusability. However, in my experience, system don't arise out of nowehere, and most likely there are existing use cases that could be used as a source for input. Rather than waiting for a component to show up a number of times, we can create basic prototypes or look for examples where such component is already in use. Each scenario becomes a stress test, highlighting basic requirements and constraints the component will have to satisfy to scale up successfully.

<h3>Start with a flat structure and avoid arbitrary or premature categorizations</h3>

When first building a component library, it's tempting to create a folder structure that categorizes components based on anticipated usage or perceived similarities (e.g., "buttons", "forms", "navigation", "modals"). However, this can lead to problems down the line:

- **Rigidity:** Early categorizations are often based on incomplete information. As the library evolves and new components are added, or existing ones are refactored, these initial categories might become inaccurate or ambiguous.
- **Discovery Challenges:** Developers have different mental models of where to find things. When a component logically fits into multiple categories ("Is this a modal or a popup? Is this a notification or an error message?"), a rigid structure can make components harder to discover.
- **Premature Abstraction:** Forcing components into categories too early can lead to premature abstractions or an overly complex hierarchy that doesn't truly reflect how the components are used.

A flatter structure, perhaps initially grouping components by a very high-level concept (e.g. a single "components" directory), offers more flexibility. You can always introduce more specific organization as clear patterns and groupings emerge naturally from the actual components being built and used. This approach allows the structure to adapt to the system's organic growth rather than imposing an artificial order upfront. It also makes it easier to rename, move, or refactor components without major structural refactors.

<h3>Prefer a flat hierarchy over deeply nested component hierarchies</h3>

Just as a flat folder structure is beneficial, so is a flat component hierarchy. Deeply nesting components (i.e., components composed of many layers of other custom components) can lead to several issues:

- **Props Drilling:** Passing props down through multiple layers of components becomes cumbersome and error-prone. It makes refactoring harder, as changes to a deeply nested child component might require updating all its ancestors.
- **Reduced Reusability:** Highly specialized, deeply nested components are often less reusable in different contexts. A component designed to work only within a specific nested structure might not be easily adaptable elsewhere.
- **Increased Complexity:** Understanding the behavior and styling of a deeply nested component can be difficult. Developers might need to trace props and inherited styles through many layers, increasing cognitive effort.
- **Performance Overheads:** While often negligible, excessive nesting can introduce slight performance overheads due to the rendering and reconciliation process of many component instances.
- **Awkward Import Paths:** Deeply nested file structures, which often go along deeply nested component hierarchies, can lead to very long and cumbersome relative import paths. For example:

```javascript
// BAD: Deeply nested import
import MyButton from "../../../core/components/general/forms/buttons/MyButton";

// BETTER: Flatter structure import
import MyButton from "components/MyButton"; // Or using path aliases
```

Instead, favor composition with flatter structures. Aim for components that are self-contained and manage their own complexity, rather than relying on a deep tree of child components to achieve their functionality. When a component becomes too complex, consider breaking it down into siblings or using techniques like slotting (providing placeholders for content to be injected) rather than deep nesting. This often leads to more modular, understandable, and reusable components.

<h3>Use utility classes for layout adjustments</h3>

<h3>Don't assume you can predict the external layout</h3>

<h3>Use color agnostic token names</h3>

<h3>Extend native interfaces</h3>

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

<h3>Avoid interface encapsulation</h3>

We have already discussed interface encapsulation in the <a href="#extend-native-interfaces">extend native interfaces</a> section. By inerface encapsulation I refer to hiding a native component interface and preventing consumers from defning native prop values supported by the native element.

This can happen when we have components which are actually composed of multiple nested components, or require a wrapper element to handle some aspect of layout.

<h3>Allow style overrides</h3>

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

<h3>Embrace automated semantic versioning or semantic release</h3>

Semanic Versioning can go a long way in helping teams consuming the same package maintain their codebases stable and their dependencies predictable. If your team is reponsible for maintaining a reusable package that is consumed by other teams, familiarity with semantic versioning should be a basic requirement.

  </div>
</article>

<section class="article-footer">
  <div class="container">
    <div class="author-card">
      <img class="author-card__avatar" src="/images/profile.png" alt="Amy Pellegrini" />
      <div>
        <div class="author-card__name">Amy Pellegrini</div>
        <div class="author-card__bio">
          AI Product Engineer &amp; Tech Lead based in Barcelona.
          Building human-in-the-loop agentic AI workflows at Thoughtworks.
        </div>
      </div>
    </div>
  </div>
</section>

<section class="related">
  <div class="container">
    <p class="related__title">// more writing</p>
    <a href="/movements-of-the-wrist" class="related__item">
      <div class="related__item-title">Movements of the Wrist &mdash; Anatomy for Pianists</div>
      <div class="related__item-desc">
        A lesson covering flexion, extension, ulnar and radial deviation
        of the wrist. Understanding these concepts helps reduce excess
        effort and injury risk.
      </div>
    </a>
  </div>
</section>
