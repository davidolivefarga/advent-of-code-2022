# 🌲 Advent of Code 2022 🌲

Solutions for the [Advent of Code 2022](https://adventofcode.com/2022) puzzles, written in Javascript.

Every day of Advent two new puzzles are released, but you need to solve the first to unlock the second. Each puzzle grants a star, so the objective is to get all 50 stars. My aim is to code efficient solutions and provide an explanation for each of them.

Thanks [Eric Wastl](https://twitter.com/ericwastl) for organising this event!

## Project structure

Every day has its own folder with the following files:

- `input.txt`: raw input
- `input.js`: formatted input
- `puzzle1.js`: solution to the first puzzle
- `puzzle2.js`: solution to the second puzzle
- `README.md`: explanation for both solutions

_Note_: both puzzles always share the same input, that's why there's only one input file.

## How to run

There are three commands:

- `npm run create-files`: creates the folder and files for a given day.

  Example:

  ```sh
  # Creates the folder and files for Day 1
  npm run create-files -- 1
  ```

  _Note_: since the puzzle input depends on the user, you will need to authenticate yourself in order to fetch it. You can do so by storing your session cookie in a `.env` variable called `AOC_SESSION_COOKIE`, obtained by inspecting the network requests to the Advent of Code website.

- `npm run add-stars`: adds the puzzle stars of a given day to the main README.

  Example:

  ```sh
  # Adds the stars for Day 1
  npm run add-stars -- 1
  ```

- `npm run solution`: runs any solution specifying the day and the puzzle.

  Example:

  ```sh
  # Runs the solution of Day 1 - Puzzle 2
  npm run solution -- 1 2
  ```

## Solved puzzles

Here's the list of all days, along with the stars obtained in each of them.

| Day                               |  Stars  |
| :-------------------------------- | :-----: |
| [Day 1: Calorie Counting](./day1) | ⭐️ ⭐️ |
