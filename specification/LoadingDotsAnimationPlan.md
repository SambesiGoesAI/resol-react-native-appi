# Specification: Animated Loading Dots in Chat Loading Bubble

## Objective
Enhance the chat loading bubble in `ChatContainer.tsx` by animating the three dots to visually indicate that the AI is actively generating a reply.

## Current Behavior
- The loading bubble displays three static dots using `<View>` components.
- No animation or visual feedback beyond static dots.

## Proposed Enhancement

### Overview
Use React Native's Animated API to animate the opacity of each dot in a sequential, looping pattern to create a "typing" or "loading" effect.

### Detailed Plan

1. **Replace Static Dots with Animated.Views**
   - Import `Animated` from `react-native`.
   - Replace each dot `<View>` with `<Animated.View>`.

2. **Create Animated Opacity Values**
   - Initialize three `Animated.Value` instances, one for each dot's opacity.
   - Set initial opacity to 0 or 1 as desired.

3. **Define Animation Sequence**
   - For each dot, create an opacity animation that fades in and out.
   - Use `Animated.sequence` to define fade-in and fade-out steps.
   - Use `Animated.stagger` or delay to offset the start times of each dot's animation, creating a wave effect.

4. **Loop the Animation**
   - Use `Animated.loop` to continuously repeat the animation sequence while the loading indicator is visible.

5. **Start and Stop Animation**
   - Start the animation when the loading indicator mounts.
   - Stop the animation when the loading indicator unmounts or loading ends to avoid memory leaks.

6. **Styling**
   - Maintain existing dot size, color, and spacing.
   - Ensure dark mode styles are applied to animated dots.

7. **Testing**
   - Verify smooth, continuous animation of dots.
   - Confirm animation stops when loading ends.
   - Test in both light and dark modes.

## Deliverables
- Updated `ChatContainer.tsx` with animated loading dots.
- Clean and maintainable animation code.
- Documentation or comments explaining animation logic.

---

This plan outlines the steps to implement animated loading dots in the chat loading bubble to improve user experience during AI reply wait times.